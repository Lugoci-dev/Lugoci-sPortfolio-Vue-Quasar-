<template>
  <div class="award-card relative">
    <!-- Type icon badge — esquina superior-derecha -->
    <div
      class="type-icon-badge absolute z-20 flex items-center justify-center w-14 h-14 rounded-xl shadow-lg border-2 border-white/20"
    >
      <!-- Estrella — símbolo de reconocimiento -->
      <svg class="w-9 h-9 text-white" viewBox="0 0 32 32" fill="none">
        <path
          d="M16 2l4.5 9.5L31 13l-7.5 7.5L25 31l-9-5.5L7 31l1.5-10.5L1 13l10.5-1.5L16 2z"
          fill="currentColor"
          stroke="currentColor"
          stroke-width="0.5"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <!-- Fecha puntual -->
    <span
      class="inline-flex items-center gap-1.5 bg-yellow-500 text-white text-xs md:text-sm font-bold px-3 py-1 rounded-full mb-3"
    >
      <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clip-rule="evenodd"
        />
      </svg>
      <span>{{ localized(entry.cycle.date.label) }} {{ entry.cycle.date.year }}</span>
    </span>

    <!-- Título -->
    <h5 class="text-adaptive-dark text-base md:text-lg font-bold mb-1 leading-snug">
      {{ localized(entry.data.title) }}
    </h5>

    <!-- Organización -->
    <p v-if="entry.data.organization" class="text-adaptive-mid text-xs font-semibold mb-2">
      {{ localized(entry.data.organization) }}
    </p>

    <!-- Descripción -->
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

.type-icon-badge {
  top: -28px;
  right: -12px;
  background: #eab308;
  box-shadow: 0 4px 14px rgba(234, 179, 8, 0.4);
  transform: rotate(8deg);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.award-card:hover .type-icon-badge {
  transform: rotate(8deg) scale(1.06);
  box-shadow: 0 6px 18px rgba(234, 179, 8, 0.55);
}
</style>
