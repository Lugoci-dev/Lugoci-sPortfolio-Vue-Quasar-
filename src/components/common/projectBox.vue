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
    class="flex flex-1 hover:bg-negative gap-2 items-center bg-dark border rounded-md border-Neutral700 p-2 overflow-hidden"
  >
    <q-img
      alt="preview"
      :src="image"
      class="transition-transform duration-300 ease-in-out not-hover:rounded-lg hover:scale-110"
    ></q-img>
    <div class="flex flex-col gap-2 pb-4">
      <div class="pt-4 flex items-center justify-between">
        <span class="text-weight-bolder text-2xl"> {{ props.name }}</span>
        <q-icon size="1.5rem" name="more_vert"></q-icon>
      </div>
      <p class="text-positive">{{ props.description }}</p>
      <div class="flex md:justify-center gap-2">
        <TextBox class="" v-for="(language, i) in languages" :key="i" :text="language"> </TextBox>
      </div>
    </div>
  </div>
</template>
