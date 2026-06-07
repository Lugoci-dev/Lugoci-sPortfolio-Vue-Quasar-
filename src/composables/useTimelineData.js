/**
 * useTimelineData — Fetch y estado de data.json
 *
 * Maneja loading, error, y expone la colección timeline[]
 * en el formato que espera useTimelineEngine.
 */

import { ref, onMounted } from 'vue'

/**
 * @typedef {Object} TimelineEntry
 * @property {string} id
 * @property {'experience'|'achievement'|'award'|'certification'|string} type
 * @property {Object} cycle
 * @property {Object} data
 */

export function useTimelineData() {
  /** @type {import('vue').Ref<TimelineEntry[]>} */
  const timeline = ref([])
  const loading = ref(true)
  const error = ref(null)

  onMounted(async () => {
    try {
      const base = import.meta.env.BASE_URL ?? '/'
      const res = await fetch(`${base}data.json`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()

      // Soporta tanto el nuevo formato { timeline: [] } como arrays planos
      if (json.timeline) {
        timeline.value = json.timeline
      } else if (Array.isArray(json)) {
        timeline.value = json
      } else {
        throw new Error('Formato de data.json no reconocido')
      }
    } catch (e) {
      console.error('[useTimelineData] Error:', e)
      error.value = e.message
    } finally {
      loading.value = false
    }
  })

  return {
    timeline,
    loading,
    error,
  }
}
