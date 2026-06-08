<template>
  <section v-if="items.length" class="flex flex-col items-start">
    <ul class="space-y-3">
      <li v-for="(item, i) in visibleItems" :key="i" class="flex flex-row gap-2 text-adaptive-mid">
        <svg class="w-5 h-5 shrink-0 text-accent" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="flex-1">{{ item }}</span>
      </li>
    </ul>

    <button
      v-if="items.length > maxVisible"
      class="self-end mt-3 text-sm font-semibold text-accent hover:opacity-80 transition-opacity cursor-pointer"
      @click="showAll = !showAll"
    >
      <template v-if="showAll">
        {{ $t('common.show_less') }}
      </template>
      <template v-else> +{{ items.length - maxVisible }} {{ $t('common.show_more') }}... </template>
    </button>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  items: { type: Array, required: true },
  maxVisible: { type: Number, default: 3 },
})

const showAll = ref(false)
const visibleItems = computed(() => {
  if (showAll.value) return props.items
  return props.items.slice(0, props.maxVisible)
})
</script>
