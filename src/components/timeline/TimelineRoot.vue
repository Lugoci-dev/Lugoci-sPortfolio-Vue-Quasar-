<template>
  <div ref="containerRef" class="timeline-root relative max-w-5xl mx-auto">
    <template v-if="!isMobile">
      <div class="timeline-wrapper relative z-10" :style="{ minHeight: wrapperHeight + 'px' }">
        <TimelineNode
          v-for="entry in positionedEntries"
          :key="entry.id"
          :entry="entry"
          :is-dimmed="hoveredId && hoveredId !== entry.id"
          :is-hovered="hoveredId === entry.id"
          @mouseenter="hoveredId = entry.id"
          @mouseleave="hoveredId = null"
        >
          <component :is="resolveComponent(entry.type)" :entry="entry" />
        </TimelineNode>

        <div
          v-if="lineStyle['--line-top']"
          class="timeline-line absolute left-1/2 -translate-x-1/2 w-[2px] pointer-events-none z-5"
          :style="lineStyle"
        >
          <div class="relative w-full h-full">
            <!-- Core gradient line -->
            <div
              class="absolute inset-0 bg-gradient-to-b from-Red400/10 via-Red400/45 to-Red400/15 rounded-full"
            />

            <!-- Inertia glow — destello que sigue el scroll con inercia -->
            <div
              class="timeline-glow absolute left-1/2 -translate-x-1/2 pointer-events-none"
              :style="{ top: `${glowProgress * 100}%` }"
            />
          </div>
        </div>

        <div
          v-for="seg in cycleSegments"
          :key="'cycle-' + seg.id"
          class="cycle-segment absolute left-1/2 -translate-x-1/2 pointer-events-none z-6 transition-all duration-300 ease-in-out"
          :class="{ 'is-active': hoveredId === seg.id }"
          :style="{ top: seg.top + 'px', height: seg.height + 'px' }"
        />

        <TimelineMarkers
          :markers="timelineMarkers"
          :hovered-id="hoveredId"
          :positioned-entries="positionedEntries"
          :locale="locale"
        />
      </div>
    </template>

    <MobileTimeline v-else :entries="entries">
      <template #card="{ entry }">
        <component :is="resolveComponent(entry.type)" :entry="entry" />
      </template>
    </MobileTimeline>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { useTimelineEngine } from 'src/composables/useTimelineEngine'
import ExperienceCard from './cards/ExperienceCard.vue'
import AchievementCard from './cards/AchievementCard.vue'
import AwardCard from './cards/AwardCard.vue'
import CertificationCard from './cards/CertificationCard.vue'
import CollageCard from './cards/CollageCard.vue'
import TimelineNode from './TimelineNode.vue'
import MobileTimeline from './MobileTimeline.vue'
import TimelineMarkers from './TimelineMarkers.vue'

const { locale } = useI18n()
const $q = useQuasar()
const hoveredId = ref(null)
const isMobile = computed(() => $q.screen.lt.md)

const props = defineProps({
  entries: { type: Array, required: true },
  monthHeight: { type: Number, default: 60 },
  baseOffset: { type: Number, default: 40 },
})

const entriesRef = computed(() => props.entries)

const { positionedEntries, cycleSegments, timelineMarkers, lineStyle, wrapperHeight } =
  useTimelineEngine(entriesRef, {
    monthHeight: props.monthHeight,
    baseOffset: props.baseOffset,
  })

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

/* ─══════════════════════════════════════════════════
   Inertia Glow — la línea de tiempo "respira"
   y sigue el scroll con inercia orgánica
   ─══════════════════════════════════════════════════ */

const containerRef = ref(null)
const glowProgress = ref(0.5)
let targetProgress = 0.5
let glowAnimId = null
const GLOW_LERP = 0.045 // lower = más inercia (arrastra más)

function updateGlowTarget() {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const windowH = window.innerHeight

  // Progreso 0 → el timeline está entrando (top en viewport)
  // Progreso 1 → el timeline está saliendo (bottom sale)
  const totalScroll = rect.height + windowH
  const scrolled = windowH - rect.top
  targetProgress = Math.max(0, Math.min(1, scrolled / totalScroll))

  // Iniciar el loop de inercia si no está corriendo
  if (!glowAnimId) {
    glowAnimId = requestAnimationFrame(tickGlow)
  }
}

function tickGlow() {
  const diff = targetProgress - glowProgress.value
  glowProgress.value += diff * GLOW_LERP

  // Cuando está suficientemente cerca, para el RAF
  if (Math.abs(diff) > 0.002) {
    glowAnimId = requestAnimationFrame(tickGlow)
  } else {
    glowProgress.value = targetProgress
    glowAnimId = null
  }
}

onMounted(() => {
  window.addEventListener('scroll', updateGlowTarget, { passive: true })
  updateGlowTarget()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateGlowTarget)
  if (glowAnimId) cancelAnimationFrame(glowAnimId)
})
</script>

<style scoped>
.timeline-wrapper {
  position: relative;
}

.timeline-line {
  position: absolute;
  top: var(--line-top);
  height: var(--line-height);
  z-index: 5;
}

/* ── Inertia Glow ──
   Pequeño destello radial que viaja por la línea
   siguiendo el scroll con inercia (lerp + RAF).
   Se siente como energía fluyendo. */

.timeline-glow {
  width: 14px;
  height: 32px;
  margin-top: -16px;
  background: radial-gradient(
    ellipse,
    hsla(3, 86%, 64%, 0.35) 0%,
    hsla(3, 86%, 64%, 0.12) 40%,
    transparent 70%
  );
  border-radius: 50%;
  filter: blur(2px);
  will-change: top;
  z-index: 6;
}

/* ── Cycle segments ── */

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
</style>
