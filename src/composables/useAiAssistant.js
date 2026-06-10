/**
 * useAiAssistant — Composable principal del Asistente IA
 *
 * Responsabilidades:
 * - Estado global del asistente (abierto/cerrado, mensajes, loading, streaming)
 * - Orquestación: knowledge → contextBuilder → groqClient
 * - Acciones rápidas (resume, pitch, tech, projects)
 * - NO contiene lógica de UI
 * - NO construye prompts directamente (delega a contextBuilder)
 * - NO se comunica con Groq directamente (delega a groqClient)
 */

import { ref, computed, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { groqProvider } from 'src/services/ai/groqClient'
import { loadKnowledgeBase } from 'src/services/knowledge/knowledgeService'
import {
  buildPrompt,
  buildQuickActionPrompt,
  GREETING_MESSAGE,
  SUGGESTED_QUESTIONS,
  QUICK_ACTIONS,
} from 'src/services/knowledge/contextBuilder'

/** ID único para mensajes */
let msgId = 0

export function useAiAssistant() {
  const { locale } = useI18n()

  /* ─── Estado ─── */
  const isOpen = ref(false)
  const isProcessing = ref(false)
  const isLoaded = ref(false)
  const error = ref(null)
  const messages = ref([])
  const knowledgeBase = ref({ me: null, about: null, xpData: null })
  const currentModel = ref('')

  /** Provider de IA (inicializado lazy) */
  let provider = null

  /* ─── Getters ─── */
  const suggestedQuestions = computed(() => {
    return SUGGESTED_QUESTIONS[locale.value] ?? SUGGESTED_QUESTIONS.en
  })

  const quickActionsList = computed(() => {
    return QUICK_ACTIONS[locale.value] ?? QUICK_ACTIONS.en
  })

  const greetingMessage = computed(() => {
    return GREETING_MESSAGE[locale.value] ?? GREETING_MESSAGE.en
  })

  /* ─── Inicialización ─── */
  async function init() {
    if (isLoaded.value) return

    try {
      knowledgeBase.value = await loadKnowledgeBase()

      const apiKey = import.meta.env.VITE_GROQ_API_KEY

      // ╔══════════════════════════════════════════════════════════════╗
      // ║  🥷  ESTA API KEY ESTA ACÁ A PROPÓSITO  🥷                 ║
      // ║                                                              ║
      // ║  Sí, la viste. Está hardcodeada en el bundle.               ║
      // ║  No, no me olvidé de sacarla — es un portfolio personal     ║
      // ║  y la key es de Groq (no de mi banco).                      ║
      // ║                                                              ║
      // ║  Por favor: NO la uses, NO la compartas, NO me gastes       ║
      // ║  los créditos gratis de Groq que tan buen precio me         ║
      // ║  salieron (?
      // ║                                                              ║
      // ║  Si llegaste hasta acá: gracias por curiosear, y si         ║
      // ║  querés contratar a Isaac, mandale un mail                  ║
      // ║  → isaitodaniel@gmail.com                                   ║
      // ║                                                              ║
      // ║  Atentamente,                                               ║
      // ║  El dev que sabía lo que hacía (?
      // ╚══════════════════════════════════════════════════════════════╝

      if (apiKey) {
        console.warn(
          '%c[AI Assistant] 🥷 Groq API key detectada. ' +
            'Si estás curioseando el bundle: sí, está a propósito. ' +
            'No la uses, no me gastes los créditos. Gracias ✌️',
          'color: #f59e0b; font-weight: bold; font-size: 12px;',
        )
      }

      provider = groqProvider({
        apiKey: apiKey || '',
        temperature: 0.7,
        maxTokens: 1024,
      })

      currentModel.value = provider.name()

      isLoaded.value = true
    } catch (err) {
      console.error('[useAiAssistant] Init error:', err)
      error.value = err.message
    }
  }

  /* ─── Abrir / Cerrar ─── */
  function toggleOpen() {
    if (!isOpen.value) init()
    isOpen.value = !isOpen.value
  }

  function open() {
    if (!isOpen.value) init()
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  /* ─── Agregar mensaje ─── */
  function addMessage(role, content, extras = {}) {
    messages.value.push({
      id: ++msgId,
      role,
      content,
      timestamp: Date.now(),
      ...extras,
    })
  }

  /* ─── Enviar mensaje ─── */
  async function sendMessage(content) {
    if (!content?.trim() || isProcessing.value) return

    const question = content.trim()

    // 1. Agregar mensaje del usuario
    addMessage('user', question)

    // 2. Estado processing
    isProcessing.value = true
    error.value = null

    await nextTick()

    try {
      // 3. Breve pausa para que se vea el typing indicator
      await new Promise((r) => setTimeout(r, 400))

      // 4. Construir prompt con contexto inteligente
      const history = messages.value
        .filter((m) => m.role !== 'system')
        .slice(-10, -1)
        .map((m) => ({ role: m.role, content: m.content }))

      const promptMessages = buildPrompt(question, knowledgeBase.value, locale.value, history)

      // 5. Enviar a Groq (con fallback automático de modelos)
      const result = await provider.send(promptMessages)

      // 6. Agregar respuesta con metadatos del modelo y flag para animación
      currentModel.value = result.model
      addMessage('assistant', result.content, {
        model: result.model,
        modelId: result.modelId,
        isStreaming: true,
      })
    } catch (err) {
      console.error('[useAiAssistant] Error sending message:', err)
      error.value = err.message || getErrorMessage(err, locale.value)

      addMessage('assistant', getErrorMessage(err, locale.value), {
        model: currentModel.value || 'Error',
        isStreaming: false,
      })
    } finally {
      isProcessing.value = false
    }
  }

  /* ─── Acción rápida ─── */
  async function triggerQuickAction(actionId) {
    if (isProcessing.value) return

    isProcessing.value = true
    error.value = null

    try {
      const promptMessages = buildQuickActionPrompt(actionId, knowledgeBase.value, locale.value)

      const userMsg = promptMessages.findLast((m) => m.role === 'user')
      if (userMsg) {
        const match = userMsg.content.match(/=== PREGUNTA ===\n\n([\s\S]*)/)
        const displayQuestion = match?.[1]?.trim() ?? actionId
        addMessage('user', displayQuestion)
      }

      await nextTick()

      const result = await provider.send(promptMessages)

      currentModel.value = result.model
      addMessage('assistant', result.content, {
        model: result.model,
        modelId: result.modelId,
        isStreaming: true,
      })
    } catch (err) {
      console.error('[useAiAssistant] Quick action error:', err)
      error.value = err.message
      addMessage('assistant', getErrorMessage(err, locale.value), {
        model: currentModel.value || 'Error',
        isStreaming: false,
      })
    } finally {
      isProcessing.value = false
    }
  }

  /* ─── Marcar mensaje como no-streaming (lo llama el componente al terminar animación) ─── */
  function markMessageComplete(messageId) {
    const msg = messages.value.find((m) => m.id === messageId)
    if (msg) {
      msg.isStreaming = false
    }
  }

  /* ─── Resetear chat ─── */
  function resetChat() {
    messages.value = []
    error.value = null
  }

  /* ─── Helpers ─── */
  function getErrorMessage(err, lang) {
    const msg = err.message ?? ''
    if (msg.includes('401') || msg.includes('API key') || msg.includes('autenticación')) {
      return lang === 'es'
        ? 'La API key de Groq no está configurada correctamente. Revisá el archivo .env'
        : 'The Groq API key is not configured correctly. Check the .env file'
    }
    if (msg.includes('429') || msg.includes('rate')) {
      return lang === 'es'
        ? 'Todos los modelos están en su límite. Esperá un momento y volvé a intentar.'
        : 'All models are rate-limited. Please wait and try again.'
    }
    if (msg.includes('Todos los modelos')) {
      return lang === 'es'
        ? 'No se pudo conectar con ningún modelo de IA. Intentá de nuevo más tarde.'
        : 'Could not connect to any AI model. Please try again later.'
    }
    return lang === 'es'
      ? 'Ups, algo salió mal. Intentalo de nuevo.'
      : 'Oops, something went wrong. Please try again.'
  }

  return {
    // Estado
    isOpen,
    isProcessing,
    isLoaded,
    error,
    messages,
    knowledgeBase,
    currentModel,
    suggestedQuestions,
    quickActionsList,
    greetingMessage,

    // Acciones
    toggleOpen,
    open,
    close,
    sendMessage,
    triggerQuickAction,
    markMessageComplete,
    resetChat,
    init,
  }
}
