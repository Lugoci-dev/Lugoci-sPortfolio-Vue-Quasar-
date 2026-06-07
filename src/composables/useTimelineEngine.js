/**
 * useTimelineEngine — Motor de posicionamiento temporal agnóstico
 *
 * Recibe entries con cycle (range o date), calcula posiciones absolutas,
 * maneja colisiones con lanes, genera markers de años/meses.
 *
 * La timeline NO sabe qué tipos de items renderiza — solo sabe DÓNDE van.
 *
 * @param {import('vue').Ref<Array>} entriesRef — ref reactiva con TimelineEntry[]
 * @param {Object} [options]
 * @param {number} [options.monthHeight=60]  — px por cada mes de diferencia
 * @param {number} [options.laneHeight=150]  — px por cada lane de colisión
 * @param {number} [options.baseOffset=40]   — padding top
 */

import { computed } from 'vue'

/* ─══════════════════════════════════════════════
   Constantes compartidas
   ─══════════════════════════════════════════════ */

export const MONTH_ORDER = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
}

export const MONTH_LABELS = {
  es: {
    january: 'Ene',
    february: 'Feb',
    march: 'Mar',
    april: 'Abr',
    may: 'May',
    june: 'Jun',
    july: 'Jul',
    august: 'Ago',
    september: 'Sep',
    october: 'Oct',
    november: 'Nov',
    december: 'Dic',
  },
  en: {
    january: 'Jan',
    february: 'Feb',
    march: 'Mar',
    april: 'Apr',
    may: 'May',
    june: 'Jun',
    july: 'Jul',
    august: 'Aug',
    september: 'Sep',
    october: 'Oct',
    november: 'Nov',
    december: 'Dec',
  },
}

/* ─══════════════════════════════════════════════
   Helpers puros
   ─══════════════════════════════════════════════ */

/** Convierte { year, month_key } a índice absoluto de meses */
export function toMonthIndex(date) {
  return date.year * 12 + (MONTH_ORDER[date.month_key] - 1)
}

/** Convierte índice absoluto a año */
export function yearFromIndex(index) {
  return Math.floor(index / 12)
}

/** Normaliza un cycle (range con start/end o puntual con date) */
export function normalizeCycle(cycle) {
  if (!cycle) return { startIndex: 0, endIndex: 0 }
  if (cycle.date) {
    const m = toMonthIndex(cycle.date)
    return { startIndex: m, endIndex: m, ...cycle }
  }
  const startIndex = toMonthIndex(cycle.start)
  const endIndex = toMonthIndex(cycle.end)
  return { startIndex, endIndex, ...cycle }
}

/* ─══════════════════════════════════════════════
   Engine principal
   ─══════════════════════════════════════════════ */

