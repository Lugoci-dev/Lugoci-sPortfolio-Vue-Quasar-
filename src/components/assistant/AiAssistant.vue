<template>
  <div>
    <!-- ── FAB Button con animación periódica ── -->
    <div v-if="!assistant.isOpen.value" class="fixed z-[6000] bottom-16 right-6">
      <!-- Tooltip burbuja que aparece periódicamente -->
      <transition name="tooltip-pop">
        <div
          v-if="showTooltip"
          class="absolute bottom-full right-0 mb-3 pointer-events-none select-none"
        >
          <div
            class="relative px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap shadow-lg"
            :class="locale === 'es' ? 'bg-Red400 text-white' : 'bg-Red400 text-white'"
          >
            <!-- Texto según idioma -->
            <template v-if="locale === 'es'">✨ ¡Preguntame lo que quieras!</template>
            <template v-else>✨ Ask me anything!</template>
            <!-- Flechita -->
            <div
              class="absolute -bottom-1.5 right-6 w-3 h-3 rotate-45"
              :class="locale === 'es' ? 'bg-Red400' : 'bg-Red400'"
            />
          </div>
        </div>
      </transition>

      <button
        class="relative w-14 h-14 rounded-full bg-Red500 text-white shadow-xl hover:bg-Red700 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center fab-pulse"
        aria-label="Abrir asistente IA"
        @click="assistant.open()"
      >
        <q-icon name="smart_toy" size="1.8rem" />
      </button>
    </div>

    <!-- ── Backdrop FULL (opaca todo el fondo) ── -->
    <transition name="backdrop">
      <div
        v-if="assistant.isOpen.value"
        class="fixed inset-0 z-[5999] bg-black/50 backdrop-blur-sm"
        @click="assistant.close()"
      />
    </transition>

    <!-- ── Panel del asistente ── -->
    <transition name="panel">
      <div
        v-if="assistant.isOpen.value"
        class="fixed inset-0 z-[6000] pointer-events-none flex items-center justify-end pr-3 md:pr-6"
      >
        <div
          class="pointer-events-auto flex flex-col rounded-2xl shadow-2xl border border-adaptive/10 card-bg overflow-hidden panel-content"
          :class="panelClasses"
        >
          <!-- Header (siempre visible, no scrolleable) -->
          <div
            class="flex items-center justify-between px-5 py-3.5 border-b border-adaptive/10 flex-shrink-0"
          >
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full bg-Red400/15 flex items-center justify-center">
                <q-icon name="smart_toy" size="1.2rem" class="text-Red400" />
              </div>
              <div>
                <h3 class="text-sm font-bold text-adaptive-dark leading-tight">Asistente IA</h3>
                <p class="text-[10px] text-adaptive-mid leading-tight opacity-70">
                  Portfolio de Isaac
                </p>
              </div>
            </div>

            <div class="flex items-center gap-1">
              <button
                class="w-7 h-7 rounded-lg flex items-center justify-center text-adaptive-mid/60 hover:text-Red400 hover:bg-Red400/10 transition-all duration-200 cursor-pointer"
                aria-label="Resetear conversación"
                title="Resetear"
                @click="handleReset"
              >
                <q-icon name="refresh" size="1rem" />
              </button>
              <button
                class="w-7 h-7 rounded-lg flex items-center justify-center text-adaptive-mid/60 hover:text-Red400 hover:bg-Red400/10 transition-all duration-200 cursor-pointer"
                aria-label="Cerrar asistente"
                @click="assistant.close()"
              >
                <q-icon name="close" size="1.1rem" />
              </button>
            </div>
          </div>

          <!-- Chat messages (scrolleable) -->
          <div ref="messagesContainer" class="flex-1 overflow-y-auto scroll-smooth">
            <!-- Padding interno para que ningún mensaje quede pegado al header -->
            <div class="pt-4 pb-2 px-3">
              <!-- Mensaje de bienvenida (cuando no hay historial) -->
              <div v-if="messages.length === 0" class="px-1">
                <p class="text-sm text-adaptive-dark whitespace-pre-wrap leading-relaxed">
                  {{ assistant.greetingMessage.value }}
                </p>

                <!-- Quick Actions -->
                <div class="mt-5">
                  <p
                    class="text-[10px] uppercase tracking-widest text-adaptive-mid/50 font-semibold px-1 mb-2"
                  >
                    {{ locale === 'es' ? 'Acciones rápidas' : 'Quick Actions' }}
                  </p>
                  <AiQuickActions
                    :actions="assistant.quickActionsList.value"
                    @trigger="handleQuickAction"
                  />
                </div>

                <!-- Suggested Questions -->
                <div class="mt-4">
                  <p
                    class="text-[10px] uppercase tracking-widest text-adaptive-mid/50 font-semibold px-1 mb-2"
                  >
                    {{ locale === 'es' ? 'Preguntas sugeridas' : 'Suggested Questions' }}
                  </p>
                  <AiSuggestedQuestions
                    :questions="assistant.suggestedQuestions.value"
                    @select="handleSend"
                  />
                </div>
              </div>

              <!-- Messages del chat -->
              <div v-for="msg in messages" :key="msg.id" class="mb-3 last:mb-0">
                <AiChatMessage :message="msg" @stream-complete="handleStreamComplete" />
              </div>

              <!-- Error message -->
              <div v-if="assistant.error.value" class="mb-3 px-1">
                <div
                  class="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-500"
                >
                  {{ assistant.error.value }}
                </div>
              </div>

              <!-- Loading state: burbuja del assistant pensando -->
              <div v-if="assistant.isProcessing.value && !hasStreamingMessage" class="mb-3">
                <div class="flex items-start gap-2 flex-row px-1">
                  <div
                    class="w-7 h-7 rounded-full bg-Neutral600/20 flex items-center justify-center text-[10px] font-bold text-Neutral300 flex-shrink-0 mt-1"
                  >
                    IA
                  </div>
                  <div
                    class="rounded-2xl rounded-bl-md border border-adaptive/10 card-bg px-5 py-3.5"
                  >
                    <span class="text-xl leading-none tracking-[0.15em] text-Red400"> ... </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Input area (siempre visible abajo) -->
          <div class="flex-shrink-0 border-t border-adaptive/10 px-4 py-3">
            <form class="flex items-center gap-2" @submit.prevent="handleSubmit">
              <input
                ref="inputRef"
                v-model="inputText"
                type="text"
                :placeholder="inputPlaceholder"
                class="flex-1 px-4 py-2.5 rounded-xl text-sm bg-Neutral800/50 border border-adaptive/10 text-adaptive-dark placeholder:text-adaptive-mid/35 focus:outline-none focus:border-Red400/40 focus:ring-1 focus:ring-Red400/20 transition-all duration-200"
                :disabled="assistant.isProcessing.value"
              />
              <button
                type="submit"
                class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 cursor-pointer"
                :class="
                  canSend || assistant.isProcessing.value
                    ? 'bg-Red400 text-white hover:bg-Red700 shadow-sm'
                    : 'bg-Neutral600/20 text-adaptive-mid/40'
                "
                :disabled="!canSend && !assistant.isProcessing.value"
                aria-label="Enviar mensaje"
              >
                <q-spinner v-if="assistant.isProcessing.value" size="1.2rem" class="text-white" />
                <q-icon v-else name="send" size="1.1rem" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAiAssistant } from 'src/composables/useAiAssistant'
