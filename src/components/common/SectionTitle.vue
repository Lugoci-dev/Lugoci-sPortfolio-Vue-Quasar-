<template>
  <p class="text-lg font-bold text-adaptive-dark mb-4 flex items-center gap-2">
    <span class="w-1 h-5 bg-accent rounded-full inline-block" />
    <slot>{{ label }}</slot>
  </p>
</template>

<script setup>
defineProps({
  label: { type: String, default: '' },
})
</script>