export function useTimelineEngine(entriesRef, options = {}) {
  const { monthHeight = 60, baseOffset = 40 } = options

  /* ── 1. Normalizar entries ── */
  const normalized = computed(() =>
    (entriesRef.value || []).map((entry) => ({
      ...entry,
      ...normalizeCycle(entry.cycle),
    })),
  )

  /* ── 2. Rango dinámico (sin hardcode) ── */
  const range = computed(() => {
    const items = normalized.value
    if (!items.length) {
      return { first: 0, last: 0, firstYear: 2024, lastYear: 2024, span: 0 }
    }

    let first = Infinity
    let last = -Infinity

    for (const item of items) {
      if (item.startIndex < first) first = item.startIndex
      if (item.endIndex > last) last = item.endIndex
    }

    return {
      first,
      last,
      firstYear: Math.floor(first / 12),
      lastYear: Math.floor(last / 12),
      span: last - first,
    }
  })

  /* ── 3. Altura estimada por tipo de card ── */
  function estimateCardHeight(type) {
    switch (type) {
      case 'achievement':
        return 180
      case 'award':
        return 160
      case 'certification':
        return 170
      default:
        return 280 // experience — puede tener muchos items
    }
  }

  /* ── 4. Posicionar entries ──
       - ORDER: descendente (más reciente arriba, más antiguo abajo)
       - SIDES alternados para minimizar colisiones: ítem temporalmente
         adyacente va al lado opuesto
       - Anti-colisión INDEPENDIENTE por lado: items left solo compiten
         con otros left, right solo con right
       - DOT en temporalTop (alineado con markers), card en adjustedTop ── */
  const CARD_GAP = 32

  const positionedEntries = computed(() => {
    const items = normalized.value
    const { last, span } = range.value
    if (!items.length || span === 0) return []

    // 1. Posición temporal pura para todos
    const withTemporal = items.map((item) => {
      const position = (last - item.startIndex) / span
      const temporalTop = baseOffset + position * span * monthHeight
      return { ...item, position, temporalTop }
    })

    // 2. Ordenar por temporalTop (ascendente = más reciente primero)
    const sorted = [...withTemporal].sort((a, b) => a.temporalTop - b.temporalTop)

    // 3. Asignar sides alternados: items adyacentes en el tiempo
    //    van a lados opuestos → no necesitan anti-colisión entre sí
    const withSide = sorted.map((item, i) => ({
      ...item,
      side: i % 2 === 0 ? 'left' : 'right',
    }))

    // 4. Anti-colisión INDEPENDIENTE por lado
    const leftItems = withSide.filter((i) => i.side === 'left')
    const rightItems = withSide.filter((i) => i.side === 'right')

    let leftBottom = 0
    for (const item of leftItems) {
      const h = estimateCardHeight(item.type)
      const effectiveTop = Math.max(item.temporalTop, leftBottom)
      item.top = effectiveTop
      leftBottom = effectiveTop + h + CARD_GAP
    }

    let rightBottom = 0
    for (const item of rightItems) {
      const h = estimateCardHeight(item.type)
      const effectiveTop = Math.max(item.temporalTop, rightBottom)
      item.top = effectiveTop
      rightBottom = effectiveTop + h + CARD_GAP
    }

    // 5. Mapa id → { top, side } y devolver en orden ORIGINAL
    const resolved = new Map()
    for (const item of [...leftItems, ...rightItems]) {
      resolved.set(item.id, { top: item.top, side: item.side })
    }

    return withTemporal.map((item) => {
      const r = resolved.get(item.id)
      return {
        ...item,
        top: r?.top ?? item.temporalTop,
        side: r?.side ?? 'left',
      }
    })
  })

  /* ── 5. Segmentos de ciclo (barras en la línea que marcan duración) ── */
  const cycleSegments = computed(() => {
    const entries = positionedEntries.value
    const { last, span } = range.value
    if (!entries.length || span === 0) return []

    // Helper inline: posición en px para un monthIndex dado
    const pos = (monthIndex) => baseOffset + ((last - monthIndex) / span) * span * monthHeight

    return entries
      .filter((e) => e.startIndex !== e.endIndex) // solo rangos
      .map((entry) => {
        const top = pos(entry.endIndex) // end está más arriba (invertido)
        const height = pos(entry.startIndex) - top
        return {
          id: entry.id,
          side: entry.side,
          top,
          height,
        }
      })
  })

  /* ── 6. Altura dinámica del wrapper ── */
  const wrapperHeight = computed(() => {
    if (!positionedEntries.value.length) return 400
    const maxTop = Math.max(...positionedEntries.value.map((e) => e.top))
    return maxTop + 280
  })

  /* ── 5. Marcadores de años (siempre visibles) y meses (ocultos por defecto) ── */
  const timelineMarkers = computed(() => {
    const { firstYear, lastYear, first, last, span } = range.value
    const result = []

    if (span === 0) return result

    for (let y = firstYear; y <= lastYear; y++) {
      for (let m = 1; m <= 12; m++) {
        const monthKey = Object.keys(MONTH_ORDER).find((k) => MONTH_ORDER[k] === m)
        const monthIndex = y * 12 + (m - 1)

        // Saltar meses fuera del rango del timeline
        if (monthIndex < first || monthIndex > last) continue

        // Fórmula INVERTIDA: igual que positionedEntries
        const position = (last - monthIndex) / span
        const top = baseOffset + position * span * monthHeight
        const isYearStart = m === 1

        result.push({
          year: y,
          month: m,
          monthKey,
          label: isYearStart ? String(y) : '',
          monthLabelEs: MONTH_LABELS.es[monthKey],
          monthLabelEn: MONTH_LABELS.en[monthKey],
          top,
          type: isYearStart ? 'year' : 'month',
          hasItem: positionedEntries.value.some((e) => e.startIndex === monthIndex),
        })
      }
    }

    return result
  })

  /* ── 6. Estilo de la línea vertical ── */
  const lineStyle = computed(() => {
    const yrs = timelineMarkers.value.filter((m) => m.type === 'year')
    if (yrs.length < 2) return {}

    const tops = yrs.map((y) => y.top)
    const minTop = Math.min(...tops)
    const maxTop = Math.max(...tops)

    return {
      '--line-top': minTop + 'px',
      '--line-height': maxTop - minTop + 'px',
    }
  })

  return {
    positionedEntries,
    cycleSegments,
    timelineMarkers,
    lineStyle,
    wrapperHeight,
    range,
  }
}
