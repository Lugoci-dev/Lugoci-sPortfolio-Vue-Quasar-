<template>
  <div class="certification-card">
    <span
      class="inline-flex items-center gap-1 bg-emerald-500 text-white text-xs md:text-sm font-bold px-3 py-1 rounded-full mb-3"
    >
      <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path
          fill-rule="evenodd"
          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clip-rule="evenodd"
        />
      </svg>
      {{ localized(entry.cycle.date.label) }} {{ entry.cycle.date.year }}
    </span>

    <h5 class="text-adaptive-dark text-base md:text-lg font-bold mb-1 leading-snug">
      {{ localized(entry.data.title) }}
    </h5>

    <p v-if="entry.data.issuer" class="text-adaptive-mid text-xs font-semibold mb-2">
      {{ localized(entry.data.issuer) }}
    </p>

    <div v-if="entry.data.credential_url" class="mt-2">
      <a
        :href="entry.data.credential_url"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs font-medium text-Red400 hover:text-Red300 underline underline-offset-2 transition-colors"
      >
        Ver credencial →
      </a>
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
.certification-card {
  width: 100%;
}
</style>
