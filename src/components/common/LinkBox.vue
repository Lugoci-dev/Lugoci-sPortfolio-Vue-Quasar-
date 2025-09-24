<template>
  <div
    class="flex flex-2 justify-between gap-2 items-center bg-dark border rounded-md border-Neutral700 p-2"
  >
    <div class="flex flex-2 justify-center gap-2 items-center">
      <q-icon size="1.5rem" :name="linkIcon" />
      <span> {{ props.textLink }}</span>
    </div>
    <q-icon class="bg-negative p-1.5 rounded-md" :name="actionIcon" />
  </div>
</template>

<script setup>
// import { computed } from 'vue'

const props = defineProps({
  textLink: {
    type: String,
    default: 'Go to',
  },
  linkIcon: {
    type: String,
  },
  actionIcon: {
    type: String,
    default: 'open_in_new',
  },
})
</script>
