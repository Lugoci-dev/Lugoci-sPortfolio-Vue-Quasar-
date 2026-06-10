<template>
  <div class="flex flex-wrap gap-2 px-4 py-3">
    <button
      v-for="(q, i) in questions"
      :key="i"
      class="px-3 py-1.5 text-xs rounded-full border border-adaptive/20 text-adaptive-mid hover:border-Red400/40 hover:text-Red400 hover:bg-Red400/5 transition-all duration-200 cursor-pointer select-none"
      :class="{ 'animate-fade-in': true }"
      :style="{ animationDelay: `${i * 60}ms` }"
      @click="$emit('select', q)"
    >
      {{ q }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  questions: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['select'])
</script>

<style scoped>
.animate-fade-in {
  opacity: 0;
  animation: fadeInUp 0.3s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
