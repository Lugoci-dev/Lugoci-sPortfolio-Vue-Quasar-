/**
 * useAiAssistant — Composable principal del Asistente IA
 *
 * Responsabilidades:
 * - Estado global del asistente (abierto/cerrado, mensajes, loading)
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
      provider = groqProvider({
        apiKey: apiKey || '',
        model: 'llama-3.1-8b-instant',
        temperature: 0.7,
        maxTokens: 1024,
      })

      isLoaded.value = true
    } catch (err) {
      console.error('[useAiAssistant] Init error:', err)
      error.value = err.message
    }
  }

  /* ─── Abrir / Cerrar ─── */
  function toggleOpen() {
    if (!isOpen.value) {
      init()
    }
    isOpen.value = !isOpen.value
  }

  function open() {
    if (!isOpen.value) {
      init()
    }
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  /* ─── Agregar mensaje ─── */
  function addMessage(role, content) {
    messages.value.push({
      id: ++msgId,
      role,
      content,
      timestamp: Date.now(),
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

    // Scroll al fondo después del render
    await nextTick()

    try {
      // 3. Esperar un momento para que se vea el typing indicator
      await new Promise((r) => setTimeout(r, 300))

      // 4. Construir prompt con contexto inteligente
      const history = messages.value
        .filter((m) => m.role !== 'system')
        .slice(-10, -1) // últimas 10 interacciones (excluyendo la actual)
        .map((m) => ({ role: m.role, content: m.content }))

      const promptMessages = buildPrompt(question, knowledgeBase.value, locale.value, history)

      // 5. Enviar a Groq
      const reply = await provider.send(promptMessages)

      // 6. Agregar respuesta
      addMessage('assistant', reply)
    } catch (err) {
      console.error('[useAiAssistant] Error sending message:', err)
      error.value = err.message || 'Error al comunicarse con el asistente'

      addMessage('assistant', getErrorMessage(err, locale.value))
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

      // El último mensaje es del usuario — lo mostramos
      const userMsg = promptMessages.findLast((m) => m.role === 'user')
      if (userMsg) {
        // Extraer la pregunta del contenido
        const match = userMsg.content.match(/=== PREGUNTA ===\n\n([\s\S]*)/)
        const displayQuestion = match?.[1]?.trim() ?? actionId
        addMessage('user', displayQuestion)
      }

      await nextTick()

      const reply = await provider.send(promptMessages)
      addMessage('assistant', reply)
    } catch (err) {
      console.error('[useAiAssistant] Quick action error:', err)
      error.value = err.message
      addMessage('assistant', getErrorMessage(err, locale.value))
    } finally {
      isProcessing.value = false
    }
  }

  /* ─── Resetear chat ─── */
  function resetChat() {
    messages.value = []
    error.value = null
  }

  /* ─── Helpers ─── */
  function getErrorMessage(err, lang) {
    if (err.message?.includes('401') || err.message?.includes('API key')) {
      return lang === 'es'
        ? 'La API key de Groq no está configurada correctamente. Revisá el archivo .env'
        : 'The Groq API key is not configured correctly. Check the .env file'
    }
    if (err.message?.includes('429')) {
      return lang === 'es'
        ? 'Demasiadas solicitudes. Esperá un momento y volvé a intentar.'
        : 'Too many requests. Please wait a moment and try again.'
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
    suggestedQuestions,
    quickActionsList,
    greetingMessage,

    // Acciones
    toggleOpen,
    open,
    close,
    sendMessage,
    triggerQuickAction,
    resetChat,
    init,
  }
}
