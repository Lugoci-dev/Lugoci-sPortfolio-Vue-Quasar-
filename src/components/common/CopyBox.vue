<template>
  <div
    class="flex flex-2 card-hover justify-between gap-2 items-center card-bg border rounded-md card-border p-2"
  >
    <div class="flex flex-2 justify-center gap-2 items-center text-adaptive-mid">
      <q-icon size="1.5rem" :name="boxIcon" />
      <span> {{ props.textLink }}</span>
    </div>
    <button @click="copyText" class="cursor-pointer text-adaptive-mid">
      <q-icon class="card-icon-bg p-1.5 rounded-md" :name="copied ? 'check' : 'content_copy'" />
    </button>
  </div>
</template>

<script setup>
import { useClipboard } from 'src/composables/useClipboard'

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

const { copied, copy } = useClipboard()

const copyText = () => {
  copy(props.textLink)
}
</script>
