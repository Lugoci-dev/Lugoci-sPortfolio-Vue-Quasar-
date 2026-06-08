<template>
  <div class="mobile-timeline relative pl-[36px]">
    <div
      class="absolute left-[15px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-Red400/40 to-transparent pointer-events-none"
    />

    <div v-for="group in mobileYearGroups" :key="group.year">
      <div class="year-section relative z-10 pt-6 pb-2 -ml-[36px] pl-[15px]">
        <span class="font-extrabold text-lg text-Red400 tracking-wide">{{ group.year }}</span>
      </div>

      <div v-for="entry in group.entries" :key="entry.id" class="relative pb-5">
        <span
          class="mobile-dot absolute w-3.5 h-3.5 rounded-full border-[3px] border-Red400 z-10 shadow-md"
          style="left: -20px; top: 20px; transform: translateX(-50%)"
        />

        <div class="mobile-card card-bg card-border border rounded-xl p-5 relative">
          <slot name="card" :entry="entry">
            <component :is="resolveComponent(entry.type)" :entry="entry" />
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { normalizeCycle, yearFromIndex } from 'src/composables/useTimelineEngine'
import ExperienceCard from './cards/ExperienceCard.vue'
import AchievementCard from './cards/AchievementCard.vue'
import AwardCard from './cards/AwardCard.vue'
import CertificationCard from './cards/CertificationCard.vue'
import CollageCard from './cards/CollageCard.vue'

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

const props = defineProps({
  entries: { type: Array, required: true },
})

const mobileYearGroups = computed(() => {
  const items = (props.entries || []).map((entry) => ({
    ...entry,
    ...normalizeCycle(entry.cycle),
  }))

  const sorted = [...items].sort((a, b) => b.startIndex - a.startIndex)

  const groups = {}
  for (const item of sorted) {
    const y = yearFromIndex(item.startIndex)
    if (!groups[y]) groups[y] = []
    groups[y].push(item)
  }

  return Object.entries(groups)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, entries]) => ({ year: Number(year), entries }))
})
</script>

<style scoped>
.mobile-dot {
  background-color: var(--n900);
  box-shadow: 0 0 6px hsla(3, 86%, 64%, 0.4);
}

.body--light .mobile-dot {
  background-color: #ffffff;
}

.year-section {
  border-bottom: 1px solid hsl(3, 86%, 64%, 0.12);
  margin-bottom: 8px;
}

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
