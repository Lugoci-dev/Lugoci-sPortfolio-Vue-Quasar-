<template>
  <div class="flex w-full gap-2" :class="message.role === 'user' ? 'flex-row-reverse' : 'flex-row'">
    <!-- Avatar -->
    <div
      class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm"
      :class="
        message.role === 'user' ? 'bg-Red400/20 text-Red400' : 'bg-Neutral600/20 text-Neutral300'
      "
    >
      {{ message.role === 'user' ? 'Tú' : 'IA' }}
    </div>

    <!-- Burbuja -->
    <div
      class="relative max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words"
      :class="bubbleClass"
    >
      {{ message.content }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
})

const isUser = computed(() => props.message.role === 'user')

const bubbleClass = computed(() => {
  if (isUser.value) {
    return 'bg-Red400/15 text-adaptive-dark rounded-br-md'
  }
  return 'card-bg text-adaptive-dark border border-adaptive/10 rounded-bl-md'
})
</script>
