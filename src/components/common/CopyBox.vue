<template>
  <div
    class="flex flex-2 hover:bg-negative justify-between gap-2 items-center bg-dark border rounded-md border-Neutral700 p-2"
  >
    <div class="flex flex-2 justify-center gap-2 items-center">
      <q-icon size="1.5rem" :name="boxIcon" />
      <span> {{ props.textLink }}</span>
    </div>
    <button :onclick="copyText" class="cursor-pointer">
      <q-icon class="bg-negative p-1.5 rounded-md" name="content_copy" />
    </button>
  </div>
</template>

<script setup>
// import { computed } from 'vue'

const props = defineProps({
  textLink: {
    type: String,
    default: 'Copy that',
  },
  boxIcon: {
    type: String,
    default: 'content_copy',
  },
})

const copyText = () => {
  console.log('Text Copied')
}
</script>
