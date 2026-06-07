<template>
  <div ref="containerRef" class="timeline-root relative max-w-5xl mx-auto">
    <!-- ═══════════════════════════════════════════
         DESKTOP — Layout actual con engine de posicionamiento
         ═══════════════════════════════════════════ -->
    <template v-if="!isMobile">
      <!-- Wrapper con altura dinámica -->
      <div class="timeline-wrapper relative z-10" :style="{ minHeight: wrapperHeight + 'px' }">
        <!-- Entries posicionadas -->
        <div
          v-for="entry in positionedEntries"
          :key="entry.id"
          class="timeline-node"
          :class="{
            'is-dimmed': hoveredId && hoveredId !== entry.id,
            'is-hovered': hoveredId === entry.id,
          }"
          :style="{
            position: 'absolute',
            top: entry.top + 'px',
            left: entry.side === 'left' ? '0' : 'auto',
            right: entry.side === 'left' ? 'auto' : '0',
            width: 'calc(50% - 28px)',
          }"
          @mouseenter="hoveredId = entry.id"
          @mouseleave="hoveredId = null"
        >
          <!-- Punto: SIEMPRE en temporalTop (alineado con markers) -->
          <span
            class="node-dot"
            :class="entry.side === 'left' ? 'dot-left' : 'dot-right'"
            :style="dotShift(entry)"
          />

          <!-- Conector vertical (solo si hay offset por anti-colisión) -->
          <div
            v-if="entry.top > entry.temporalTop"
            class="node-connector-v"
            :class="entry.side === 'left' ? 'conn-v-left' : 'conn-v-right'"
            :style="{
              top: dotShiftPx(entry),
              height: entry.top - entry.temporalTop + 'px',
            }"
          />

          <!-- Conector horizontal -->
          <div
            class="node-connector-h"
            :class="entry.side === 'left' ? 'conn-h-left' : 'conn-h-right'"
            :style="dotShift(entry)"
          />

          <!-- Card contenedora (en adjustedTop = dentro del nodo) -->
          <div
            class="node-card card-bg card-border border rounded-xl p-5 md:p-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02]"
            :class="entry.side === 'left' ? 'card-left' : 'card-right'"
          >
            <component :is="resolveComponent(entry.type)" :entry="entry" />
          </div>
        </div>

        <!-- Línea central vertical -->
        <div
          v-if="lineStyle['--line-top']"
          class="timeline-line absolute left-1/2 -translate-x-1/2 w-[2px] pointer-events-none z-5"
          :style="lineStyle"
        >
          <div class="w-full h-full bg-gradient-to-b from-Red400/10 via-Red400/45 to-Red400/15" />
        </div>

        <!-- Segmentos de ciclo (barra de duración en la línea) -->
        <div
          v-for="seg in cycleSegments"
          :key="'cycle-' + seg.id"
          class="cycle-segment absolute left-1/2 -translate-x-1/2 pointer-events-none z-6 transition-all duration-300 ease-in-out"
          :class="{ 'is-active': hoveredId === seg.id }"
          :style="{ top: seg.top + 'px', height: seg.height + 'px' }"
        />

        <!-- Marcadores de años + meses -->
        <div
          v-for="mark in timelineMarkers"
          :key="mark.year + '-' + mark.month"
          class="timeline-marker absolute left-1/2 -translate-x-1/2 z-10"
          :style="{ top: mark.top + 'px' }"
          :class="[
            mark.type,
            mark.hasItem && 'has-item',
            isMarkerActive(mark) && 'tooltip-active',
            markerTooltipSide(mark),
          ]"
        >
          <!-- Tick visual -->
          <span class="tick-line" :class="mark.type" />

          <!-- Label de año sobre la línea (badge centrado con contraste) -->
          <span v-if="mark.type === 'year'" class="year-badge">{{ mark.label }}</span>

          <!-- Tooltip de mes al hacer hover -->
          <div class="month-tooltip">
            <span>{{ locale === 'es' ? mark.monthLabelEs : mark.monthLabelEn }}</span>
            <span class="year-in-tooltip">{{ mark.year }}</span>
          </div>
        </div>
      </div>
    </template>

    <!-- ═══════════════════════════════════════════
         MOBILE — Stacked list simplificado sin engine
         ═══════════════════════════════════════════ -->
    <template v-else>
      <div class="mobile-timeline relative pl-[36px]">
        <!-- Línea decorativa izquierda -->
        <div
          class="absolute left-[15px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-Red400/40 to-transparent pointer-events-none"
        ></div>

        <!-- Grupos por año -->
        <div v-for="group in mobileYearGroups" :key="group.year">
          <!-- Separador de año -->
          <div class="year-section relative z-10 pt-6 pb-2 -ml-[36px] pl-[15px]">
            <span class="font-extrabold text-lg text-Red400 tracking-wide">{{ group.year }}</span>
          </div>

          <!-- Entries del año -->
          <div v-for="entry in group.entries" :key="entry.id" class="relative pb-5">
            <!-- Dot sobre la línea -->
            <span
              class="mobile-dot absolute w-3.5 h-3.5 rounded-full border-[3px] border-Red400 z-10 shadow-md"
              style="left: -20px; top: 20px; transform: translateX(-50%)"
            ></span>

            <!-- Card -->
            <div class="mobile-card card-bg card-border border rounded-xl p-5 relative">
              <component :is="resolveComponent(entry.type)" :entry="entry" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { useTimelineEngine, normalizeCycle, yearFromIndex } from 'src/composables/useTimelineEngine'
