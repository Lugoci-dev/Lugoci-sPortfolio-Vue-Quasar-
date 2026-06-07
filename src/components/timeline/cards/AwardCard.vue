<template>
  <div class="award-card">
    <span
      class="inline-flex items-center gap-1 bg-yellow-500 text-white text-xs md:text-sm font-bold px-3 py-1 rounded-full mb-3"
    >
      <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clip-rule="evenodd"
        />
      </svg>
      {{ localized(entry.cycle.date.label) }} {{ entry.cycle.date.year }}
    </span>

    <h5 class="text-adaptive-dark text-base md:text-lg font-bold mb-1 leading-snug">
      {{ localized(entry.data.title) }}
    </h5>

    <p v-if="entry.data.organization" class="text-adaptive-mid text-xs font-semibold mb-2">
      {{ localized(entry.data.organization) }}
    </p>

    <p class="text-adaptive-mid text-xs md:text-sm leading-relaxed">
      {{ localized(entry.data.description) }}
    </p>
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
.award-card {
  width: 100%;
}
</style>
