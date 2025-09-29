<template>
  <div
    class="flex px-4 hover:bg-negative gap-2 items-center bg-dark border rounded-md border-dashed border-Red400"
  >
    <div class="flex flex-2 justify-center gap-2 items-center">
      <span> {{ props.text }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    default: 'Copy that',
  },
})
</script>
