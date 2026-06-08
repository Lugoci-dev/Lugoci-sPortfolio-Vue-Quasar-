<template>
  <div
    class="experience-card cursor-pointer group"
    @click="$router.push(`/project/${entry.id}`)"
    role="button"
    tabindex="0"
    @keydown.enter="$router.push(`/project/${entry.id}`)"
  >
    <!-- Periodo + Type badge -->
    <div class="flex flex-wrap items-center gap-2 mb-3">
      <span
        class="period-badge inline-flex items-center gap-1 bg-Red400 text-white text-xs md:text-sm font-bold px-3 py-1 rounded-full"
      >
        <span>{{ localized(entry.cycle.start.label) }} {{ entry.cycle.start.year }}</span>
        <svg class="w-3 h-3" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 6h8M6 2l4 4-4 4"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span v-if="entry.cycle.end"
          >{{ localized(entry.cycle.end.label) }} {{ entry.cycle.end.year }}</span
        >
        <span v-else>{{ $t('common.present') }}</span>
      </span>

      <!-- Type badge -->
      <span
        class="inline-flex items-center text-[10px] md:text-xs font-semibold px-2.5 py-0.5 rounded-full border text-adaptive-mid"
        style="border-color: var(--n600)"
      >
        {{ $t('type.' + entry.type) }}
      </span>
    </div>

    <!-- Nombre del rol / proyecto (desde entry.data) -->
    <h5 class="text-adaptive-dark text-base md:text-lg font-bold mb-2 leading-snug">
      {{ localized(entry.data.name) }}
    </h5>

    <!-- Summary -->
    <p class="text-adaptive-mid text-xs md:text-sm leading-relaxed mb-3">
      {{ localized(entry.data.summary) }}
    </p>

    <!-- Tecnologías -->
    <div v-if="entry.data.technologies?.length" class="flex flex-wrap gap-1.5 mb-1.5">
      <span
        v-for="tech in entry.data.technologies"
        :key="tech"
        class="text-xs font-semibold px-2.5 py-1 rounded-full border border-Red400 text-accent transition-colors duration-200 hover:bg-Red400 hover:text-white"
      >
        {{ tech }}
      </span>
    </div>

    <!-- Tools -->
    <div v-if="entry.data.tools?.length" class="flex flex-wrap gap-1.5">
      <span
        v-for="tool in entry.data.tools"
        :key="tool"
        class="text-xs font-medium px-2 py-0.5 rounded-full border text-adaptive-mid transition-colors duration-200"
        style="border-color: var(--n600)"
      >
        {{ tool }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { locale } = useI18n()
const $router = useRouter()

defineProps({
  entry: { type: Object, required: true },
})

function localized(obj) {
  if (!obj) return ''
  return obj[locale.value] || obj.en || ''
}
</script>

<style scoped>
.experience-card {
  width: 100%;
}
</style>
