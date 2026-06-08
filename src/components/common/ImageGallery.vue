<template>
  <div v-if="images.length" class="grid grid-cols-3 gap-4">
    <div
      v-if="visibleImages[0]"
      class="col-span-3 rounded-xl overflow-hidden card-bg card-border border cursor-pointer group"
      @click="$emit('open', 0)"
    >
      <img
        :src="visibleImages[0]"
        :alt="alt ? `${alt} 1` : 'screenshot 1'"
        class="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
    </div>

    <template v-for="(img, i) in visibleImages.slice(1)" :key="i">
      <div
        class="relative rounded-xl overflow-hidden card-bg card-border border cursor-pointer group aspect-square"
      >
        <img
          :src="img"
          :alt="alt ? `${alt} ${i + 2}` : `screenshot ${i + 2}`"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          @click="$emit('open', i + 1)"
        />
        <div
          v-if="i === maxVisible - 2 && remainingCount > 0"
          class="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors"
          @click="$emit('open', maxVisible - 1)"
        >
          <span class="text-white text-3xl font-bold">+{{ remainingCount }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  images: { type: Array, required: true },
  maxVisible: { type: Number, default: 4 },
  alt: { type: String, default: '' },
})

defineEmits(['open'])

const visibleImages = computed(() => props.images.slice(0, props.maxVisible))
const remainingCount = computed(() => Math.max(0, props.images.length - props.maxVisible))
</script>
