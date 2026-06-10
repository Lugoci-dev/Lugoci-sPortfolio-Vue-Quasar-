<template>
  <q-page class="px-4 md:px-42 pt-16 pb-24">
    <LoadingState :loading="loading" :error="error">
      <template v-if="data">
        <div class="max-w-6xl mx-auto flex flex-col gap-16 md:gap-20">
          <q-intersection once @visibility="(v) => v && (row1Vis = true)">
            <div
              class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-start"
              :class="['reveal', { visible: row1Vis }]"
            >
              <BioSection :description="data.bio.description" class="md:mt-auto" />

              <div class="md:-mt-4">
                <p class="text-2xl md:text-3xl font-extrabold text-adaptive-dark mb-4">
                  {{ $t('about.expertise') }}
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    v-for="(item, i) in data.expertise"
                    :key="i"
                    class="expertise-card card-bg card-border border rounded-xl p-4 hover:border-accent/30 hover:shadow-sm transition-colors duration-300 cursor-default"
                  >
                    <q-icon
                      :name="iconMap[item.icon] || 'code'"
                      size="1.5rem"
                      color="accent"
                      class="mb-2 block"
                    />
                    <p class="text-sm font-bold text-adaptive-dark mb-1">
                      {{ localized(item.title) }}
                    </p>
                    <p class="text-xs text-adaptive-mid leading-relaxed">
                      {{ localized(item.description) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </q-intersection>

          <q-intersection once @visibility="(v) => v && (row2Vis = true)">
            <div
              class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-start"
              :class="['reveal', { visible: row2Vis }]"
            >
              <EducationBlock
                :education="data.education"
                :languages="data.languages"
                class="md:mt-6"
              />

              <div class="md:-mt-2">
                <p class="text-2xl md:text-3xl font-extrabold text-adaptive-dark mb-4">
                  {{ $t('about.skills') }}
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                  <div v-for="(skills, category) in data.skills" :key="category" class="skills-cat">
                    <p class="text-xs font-bold text-adaptive-dark uppercase tracking-wider mb-3">
                      {{ categoryLabel(category) }}
                    </p>
                    <div class="flex flex-wrap gap-1.5">
                      <span
                        v-for="skill in skills"
                        :key="skill"
                        class="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-accent/10 text-accent"
                      >
                        {{ skill }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-intersection>
        </div>
      </template>
    </LoadingState>
    <PageNavigator
      :prev="{ name: $t('nav.home'), path: '/' }"
      :next="{ name: $t('nav.portfolio'), path: '/portfolio' }"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import BioSection from 'src/components/about/BioSection.vue'
import EducationBlock from 'src/components/about/EducationBlock.vue'
import LoadingState from 'src/components/common/LoadingState.vue'
import PageNavigator from 'src/components/common/PageNavigator.vue'

const { t, locale } = useI18n()

const data = ref(null)
const loading = ref(true)
const error = ref(null)

const row1Vis = ref(false)
const row2Vis = ref(false)

const iconMap = {
  Rocket: 'rocket_launch',
  LayoutDashboard: 'dashboard',
  Smartphone: 'phone_android',
  Bot: 'smart_toy',
}

function localized(obj) {
  if (!obj) return ''
  if (typeof obj === 'string') return obj
  return obj[locale.value] || obj.en || ''
}

function categoryLabel(key) {
  const map = {
    frontend: t('about.frontend'),
    backend: t('about.backend'),
    tools: t('about.tools'),
    ai: t('about.ai'),
  }
  return map[key] || key
}

onMounted(async () => {
  try {
    const base = import.meta.env.BASE_URL ?? '/'
    const res = await fetch(`${base}data/about.json`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    data.value = await res.json()
  } catch (e) {
    console.error('[AboutPage] Error:', e)
    error.value = e.message
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

.expertise-card {
  opacity: 0;
  transform: translateY(16px);
}
.reveal.visible .expertise-card {
  animation: fadeUp 0.5s ease forwards;
}
.expertise-card:nth-child(odd) {
  margin-top: 12px;
}
.expertise-card:nth-child(1) {
  animation-delay: 0ms;
}
.expertise-card:nth-child(2) {
  animation-delay: 100ms;
}
.expertise-card:nth-child(3) {
  animation-delay: 200ms;
}
.expertise-card:nth-child(4) {
  animation-delay: 300ms;
}

.skills-cat:nth-child(even) {
  margin-top: 16px;
}

@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