import AiChatMessage from 'src/components/assistant/AiChatMessage.vue'
import AiSuggestedQuestions from 'src/components/assistant/AiSuggestedQuestions.vue'
import AiQuickActions from 'src/components/assistant/AiQuickActions.vue'

const { locale } = useI18n()
const assistant = useAiAssistant()

const inputText = ref('')
const inputRef = ref(null)
const messagesContainer = ref(null)
const showTooltip = ref(false)

const { messages, isProcessing } = assistant

/* ─── Tooltip periódico ─── */
let tooltipTimer = null
let tooltipInterval = null

function startTooltipCycle() {
  // Primera aparición a los 3s
  tooltipTimer = setTimeout(() => {
    showTooltip.value = true
    // Se oculta a los 4s
    setTimeout(() => {
      showTooltip.value = false
    }, 4000)
  }, 3000)

  // Repetir cada 15s
  tooltipInterval = setInterval(() => {
    showTooltip.value = true
    setTimeout(() => {
      showTooltip.value = false
    }, 4500)
  }, 15000)
}

function stopTooltipCycle() {
  if (tooltipTimer) {
    clearTimeout(tooltipTimer)
    tooltipTimer = null
  }
  if (tooltipInterval) {
    clearInterval(tooltipInterval)
    tooltipInterval = null
  }
  showTooltip.value = false
}

onMounted(() => {
  if (!assistant.isOpen.value) {
    startTooltipCycle()
  }
})

onUnmounted(() => {
  stopTooltipCycle()
})

watch(
  () => assistant.isOpen.value,
  (open) => {
    if (!open) {
      startTooltipCycle()
    } else {
      stopTooltipCycle()
    }
  },
)

/* ─── Placeholder ─── */
const inputPlaceholder = computed(() => {
  if (isProcessing.value) {
    return locale.value === 'es' ? 'Esperando respuesta...' : 'Waiting for response...'
  }
  return locale.value === 'es' ? 'Preguntá sobre Isaac...' : 'Ask about Isaac...'
})

