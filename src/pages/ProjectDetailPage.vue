<template>
  <q-page class="py-12 px-4 md:px-42 flex flex-col gap-8">
    <!-- ═══ Back button ═══ -->
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

    <!-- ═══ LOADING ═══ -->
    <div v-if="loading" class="flex justify-center py-20">
      <q-spinner color="accent" size="3rem" />
    </div>

    <!-- ═══ ERROR ═══ -->
    <div v-else-if="error" class="flex justify-center py-20">
      <p class="text-adaptive-mid text-lg">{{ $t('common.error') }}</p>
    </div>

    <!-- ═══ NOT FOUND ═══ -->
    <div v-else-if="!entry" class="flex justify-center py-20">
      <p class="text-adaptive-mid text-lg">{{ $t('common.not_found') }}</p>
    </div>

    <!-- ═══ CONTENT ═══ -->
    <template v-if="entry">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- LEFT: Name + Details -->
        <div class="order-1">
          <!-- ── Header: Avatar + Name ── -->
          <div class="flex items-center gap-4 md:gap-6 mb-8">
            <!-- Avatar circular -->
            <div
              class="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-xl md:text-2xl font-bold shrink-0"
              :class="entry.data.icon ? '' : 'bg-accent/20 text-accent'"
            >
              <img
                v-if="entry.data.icon"
                :src="resolveUrl(entry.data.icon)"
                class="w-full h-full rounded-full object-cover"
              />
              <span v-else>{{ initials }}</span>
            </div>

            <!-- Name y periodo -->
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

              <!-- Link & GitHub buttons -->
              <div class="flex flex-wrap items-center gap-2 mt-3">
                <!-- Live link -->
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

                <!-- GitHub link -->
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

          <!-- ── Items (detailed, NOT summary) ── -->
          <section v-if="visibleItems.length" class="flex flex-col mb-10 items-start">
            <p class="text-lg font-bold text-adaptive-dark mb-4 flex items-center gap-2">
              <span class="w-1 h-5 bg-accent rounded-full inline-block" />
              {{ $t('project.details') }}
            </p>

            <ul class="space-y-3">
              <li
                v-for="(item, i) in visibleItems"
                :key="i"
                class="flex flex-row gap-2 text-adaptive-mid"
              >
                <svg class="w-5 h-5 shrink-0 text-accent" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="flex-1">{{ localized(item) }}</span>
              </li>
            </ul>

            <!-- Expand / Collapse -->
            <button
              v-if="hiddenItemsCount > 0"
              class="self-end mt-3 text-sm font-semibold text-accent hover:opacity-80 transition-opacity cursor-pointer"
              @click="showAllItems = !showAllItems"
            >
              <template v-if="showAllItems">
                {{ $t('common.show_less') }}
              </template>
              <template v-else> +{{ hiddenItemsCount }} {{ $t('common.show_more') }}... </template>
            </button>
          </section>
        </div>
        <!-- RIGHT: Gallery column -->
        <div class="order-4 md:order-2">
          <!-- ── Gallery (collage layout) ── -->
          <section v-if="allGalleryImages.length">
            <p class="text-lg font-bold text-adaptive-dark mb-4 flex items-center gap-2">
              <span class="w-1 h-5 bg-accent rounded-full inline-block" />
              {{ $t('project.gallery') }}
            </p>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- First image: large, spans full row -->
              <div
                v-if="visibleGallery[0]"
                class="md:col-span-3 rounded-xl overflow-hidden card-bg card-border border cursor-pointer group"
                @click="openViewer(0)"
              >
                <img
                  :src="visibleGallery[0]"
                  :alt="`${localized(entry.data.name)} screenshot 1`"
                  class="w-full h-64 md:h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <!-- Remaining images (up to 3) — 3 in a row on desktop, stacked on mobile -->
              <template v-for="(img, i) in visibleGallery.slice(1)" :key="i">
                <div
                  class="relative rounded-xl overflow-hidden card-bg card-border border cursor-pointer group aspect-square"
                >
                  <img
                    :src="img"
                    :alt="`${localized(entry.data.name)} screenshot ${i + 2}`"
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    @click="openViewer(i + 1)"
                  />
                  <!-- +N overlay on the last visible card when there are hidden images -->
                  <div
                    v-if="i === 2 && remainingCount > 0"
                    class="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors"
                    @click="openViewer(3)"
                  >
                    <span class="text-white text-3xl md:text-4xl font-bold"
                      >+{{ remainingCount }}</span
                    >
                  </div>
                </div>
              </template>
            </div>
          </section>
        </div>
        <!-- PROJECTS: selector (collage only, full width) -->
        <div
          v-if="entry.type === 'collage' && entry.data.projects?.length"
          class="order-2 md:order-3 md:col-span-2 mb-8"
        >
          <p class="text-lg font-bold text-adaptive-dark mb-4 flex items-center gap-2">
            <span class="w-1 h-5 bg-accent rounded-full inline-block" />
            {{ $t('project.projects') }}
          </p>
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
        <!-- BOTTOM: Skills & Tools (full width) -->
        <div class="order-3 md:order-4 md:col-span-2">
          <section class="mb-10">
            <p class="text-lg font-bold text-adaptive-dark mb-4 flex items-center gap-2">
              <span class="w-1 h-5 bg-accent rounded-full inline-block" />
              {{ $t('project.skills') }}
            </p>

            <!-- Combined matrix: highlights current entry/project, dims others -->
            <!-- Technologies -->
            <div v-if="allTechnologies.length" class="mb-6">
              <p class="text-sm font-semibold text-adaptive-mid uppercase tracking-wider mb-3">
                {{ $t('project.technologies') }}
              </p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tech in allTechnologies"
                  :key="tech"
                  class="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                  :class="
                    entryTechnologies.has(tech)
                      ? 'bg-accent text-white shadow-sm'
                      : 'border text-adaptive-mid opacity-40 border-adaptive'
                  "
                >
                  {{ tech }}
                </span>
              </div>
            </div>

            <!-- Tools -->
            <div v-if="allTools.length">
              <p class="text-sm font-semibold text-adaptive-mid uppercase tracking-wider mb-3">
                {{ $t('project.tools') }}
              </p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tool in allTools"
                  :key="tool"
                  class="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                  :class="
                    entryTools.has(tool)
                      ? 'bg-accent text-white shadow-sm'
                      : 'border text-adaptive-mid opacity-40 border-adaptive'
                  "
                >
                  {{ tool }}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <!-- ── Image Viewer ── -->
      <ImageViewer
        v-if="viewerOpen"
        :images="allGalleryImages"
        :initial-index="viewerIndex"
        @close="viewerOpen = false"
      />
    </template>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ImageViewer from 'src/components/common/ImageViewer.vue'