import ExperienceCard from './cards/ExperienceCard.vue'
import AchievementCard from './cards/AchievementCard.vue'
import AwardCard from './cards/AwardCard.vue'
import CertificationCard from './cards/CertificationCard.vue'
import CollageCard from './cards/CollageCard.vue'

const { locale } = useI18n()
const $q = useQuasar()
const hoveredId = ref(null)
const isMobile = computed(() => $q.screen.lt.md)

const props = defineProps({
  entries: { type: Array, required: true },
  monthHeight: { type: Number, default: 60 },
  baseOffset: { type: Number, default: 40 },
})

/* ── Engine ── */
const entriesRef = computed(() => props.entries)

const { positionedEntries, cycleSegments, timelineMarkers, lineStyle, wrapperHeight } =
  useTimelineEngine(entriesRef, {
    monthHeight: props.monthHeight,
    baseOffset: props.baseOffset,
  })

/* ── Resolución dinámica de componentes por tipo ── */
const componentMap = {
  experience: ExperienceCard,
  achievement: AchievementCard,
  award: AwardCard,
  certification: CertificationCard,
  collage: CollageCard,
}

function resolveComponent(type) {
  return componentMap[type] || ExperienceCard
}

/* ── Helpers de posicionamiento del dot ── */
function dotShiftPx(entry) {
  return entry.temporalTop - entry.top + 'px'
}

function dotShift(entry) {
  const offset = entry.top - entry.temporalTop
  if (offset <= 0) return {}
  return { top: dotShiftPx(entry) }
}

/* ── Helper: el marker se activa si el item hovered está en este mes ── */
function isMarkerActive(mark) {
  if (!hoveredId.value) return false
  const entry = positionedEntries.value.find((e) => e.id === hoveredId.value)
  if (!entry) return false
  const markerMonthIndex = mark.year * 12 + (mark.month - 1)
  return markerMonthIndex === entry.startIndex
}

/* ── Helper: el tooltip del marker va al lado opuesto de la card ── */
function markerTooltipSide() {
  if (!hoveredId.value) return 'tooltip-on-right'
  const entry = positionedEntries.value.find((e) => e.id === hoveredId.value)
  if (!entry) return 'tooltip-on-right'
  return entry.side === 'left' ? 'tooltip-on-right' : 'tooltip-on-left'
}

/* ── Mobile: agrupar entries por año ── */
const mobileYearGroups = computed(() => {
  const items = (props.entries || []).map((entry) => ({
    ...entry,
    ...normalizeCycle(entry.cycle),
  }))

  // Sort descendente por startIndex (más reciente primero)
  const sorted = [...items].sort((a, b) => b.startIndex - a.startIndex)

  // Agrupar por año
  const groups = {}
  for (const item of sorted) {
    const y = yearFromIndex(item.startIndex)
    if (!groups[y]) groups[y] = []
    groups[y].push(item)
  }

  // Retornar como array ordenado (años descendentes)
  return Object.entries(groups)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, entries]) => ({ year: Number(year), entries }))
})
</script>

<style scoped>
/* ═══════════════════════════════════════════════
   TimelineRoot — Timeline vertical dinámico
   ═══════════════════════════════════════════════ */

/* ── Wrapper ── */
.timeline-wrapper {
  position: relative;
}

/* ── Línea central ── */
.timeline-line {
  position: absolute;
  top: var(--line-top);
  height: var(--line-height);
  z-index: 5;
}