const canSend = computed(() => {
  return inputText.value.trim().length > 0 && !isProcessing.value
})

/* ─── Detectar si ya hay un mensaje del assistant haciendo streaming ─── */
const hasStreamingMessage = computed(() => {
  return messages.value.some((m) => m.role === 'assistant' && m.isStreaming)
})

/* ─── Panel classes responsive ─── */
const panelClasses = computed(() => {
  return [
    // Desktop
    'md:w-[400px] md:h-[620px] md:max-h-[calc(100vh-8rem)]',
    // Mobile: más compacto
    'w-full h-[85vh] max-h-[85vh]',
  ]
})

/* ─── Scroll al fondo ─── */
async function scrollToBottom() {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

watch(
  () => messages.value.length,
  () => scrollToBottom(),
)

watch(
  () => isProcessing.value,
  () => {
    if (isProcessing.value) scrollToBottom()
  },
)

/* ─── Handlers ─── */
function handleSubmit() {
  if (!canSend.value) return
  const text = inputText.value
  inputText.value = ''
  assistant.sendMessage(text)
}

function handleSend(question) {
  assistant.sendMessage(question)
}

async function handleQuickAction(actionId) {
  assistant.triggerQuickAction(actionId)
}

function handleReset() {
  assistant.resetChat()
  inputText.value = ''
}

function handleStreamComplete(messageId) {
  assistant.markMessageComplete(messageId)
}

/* ─── Init ─── */
assistant.init()

/* ─── Auto-focus en input ─── */
watch(
  () => assistant.isOpen.value,
  async (open) => {
    if (open) {
      await nextTick()
      setTimeout(() => inputRef.value?.focus(), 400)
    }
  },
)
</script>

<style scoped>
/* ═══════════════════════════════════════════
   PANEL: Slide desde la derecha con scale
   ═══════════════════════════════════════════ */

.panel-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.panel-leave-active {
  transition: all 0.25s ease-in;
}

.panel-enter-from {
  opacity: 0;
  transform: translateX(60px) scale(0.95);
}

.panel-enter-to {
  opacity: 1;
  transform: translateX(0) scale(1);
}

.panel-leave-from {
  opacity: 1;
  transform: translateX(0) scale(1);
}

.panel-leave-to {
  opacity: 0;
  transform: translateX(40px) scale(0.95);
}

/* Mobile: slide up desde abajo */
@media (max-width: 767px) {
  .panel-enter-from {
    transform: translateY(40px) scale(0.95);
  }
  .panel-leave-to {
    transform: translateY(30px) scale(0.95);
  }
}

/* ═══════════════════════════════════════════
   BACKDROP: Fade suave
   ═══════════════════════════════════════════ */

.backdrop-enter-active {
  transition: opacity 0.3s ease;
}
.backdrop-leave-active {
  transition: opacity 0.25s ease;
}
.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

/* ═══════════════════════════════════════════
   TOOLTIP: Pop desde abajo
   ═══════════════════════════════════════════ */

.tooltip-pop-enter-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.tooltip-pop-leave-active {
  transition: all 0.2s ease-in;
}
.tooltip-pop-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.9);
}
.tooltip-pop-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.tooltip-pop-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.9);
}

/* ═══════════════════════════════════════════
   FAB BUTTON: Pulse periódico
   ═══════════════════════════════════════════ */

.fab-pulse {
  animation: fabAttention 4s ease-in-out infinite;
}

@keyframes fabAttention {
  0%,
  100% {
    box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
  }
  30% {
    box-shadow:
      0 4px 25px rgba(231, 76, 60, 0.5),
      0 0 0 0 rgba(231, 76, 60, 0.4);
  }
  35% {
    box-shadow:
      0 4px 25px rgba(231, 76, 60, 0.5),
      0 0 0 12px rgba(231, 76, 60, 0);
  }
  40% {
    box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
  }
  70% {
    transform: scale(1);
  }
  75% {
    transform: scale(1.08);
  }
  80% {
    transform: scale(1);
  }
}

/* ═══════════════════════════════════════════
   PANEL CONTENT: Sutil glow en borde
   ═══════════════════════════════════════════ */

.panel-content {
  animation: panelAppear 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes panelAppear {
  from {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }
  to {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  }
}

/* ═══════════════════════════════════════════
   PANEL CONTENT: Sutil glow en borde
   ═══════════════════════════════════════════ */

.thinking-dot {
  animation: thinkingBounce 1.2s ease-in-out infinite;
}

@keyframes thinkingBounce {
  0%,
  60%,
  100% {
    opacity: 0.3;
    transform: translateY(0);
  }
  30% {
    opacity: 1;
    transform: translateY(-4px);
  }
}
</style>