import { useTimelineData } from 'src/composables/useTimelineData'

const route = useRoute()
const { locale } = useI18n()

const { timeline, loading, error } = useTimelineData()

const entry = computed(() => {
  return timeline.value.find((e) => e.id === route.params.id)
})

/* ── Collage: active project tracking ── */
const activeProjectIndex = ref(0)
const currentProject = computed(() => {
  if (entry.value?.type === 'collage') {
    return entry.value?.data?.projects?.[activeProjectIndex.value] ?? null
  }
  return null
})

/* ── Iniciales del nombre para fallback del avatar ── */
const initials = computed(() => {
  const name = localized(entry.value?.data?.name)
  if (!name) return '?'
  return name
    .split(/[\s-/]+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

/* ── Expand/collapse for items list ── */
const showAllItems = ref(false)
const visibleItems = computed(() => {
  const items =
    entry.value?.type === 'collage'
      ? (currentProject.value?.items ?? [])
      : (entry.value?.data?.items ?? [])
  if (showAllItems.value) return items
  return items.slice(0, 3)
})
const hiddenItemsCount = computed(() => {
  const items =
    entry.value?.type === 'collage'
      ? (currentProject.value?.items ?? [])
      : (entry.value?.data?.items ?? [])
  return Math.max(0, items.length - 3)
})

/* ── Base URL helper (needed for public path resolution) ── */
const baseUrl = import.meta.env.BASE_URL
function resolveUrl(path) {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/')) return path
  return baseUrl + path
}

/* ── Image viewer state ── */
const viewerOpen = ref(false)
const viewerIndex = ref(0)

function openViewer(index) {
  viewerIndex.value = index
  viewerOpen.value = true
}

/* ── Gallery images (all resolved for the viewer) ── */
const allGalleryImages = computed(() => {
  const gallery =
    entry.value?.type === 'collage'
      ? (currentProject.value?.gallery ?? [])
      : (entry.value?.data?.gallery ?? [])
  return gallery.map((img) => resolveUrl(img))
})

/* ── First 4 visible images for the collage ── */
const visibleGallery = computed(() => {
  return allGalleryImages.value.slice(0, 4)
})

/* ── How many images are hidden beyond the 4 shown ── */
const remainingCount = computed(() => {
  return Math.max(0, allGalleryImages.value.length - 4)
})

/* ── Todas las technologies de experience entries + collage projects ── */
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

/* ── Todas las tools de experience entries + collage projects ── */
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

/* ── Technologies y tools del entry actual (como Set para lookup rápido) ── */
const entryTechnologies = computed(() => {
  if (entry.value?.type === 'collage') return new Set(currentProject.value?.technologies ?? [])
  return new Set(entry.value?.data?.technologies ?? [])
})
const entryTools = computed(() => {
  if (entry.value?.type === 'collage') return new Set(currentProject.value?.tools ?? [])
  return new Set(entry.value?.data?.tools ?? [])
})

/* ── Link URLs: from entry or from current collage project ── */
const linkUrl = computed(() => {
  if (entry.value?.type === 'collage') return currentProject.value?.link ?? null
  return entry.value?.data?.link ?? null
})
const githubUrl = computed(() => {
  if (entry.value?.type === 'collage') return currentProject.value?.github ?? null
  return entry.value?.data?.github ?? null
})

/* ── Helper de i18n ── */
function localized(obj) {
  if (!obj) return ''
  return obj[locale.value] || obj.en || ''
}
</script>
