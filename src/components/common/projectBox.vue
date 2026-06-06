<script setup>
import { QIcon } from 'quasar'
import TextBox from './TextBox.vue'

const props = defineProps({
  id: String,
  name: String,
  description: String,
  relevant: {
    type: Boolean,
    default: false,
  },
  image: String,
  languages: Array,
  tools: Array,
})
</script>

<template>
  <div
    class="flex flex-1 md:basis-[calc(50%-1rem)] lg:basis-[calc(33.333%-1rem)] hover:bg-negative gap-2 items-center bg-dark border rounded-xl border-Neutral700 overflow-hidden"
  >
    <q-img
      alt="preview"
      :src="image"
      class="transition-transform duration-300 ease-in-out hover:scale-110"
    ></q-img>
    <div class="flex m-2 flex-col gap-2 pb-4">
      <div class="pt-4 flex items-center justify-between">
        <span class="text-weight-bolder text-2xl"> {{ $t(props.name) }}</span>
        <q-icon size="1.5rem" name="more_vert"></q-icon>
      </div>
      <p class="text-positive">{{ $t(props.description) }}</p>
      <div class="flex md:justify-center gap-2">
        <TextBox class="" v-for="(language, i) in languages" :key="i" :text="language"> </TextBox>
      </div>
    </div>
  </div>
</template>
