<template>
  <div
    class="collage-card cursor-pointer group"
    @click="$router.push(`/project/${entry.id}`)"
    role="button"
    tabindex="0"
    @keydown.enter="$router.push(`/project/${entry.id}`)"
  >
    <!-- Periodo + Type badge + count -->
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

      <!-- Type badge with count -->
      <span
        class="inline-flex items-center gap-1 text-[10px] md:text-xs font-semibold px-2.5 py-0.5 rounded-full border text-adaptive-mid"
        style="border-color: var(--n600)"
      >
        {{ $t('type.collage') }}
        <span
          class="bg-accent text-white text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none"
        >
          {{ projectCount }}
        </span>
      </span>
    </div>

    <!-- Nombre -->
    <h5 class="text-adaptive-dark text-base md:text-lg font-bold mb-2 leading-snug">
      {{ localized(entry.data.name) }}
    </h5>

    <!-- Items (no summary for collage) -->
    <ul v-if="entry.data.items?.length" class="space-y-1.5 mb-3">
      <li
        v-for="(item, i) in entry.data.items"
        :key="i"
        class="flex flex-row items-start gap-2 text-xs md:text-sm text-adaptive-mid"
      >
        <svg class="w-4 h-4 mt-0.5 shrink-0 text-accent" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="flex-1">{{ localized(item) }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { locale } = useI18n()
const $router = useRouter()

const props = defineProps({
  entry: { type: Object, required: true },
})

const projectCount = computed(() => props.entry.data?.projects?.length ?? 0)

function localized(obj) {
  if (!obj) return ''
  return obj[locale.value] || obj.en || ''
}
</script>

<style scoped>
.collage-card {
  width: 100%;
}
</style>
