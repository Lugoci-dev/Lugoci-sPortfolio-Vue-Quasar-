<template>
  <div
    class="flex flex-2 card-hover justify-between gap-2 items-center card-bg border rounded-md card-border p-2"
  >
    <div class="flex flex-2 justify-center gap-2 items-center text-adaptive-mid">
      <q-icon size="1.5rem" :name="linkIcon" />
      <span> {{ props.textLink }}</span>
    </div>
    <a :href="target" target="blank" class="text-adaptive-mid">
      <q-icon class="card-icon-bg p-1.5 rounded-md" :name="actionIcon" />
    </a>
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
  redirectTo: {
    type: Boolean,
  },
  target: {
    type: String,
    default: 'https://www.google.com',
  },
})
</script>
