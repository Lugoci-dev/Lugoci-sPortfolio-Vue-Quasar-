<template>
  <div class="certification-card relative">
    <!-- Type icon badge — esquina superior-derecha -->
    <div
      class="type-icon-badge absolute z-20 flex items-center justify-center w-14 h-14 rounded-xl shadow-lg border-2 border-white/20"
    >
      <!-- Escudo con check — símbolo de credencial oficial -->
      <svg class="w-8 h-10 text-white" viewBox="0 0 28 34" fill="none">
        <path
          d="M2 3L14 0l12 3v12c0 8.5-5.5 15-12 18C7 30 2 23.5 2 15V3z"
          fill="currentColor"
          opacity="0.9"
        />
        <path
          d="M9 16l4 5 7-9"
          stroke="white"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <!-- Fecha puntual -->
    <span
      class="inline-flex items-center gap-1.5 bg-emerald-500 text-white text-xs md:text-sm font-bold px-3 py-1 rounded-full mb-3"
    >
      <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path
          fill-rule="evenodd"
          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clip-rule="evenodd"
        />
      </svg>
      <span>{{ localized(entry.cycle.date.label) }} {{ entry.cycle.date.year }}</span>
    </span>

    <!-- Título -->
    <h5 class="text-adaptive-dark text-base md:text-lg font-bold mb-1 leading-snug">
      {{ localized(entry.data.title) }}
    </h5>

    <!-- Issuer -->
    <p v-if="entry.data.issuer" class="text-adaptive-mid text-xs font-semibold mb-2">
      {{ localized(entry.data.issuer) }}
    </p>

    <!-- Credencial -->
    <div v-if="entry.data.credential_url" class="mt-2">
      <a
        :href="entry.data.credential_url"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1 text-xs font-medium text-emerald-500 hover:text-emerald-400 underline underline-offset-2 transition-colors"
      >
        <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
            clip-rule="evenodd"
          />
          <path
            fill-rule="evenodd"
            d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
            clip-rule="evenodd"
          />
        </svg>
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

.type-icon-badge {
  top: -28px;
  right: -12px;
  background: #10b981;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
  transform: rotate(-4deg);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.certification-card:hover .type-icon-badge {
  transform: rotate(-4deg) scale(1.06);
  box-shadow: 0 6px 18px rgba(16, 185, 129, 0.55);
}
</style>