/* ── Segmento de ciclo (barra de duración sobre la línea) ── */
.cycle-segment {
  width: 4px;
  border-radius: 2px;
  background: hsl(3, 86%, 64%, 0.2);
  box-shadow: 0 0 6px hsla(3, 86%, 64%, 0.1);
  transition:
    width 0.3s ease,
    background 0.3s ease,
    box-shadow 0.3s ease;
}

.cycle-segment.is-active {
  width: 7px;
  background: hsl(3, 86%, 64%, 0.55);
  box-shadow: 0 0 14px hsla(3, 86%, 64%, 0.35);
}

/* ── Nodo individual ── */
.timeline-node {
  z-index: 10;
  transition:
    opacity 0.35s ease,
    filter 0.35s ease;
}

/* ── Hover: opacar todos menos el hovered ── */
.timeline-node.is-dimmed {
  opacity: 0.2;
  filter: blur(1px);
  pointer-events: none;
}

.timeline-node.is-hovered {
  z-index: 50 !important;
  opacity: 1;
  filter: none;
}

.timeline-node.is-hovered .node-card {
  transform: scale(1.03);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* ═══ Punto sobre la línea ═══ */
.node-dot {
  position: absolute;
  top: 0;
  transform: translate(-50%, -50%);
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: var(--n900);
  border: 3px solid hsl(3, 86%, 64%);
  z-index: 15;
  box-shadow: 0 0 6px hsla(3, 86%, 64%, 0.4);
  flex-shrink: 0;
}

.dot-left {
  left: 100%;
}
.dot-right {
  left: 0;
}

/* ═══ Conector vertical (anti-colisión) ═══ */
.node-connector-v {
  position: absolute;
  width: 2px;
  background: hsl(3, 86%, 64%, 0.15);
  z-index: 4;
  pointer-events: none;
}

.conn-v-left {
  left: calc(100% + 9px);
}
.conn-v-right {
  left: 0;
}

/* ═══ Conector horizontal ═══ */
.node-connector-h {
  position: absolute;
  top: 0;
  width: 14px;
  height: 2px;
  background: hsl(3, 86%, 64%, 0.25);
  z-index: 5;
  transform: translateY(-1px);
}

.conn-h-left {
  left: calc(100% + 9px);
}
.conn-h-right {
  right: calc(100% + 9px);
}

/* ═══ Card ═══ */
.node-card {
  position: relative;
  z-index: 10;
}

/* Flecha decorativa apuntando al punto */
.node-card::before {
  content: '';
  position: absolute;
  top: 10px;
  width: 10px;
  height: 10px;
  background: inherit;
  border: inherit;
  z-index: -1;
}

.card-left::before {
  right: -5px;
  border-width: 0 0 1px 1px;
  transform: rotate(45deg);
  box-shadow: -2px 2px 3px rgba(0, 0, 0, 0.08);
}

.card-right::before {
  left: -5px;
  border-width: 1px 1px 0 0;
  transform: rotate(45deg);
  box-shadow: 2px -2px 3px rgba(0, 0, 0, 0.08);
}

/* ═══ Marcadores (años + meses) ═══ */
.timeline-marker {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

/* Ticks */
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

/* Label de año — badge centrado SOBRE la línea */
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

/* Tooltip de mes */
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

/* Tooltip a la izquierda (cuando la card está en RIGHT) */
.tooltip-on-left .month-tooltip {
  left: auto;
  right: 38px;
}

.tooltip-on-left .month-tooltip::before {
  right: auto;
  left: 100%;
  border-color: transparent transparent transparent var(--n950);
}

/* ═══ MOBILE — Stacked list simplificado ═══ */

/* Dot sobre la línea */
.mobile-dot {
  background-color: var(--n900);
  box-shadow: 0 0 6px hsla(3, 86%, 64%, 0.4);
}

.body--light .mobile-dot {
  background-color: #ffffff;
}

/* Separador de año con línea sutil */
.year-section {
  border-bottom: 1px solid hsl(3, 86%, 64%, 0.12);
  margin-bottom: 8px;
}

/* Card mobile: flecha decorativa apuntando a la línea izquierda */
.mobile-card {
  position: relative;
  z-index: 10;
}

.mobile-card::before {
  content: '';
  position: absolute;
  left: -6px;
  top: 20px;
  width: 10px;
  height: 10px;
  background: inherit;
  border-left: 1px solid var(--n700);
  border-bottom: 1px solid var(--n700);
  transform: rotate(45deg);
  z-index: -1;
  border-radius: 0 0 0 2px;
}
</style>
