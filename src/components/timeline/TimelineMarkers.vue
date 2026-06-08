<template>
  <div
    v-for="mark in markers"
    :key="mark.year + '-' + mark.month"
    class="timeline-marker absolute left-1/2 -translate-x-1/2 z-10"
    :style="{ top: mark.top + 'px' }"
    :class="[
      mark.type,
      mark.hasItem && 'has-item',
      isMarkerActive(mark) && 'tooltip-active',
      markerTooltipSide(),
    ]"
  >
    <span class="tick-line" :class="mark.type" />

    <span v-if="mark.type === 'year'" class="year-badge">{{ mark.label }}</span>

    <div class="month-tooltip">
      <span>{{ locale === 'es' ? mark.monthLabelEs : mark.monthLabelEn }}</span>
      <span class="year-in-tooltip">{{ mark.year }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  markers: { type: Array, required: true },
  hoveredId: { type: [String, Number], default: null },
  positionedEntries: { type: Array, default: () => [] },
  locale: { type: String, default: 'en' },
})

function isMarkerActive(mark) {
  if (!props.hoveredId) return false
  const entry = props.positionedEntries.find((e) => e.id === props.hoveredId)
  if (!entry) return false
  const markerMonthIndex = mark.year * 12 + (mark.month - 1)
  return markerMonthIndex === entry.startIndex
}

function markerTooltipSide() {
  if (!props.hoveredId) return 'tooltip-on-right'
  const entry = props.positionedEntries.find((e) => e.id === props.hoveredId)
  if (!entry) return 'tooltip-on-right'
  return entry.side === 'left' ? 'tooltip-on-right' : 'tooltip-on-left'
}
</script>

<style scoped>
.timeline-marker {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

.tick-line {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 1px;
  transition: all 0.2s ease;
}

.tick-line.year {
  width: 3px;
  height: 20px;
  background: hsl(3, 86%, 64%, 0.6);
  box-shadow: 0 0 6px hsl(3, 86%, 64%, 0.4);
}

.tick-line.month {
  width: 1.5px;
  height: 8px;
  background: hsl(3, 86%, 64%, 0.25);
}

.timeline-marker.has-item .tick-line.month {
  width: 2px;
  height: 12px;
  background: hsl(3, 86%, 64%, 0.5);
  box-shadow: 0 0 4px hsl(3, 86%, 64%, 0.3);
}

.year-badge {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 11px;
  font-weight: 800;
  color: hsl(3, 86%, 64%);
  white-space: nowrap;
  letter-spacing: 0.5px;
  pointer-events: none;
  z-index: 12;
  padding: 3px 10px;
  border-radius: 999px;
  border: 1.5px solid hsl(3, 86%, 64%, 0.35);
  line-height: 1.3;
  box-shadow: 0 0 8px hsla(3, 86%, 64%, 0.15);
}

.body--dark .year-badge {
  background: #0d0d0d;
}

.body--light .year-badge {
  background: #ffffff;
  border-color: hsl(3, 86%, 64%, 0.5);
}

.timeline-marker.has-item .year-badge {
  color: hsl(3, 86%, 64%, 1);
  border-color: hsl(3, 86%, 64%, 0.7);
  box-shadow: 0 0 12px hsla(3, 86%, 64%, 0.25);
}

.month-tooltip {
  position: absolute;
  left: 38px;
  top: 50%;
  transform: translateY(-50%) translateX(-8px);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1px;
  padding: 4px 8px;
  background: var(--n950);
  border: 1px solid var(--n700);
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  color: var(--n100);
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 20;
}

.year-in-tooltip {
  font-size: 9px;
  font-weight: 400;
  color: var(--n400);
}

.timeline-marker:hover .month-tooltip,
.timeline-marker.tooltip-active .month-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateY(-50%) translateX(0);
}

.month-tooltip::before {
  content: '';
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: transparent var(--n950) transparent transparent;
}

.tooltip-on-left .month-tooltip {
  left: auto;
  right: 38px;
}

.tooltip-on-left .month-tooltip::before {
  right: auto;
  left: 100%;
  border-color: transparent transparent transparent var(--n950);
}
</style>
