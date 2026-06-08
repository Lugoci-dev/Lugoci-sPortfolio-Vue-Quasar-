<template>
  <div>
    <p class="text-2xl md:text-3xl font-extrabold text-adaptive-dark mb-4">
      {{ $t('about.education') }}
    </p>
    <div
      class="card-bg card-border border rounded-xl p-5 hover:border-accent/30 transition-colors duration-300"
    >
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
          <q-icon name="school" size="1.25rem" color="accent" />
        </div>
        <div class="min-w-0">
          <p class="text-base font-bold text-adaptive-dark">
            {{ localized(education.degree) }}
          </p>
          <p class="text-accent font-semibold text-xs mt-0.5">
            {{ localized(education.institution) }}
          </p>
          <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-adaptive-mid">
            <span class="inline-flex items-center gap-1">
              <q-icon name="location_on" size="12px" />
              {{ localized(education.location) }}
            </span>
            <span class="inline-flex items-center gap-1">
              <q-icon name="calendar_today" size="12px" />
              {{ localized(education.period) }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="languages?.length" class="mt-4 pt-4 border-t border-adaptive/10">
        <p class="text-xs font-bold text-adaptive-dark uppercase tracking-wider mb-3">
          {{ $t('about.languages') }}
        </p>
        <div class="flex flex-col gap-1.5">
          <div
            v-for="(lang, i) in languages"
            :key="i"
            class="lang-row flex items-center justify-between py-1.5 px-3 rounded-lg bg-accent/5"
          >
            <span class="flex items-center gap-2">
              <q-icon name="translate" size="14px" color="accent" />
              <span class="text-sm text-adaptive-dark">{{ localized(lang.name) }}</span>
            </span>
            <span class="text-xs font-semibold" :class="lang.level === 'B1+' ? '' : 'text-accent'">
              {{ localized(lang.level) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

defineProps({
  education: { type: Object, required: true },
  languages: { type: Array, default: () => [] },
})

function localized(obj) {
  if (!obj) return ''
  if (typeof obj === 'string') return obj
  return obj[locale.value] || obj.en || ''
}
</script>

<style scoped>
.lang-row {
  opacity: 0;
  transform: translateX(-8px);
}
.lang-row:nth-child(1) {
  animation: slideIn 0.4s ease 100ms forwards;
}
.lang-row:nth-child(2) {
  animation: slideIn 0.4s ease 200ms forwards;
}

@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
