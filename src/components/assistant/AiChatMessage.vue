<template>
  <div class="flex w-full gap-2" :class="message.role === 'user' ? 'flex-row-reverse' : 'flex-row'">
    <!-- Avatar -->
    <div
      class="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm mt-1"
      :class="
        message.role === 'user' ? 'bg-Red400/20 text-Red400' : 'bg-Neutral600/20 text-Neutral300'
      "
    >
      {{ message.role === 'user' ? 'Tú' : 'IA' }}
    </div>

    <!-- Burbuja -->
    <div
      class="relative max-w-[88%] rounded-2xl text-sm leading-relaxed overflow-hidden"
      :class="bubbleClass"
    >
      <!-- Markdown renderizado -->
      <div ref="contentRef" class="px-4 py-2.5 markdown-content" v-html="renderedHTML" />

      <!-- Cursor titilante durante la animación -->
      <span
        v-if="isAnimating"
        class="inline-block w-[3px] h-[1em] bg-Red400/60 align-text-bottom ml-0.5 cursor-blink"
      />

      <!-- Model indicator sutil -->
      <div
        v-if="message.role === 'assistant' && message.model && !isAnimating"
        class="px-4 pb-1.5 text-[10px] text-adaptive-mid/30 text-right select-none"
      >
        via {{ message.model }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { marked } from 'marked'

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['streamComplete'])

const contentRef = ref(null)
const displayLength = ref(0)
const isAnimating = ref(false)
let animationTimer = null

const fullContent = computed(() => props.message.content || '')
const isUser = computed(() => props.message.role === 'user')

/* ─── Iniciar typing animation si es un mensaje nuevo del assistant ─── */
onMounted(() => {
  if (!isUser.value && props.message.isStreaming && fullContent.value.length > 0) {
    startTyping()
  } else {
    // Mostrar completo: mensajes de usuario + assistant no-streaming
    displayLength.value = fullContent.value.length
  }
})

onUnmounted(() => {
  stopTyping()
})

/* ─── Detectar si el mensaje se reemplazó (cambio de contenido) ─── */
watch(
  () => props.message.content,
  (newContent, oldContent) => {
    if (!isUser.value && newContent !== oldContent && props.message.isStreaming) {
      stopTyping()
      startTyping()
    }
  },
)

watch(
  () => props.message.isStreaming,
  (streaming) => {
    if (!isUser.value && streaming && fullContent.value.length > 0) {
      stopTyping()
      startTyping()
    } else if (!streaming && displayLength.value < fullContent.value.length) {
      // Si ya no es streaming pero no terminamos de animar, mostrar todo
      displayLength.value = fullContent.value.length
      isAnimating.value = false
    }
  },
)

/* ─── Typing animation ─── */
function startTyping() {
  displayLength.value = 0
  isAnimating.value = true

  const totalChars = fullContent.value.length
  // Velocidad variable: más lento para respuestas cortas, más rápido para largas
  const baseSpeed = 18 // ms por caracter
  const charsPerTick = totalChars > 600 ? 4 : totalChars > 300 ? 3 : 2

  animationTimer = setInterval(() => {
    const next = Math.min(displayLength.value + charsPerTick, totalChars)
    displayLength.value = next

    if (next >= totalChars) {
      stopTyping()
      emit('streamComplete', props.message.id)
    }
  }, baseSpeed)
}

function stopTyping() {
  if (animationTimer) {
    clearInterval(animationTimer)
    animationTimer = null
  }
  isAnimating.value = false
}

/* ─── Texto visible (parcial o completo) ─── */
const visibleText = computed(() => {
  return fullContent.value.slice(0, displayLength.value)
})

/* ─── Render markdown ─── */
const renderedHTML = computed(() => {
  const text = visibleText.value
  if (!text) return ''

  try {
    return marked.parse(text, {
      breaks: true,
      gfm: true,
    })
  } catch {
    // Fallback: escapar HTML y mostrar como texto plano
    return escapeHtml(text)
  }
})

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>')
}

/* ─── Bubble classes ─── */
const bubbleClass = computed(() => {
  if (isUser.value) {
    return 'bg-Red400/15 text-adaptive-dark rounded-br-md'
  }
  return 'card-bg text-adaptive-dark border border-adaptive/10 rounded-bl-md'
})
</script>

<style scoped>
/* ─── Markdown content styles ─── */
.markdown-content {
  word-break: break-word;
}

.markdown-content :deep(p) {
  margin-bottom: 0.5rem;
  line-height: 1.65;
}

.markdown-content :deep(p:last-child) {
  margin-bottom: 0;
}

.markdown-content :deep(strong) {
  font-weight: 700;
  color: hsl(3, 86%, 64%);
}

.body--dark .markdown-content :deep(strong) {
  color: hsl(3, 86%, 64%);
}

.markdown-content :deep(em) {
  font-style: italic;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  padding-left: 1.25rem;
  margin-bottom: 0.5rem;
}

.markdown-content :deep(li) {
  margin-bottom: 0.25rem;
  line-height: 1.6;
}

.markdown-content :deep(code) {
  font-family: 'Inconsolata', monospace;
  font-size: 0.8em;
  padding: 0.15em 0.4em;
  border-radius: 4px;
  background: hsl(226, 11%, 37%, 0.15);
}

.body--dark .markdown-content :deep(code) {
  background: hsl(226, 11%, 37%, 0.25);
}

.markdown-content :deep(pre) {
  margin: 0.5rem 0;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  overflow-x: auto;
  background: hsl(226, 25%, 17%);
  border: 1px solid hsl(226, 11%, 37%, 0.2);
}

.body--dark .markdown-content :deep(pre) {
  background: hsl(227, 75%, 10%);
  border-color: hsl(226, 11%, 37%, 0.15);
}

.markdown-content :deep(pre code) {
  background: none;
  padding: 0;
  font-size: 0.8em;
}

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3) {
  font-weight: 700;
  margin: 0.75rem 0 0.25rem;
  line-height: 1.3;
}

.markdown-content :deep(h1) {
  font-size: 1.1rem;
}
.markdown-content :deep(h2) {
  font-size: 1rem;
}
.markdown-content :deep(h3) {
  font-size: 0.95rem;
}

/* ─── Cursor blinking ─── */
.cursor-blink {
  animation: blink 0.8s ease-in-out infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
