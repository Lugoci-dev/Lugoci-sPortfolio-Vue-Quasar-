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
          <div class="w-full h-full bg-gradient-to-b from-Red400/10 via-Red400/45 to-Red400/15" />
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
import { computed, ref } from 'vue'
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
