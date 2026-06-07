<template>
  <div class="achievement-card">
    <!-- Fecha puntual (desde entry.cycle.date) -->
    <span
      class="inline-flex items-center gap-1 bg-amber-500 text-white text-xs md:text-sm font-bold px-3 py-1 rounded-full mb-3"
    >
      <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
        <path
          fill-rule="evenodd"
          d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
          clip-rule="evenodd"
        />
      </svg>
      <span>{{ localized(entry.cycle.date.label) }} {{ entry.cycle.date.year }}</span>
    </span>

    <!-- Título (desde entry.data) -->
    <h5 class="text-adaptive-dark text-base md:text-lg font-bold mb-2 leading-snug">
      {{ localized(entry.data.title) }}
    </h5>

    <!-- Descripción -->
    <p class="text-adaptive-mid text-xs md:text-sm leading-relaxed mb-3">
      {{ localized(entry.data.description) }}
    </p>

    <!-- Tags -->
    <div v-if="entry.data.tags?.length" class="flex flex-wrap gap-1.5">
      <span
        v-for="tag in entry.data.tags"
        :key="tag"
        class="text-xs font-medium px-2 py-0.5 rounded-full border text-adaptive-mid"
        style="border-color: var(--n600)"
      >
        {{ tag }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

defineProps({
  entry: { type: Object, required: true },
})

function localized(obj) {
  if (!obj) return ''
  return obj[locale.value] || obj.en || ''
}
</script>

<style scoped>
.achievement-card {
  width: 100%;
}
</style>
