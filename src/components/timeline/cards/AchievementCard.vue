<template>
  <div class="achievement-card relative" @focusout="onFocusOut">
    <!-- Type icon badge — esquina superior-derecha, menos salido -->
    <div
      class="type-icon-badge absolute z-20 flex items-center justify-center w-14 h-14 rounded-xl shadow-lg border-2 border-white/20"
    >
      <!-- Columna clásica — símbolo de hito/fundación -->
      <svg class="w-8 h-11 text-white" viewBox="0 0 24 36" fill="none">
        <rect x="3" y="0" width="18" height="2.5" rx="0.5" fill="currentColor" opacity="0.9" />
        <rect x="2" y="2.5" width="20" height="3" rx="0.5" fill="currentColor" opacity="0.7" />
        <rect x="5" y="5.5" width="14" height="24" rx="0.5" fill="currentColor" opacity="0.5" />
        <line
          x1="8"
          y1="5.5"
          x2="8"
          y2="29.5"
          stroke="currentColor"
          stroke-width="0.8"
          opacity="0.7"
        />
        <line
          x1="12"
          y1="5.5"
          x2="12"
          y2="29.5"
          stroke="currentColor"
          stroke-width="0.8"
          opacity="0.7"
        />
        <line
          x1="16"
          y1="5.5"
          x2="16"
          y2="29.5"
          stroke="currentColor"
          stroke-width="0.8"
          opacity="0.7"
        />
        <rect x="2" y="29.5" width="20" height="3.5" rx="0.5" fill="currentColor" opacity="0.8" />
        <rect x="4" y="33" width="16" height="3" rx="0.5" fill="currentColor" opacity="0.9" />
      </svg>
    </div>

    <!-- Fecha puntual (desde entry.cycle.date) -->
    <span
      class="inline-flex items-center gap-1.5 bg-amber-500 text-white text-xs md:text-sm font-bold px-3 py-1 rounded-full mb-3"
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

    <!-- Título -->
    <h5 class="text-adaptive-dark text-base md:text-lg font-bold mb-2 leading-snug">
      {{ localized(entry.data.title) }}
    </h5>

    <!-- Descripción con expand/collapse -->
    <div>
      <p
        class="text-adaptive-mid text-xs md:text-sm leading-relaxed mb-0 transition-all duration-200"
        :class="{ 'line-clamp-2': !expanded }"
      >
        {{ localized(entry.data.description) }}
      </p>
    </div>

    <!-- Botón seguir leyendo (solo si el texto es largo) -->
    <button
      v-if="needsTruncation"
      @click.stop="toggleExpanded"
      class="mt-1 text-xs font-medium text-amber-500 hover:text-amber-400 transition-colors focus:outline-none focus:ring-1 focus:ring-amber-500/40 rounded"
      :aria-expanded="expanded"
    >
      <span v-if="!expanded" class="inline-flex items-center gap-1">
        <svg class="w-3 h-3" viewBox="0 0 12 12" fill="none">
          <path
            d="M5 2l4 4-4 4"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Seguir leyendo
      </span>
      <span v-else class="inline-flex items-center gap-1">
        <svg class="w-3 h-3" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 7l4-4 4 4"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Ver menos
      </span>
    </button>

    <!-- Tags -->
    <div v-if="entry.data.tags?.length" class="flex flex-wrap gap-1.5 mt-2">
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
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const props = defineProps({
  entry: { type: Object, required: true },
})

const expanded = ref(false)

const needsTruncation = computed(() => {
  const text = localized(props.entry.data?.description)
  return text.length > 120
})

function toggleExpanded() {
  expanded.value = !expanded.value
}

function onFocusOut(e) {
  // Si el foco se fue a algo fuera de la card → colapsar
  if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
    expanded.value = false
  }
}

function localized(obj) {
  if (!obj) return ''
  return obj[locale.value] || obj.en || ''
}
</script>

<style scoped>
.achievement-card {
  width: 100%;
}

.type-icon-badge {
  top: -28px;
  right: -12px;
  background: #f59e0b;
  box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4);
  transform: rotate(-7deg);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.achievement-card:hover .type-icon-badge {
  transform: rotate(-7deg) scale(1.06);
  box-shadow: 0 6px 18px rgba(245, 158, 11, 0.55);
}
</style>
