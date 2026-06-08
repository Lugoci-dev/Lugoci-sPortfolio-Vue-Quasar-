<template>
  <q-page class="py-12 px-4 md:px-42 flex flex-col gap-8">
    <button
      @click="$router.back()"
      class="flex items-center gap-1 text-accent hover:opacity-80 transition-opacity mb-12 cursor-pointer"
    >
      <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path
          fill-rule="evenodd"
          d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
          clip-rule="evenodd"
        />
      </svg>
      <span class="text-sm font-semibold">{{ $t('common.back') }}</span>
    </button>

    <LoadingState :loading="loading" :error="error">
      <div v-if="!entry" class="flex justify-center py-20">
        <p class="text-adaptive-mid text-lg">{{ $t('common.not_found') }}</p>
      </div>
      <template v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="order-1">
            <div class="flex items-center gap-4 md:gap-6 mb-8">
              <div class="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden shrink-0">
                <img :src="resolveUrl(currentIcon)" class="w-full h-full object-cover" />
              </div>

              <div>
                <p class="text-2xl md:text-3xl font-extrabold text-adaptive-dark leading-tight">
                  {{ localized(entry.data.name) }}
                </p>
                <p class="text-adaptive-mid text-sm mt-1">
                  {{ localized(entry.cycle.start.label) }} {{ entry.cycle.start.year }}
                  —
                  {{
                    entry.cycle.end
                      ? `${localized(entry.cycle.end.label)} ${entry.cycle.end.year}`
                      : $t('common.present')
                  }}
                </p>

                <div class="flex flex-wrap items-center gap-2 mt-3">
                  <a
                    v-if="linkUrl"
                    :href="linkUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-accent text-white hover:opacity-85 transition-opacity"
                  >
                    <svg
                      class="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    {{ $t('common.live') }}
                  </a>
                  <span
                    v-else
                    class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border text-adaptive-mid opacity-40 cursor-default"
                    style="border-color: var(--n600)"
                    :title="$t('common.not_available')"
                  >
                    <svg
                      class="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    {{ $t('common.live') }}
                  </span>

                  <a
                    v-if="githubUrl"
                    :href="githubUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-accent text-white hover:opacity-85 transition-opacity"
                  >
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
                      />
                    </svg>
                    {{ $t('common.code') }}
                  </a>
                  <span
                    v-else
                    class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border text-adaptive-mid opacity-40 cursor-default"
                    style="border-color: var(--n600)"
                    :title="$t('common.not_available')"
                  >
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
                      />
                    </svg>
                    {{ $t('common.code') }}
                  </span>
                </div>
              </div>
            </div>

            <ItemList :items="localizedItems" class="mb-10" />
          </div>
          <div class="order-4 md:order-2">
            <section v-if="allGalleryImages.length">
              <SectionTitle :label="$t('project.gallery')" />

              <ImageGallery :images="allGalleryImages" :alt="entryName" @open="openViewer" />
            </section>
          </div>
          <div
            v-if="entry.type === 'collage' && entry.data.projects?.length"
            class="order-2 md:order-3 md:col-span-2 mb-8"
          >
            <SectionTitle :label="$t('project.projects')" />
            <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              <button
                v-for="(proj, i) in entry.data.projects"
                :key="proj.id"
                class="flex-shrink-0 w-48 md:w-56 p-3 rounded-xl border text-left transition-all duration-200"
                :class="
                  activeProjectIndex === i
                    ? 'border-accent bg-accent/10 shadow-sm'
                    : 'border-transparent card-bg card-border hover:border-adaptive'
                "
                @click="activeProjectIndex = i"
              >
                <p class="text-xs font-bold text-adaptive-dark leading-snug mb-1">
                  {{ localized(proj.name) }}
                </p>
                <p class="text-[11px] text-adaptive-mid leading-tight line-clamp-2">
                  {{ localized(proj.summary) }}
                </p>
              </button>
            </div>
          </div>
          <div class="order-3 md:order-4 md:col-span-2">
            <section class="mb-10">
              <SectionTitle :label="$t('project.skills')" />

              <SkillPillList
                :items="allTechnologies"
                :active-items="entryTechnologies"
                :label="$t('project.technologies')"
                class="mb-6"
              />
              <SkillPillList
                :items="allTools"
                :active-items="entryTools"
                :label="$t('project.tools')"
              />
            </section>
          </div>
        </div>

        <ImageViewer
          v-if="viewerOpen"
          :images="allGalleryImages"
          :initial-index="viewerIndex"
          @close="viewerOpen = false"
        />
      </template>
    </LoadingState>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ImageViewer from 'src/components/common/ImageViewer.vue'
import ImageGallery from 'src/components/common/ImageGallery.vue'
import SectionTitle from 'src/components/common/SectionTitle.vue'
import SkillPillList from 'src/components/common/SkillPillList.vue'
import ItemList from 'src/components/common/ItemList.vue'
import LoadingState from 'src/components/common/LoadingState.vue'
import { useTimelineData } from 'src/composables/useTimelineData'

const route = useRoute()
const { locale } = useI18n()

const { timeline, loading, error } = useTimelineData()

const entry = computed(() => {
  return timeline.value.find((e) => e.id === route.params.id)
})

const activeProjectIndex = ref(0)
const currentProject = computed(() => {
  if (entry.value?.type === 'collage') {
    return entry.value?.data?.projects?.[activeProjectIndex.value] ?? null
  }
  return null
})

const currentData = computed(() => {
  if (entry.value?.type === 'collage') return currentProject.value ?? {}
  return entry.value?.data ?? {}
})

const entryName = computed(() => localized(entry.value?.data?.name))

/**
 * Icon to display in the avatar:
 * - For collage projects: project icon → entry icon → fallback /icon.webp
 * - For other entries: entry icon → fallback /icon.webp
 * Never shows initials — always shows an image.
 */
const currentIcon = computed(() => {
  if (entry.value?.type === 'collage') {
    return currentData.value?.icon || entry.value?.data?.icon || 'icon.webp'
  }
  return entry.value?.data?.icon || 'icon.webp'
})

const localizedItems = computed(() =>
  (currentData.value?.items ?? []).map((item) => localized(item)),
)

const baseUrl = import.meta.env.BASE_URL
function resolveUrl(path) {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/')) return path
  return baseUrl + path
}

const viewerOpen = ref(false)
const viewerIndex = ref(0)

function openViewer(index) {
  viewerIndex.value = index
  viewerOpen.value = true
}

const allGalleryImages = computed(() =>
  (currentData.value?.gallery ?? []).map((img) => resolveUrl(img)),
)

const allTechnologies = computed(() => {
  const techs = new Set()
  for (const e of timeline.value) {
    if (e.type === 'experience' && e.data?.technologies) {
      for (const t of e.data.technologies) techs.add(t)
    }
    if (e.type === 'collage' && e.data?.projects) {
      for (const proj of e.data.projects) {
        if (proj.technologies) for (const t of proj.technologies) techs.add(t)
      }
    }
  }
  return [...techs].sort()
})

const allTools = computed(() => {
  const tools = new Set()
  for (const e of timeline.value) {
    if (e.type === 'experience' && e.data?.tools) {
      for (const t of e.data.tools) tools.add(t)
    }
    if (e.type === 'collage' && e.data?.projects) {
      for (const proj of e.data.projects) {
        if (proj.tools) for (const t of proj.tools) tools.add(t)
      }
    }
  }
  return [...tools].sort()
})

const entryTechnologies = computed(() => new Set(currentData.value?.technologies ?? []))
const entryTools = computed(() => new Set(currentData.value?.tools ?? []))

const linkUrl = computed(() => currentData.value?.link ?? null)
const githubUrl = computed(() => currentData.value?.github ?? null)

function localized(obj) {
  if (!obj) return ''
  return obj[locale.value] || obj.en || ''
}
</script>
