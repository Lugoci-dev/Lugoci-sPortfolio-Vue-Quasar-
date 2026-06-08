<script setup>
import LinkBox from 'src/components/common/LinkBox.vue'
import CopyBox from 'src/components/common/CopyBox.vue'
import LoadingState from 'src/components/common/LoadingState.vue'

import { useProjectsStore } from 'src/stores/projects-store'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const { loadData } = useProjectsStore()

const baseUrl = import.meta.env.BASE_URL ?? '/'

function assetUrl(relativePath) {
  return `${baseUrl}${relativePath}`
}

function localized(obj) {
  if (!obj) return ''
  if (typeof obj === 'string') return obj
  return obj[locale.value] || obj.en || ''
}

const data = ref(null)
const loading = ref(true)
const error = ref(null)

const techIcons = computed(() => (data.value?.techIcons ?? []).map(assetUrl))
const positions = ref([])
let animId = null

onMounted(async () => {
  try {
    const res = await fetch(`${baseUrl}data/me.json`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    data.value = await res.json()
  } catch (e) {
    console.error('[HomePage] Error loading me.json:', e)
    error.value = e.message
  } finally {
    loading.value = false
  }

  positions.value = techIcons.value.map((_, i) => i * 80)
  loadData()
  loop()
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
})

function loop() {
  const len = techIcons.value.length
  if (len === 0) {
    animId = requestAnimationFrame(loop)
    return
  }
  positions.value = positions.value.map((x) => (x <= -80 ? (len - 1) * 80 : x - 0.5))
  animId = requestAnimationFrame(loop)
}
</script>

<template>
  <q-page class="text-Neutral200">
    <LoadingState :loading="loading" :error="error">
      <template v-if="data">
        <div
          class="bg-[url('src/assets/pattern-lines.svg')] bg-cover bg-center h-auto flex justify-center pt-12 pb-9 px-4 md:px-42 gap-8 md:gap-20 text-Neutral200"
          style="width: 98vw"
        >
          <img
            class="absolute top-14 left-32 w-32"
            loading="lazy"
            src="../assets/pattern-circle.svg"
          />
          <div class="flex-1 flex-col self-center">
            <p class="text-2xl text-adaptive-dark">
              {{ localized(data.greeting)
              }}<span class="text-accent font-extrabold">{{
                localized(data.greetingHighlighted)
              }}</span>
            </p>
            <p class="text-4xl font-extrabold text-adaptive-dark">{{ data.name }}</p>
            <p class="text-adaptive-mid">{{ localized(data.bio) }}</p>
            <q-separator color="accent"></q-separator>
            <div class="py-4 flex flex-col md:flex-row gap-2">
              <CopyBox
                class="min-w-68"
                :box-icon="`img:${assetUrl(data.emailIconFile)}`"
                :text-link="data.email"
              ></CopyBox>

              <div class="flex gap-1 justify-between items-center rounded-md md:w-full">
                <LinkBox
                  v-for="link in data.socialLinks"
                  :key="link.name"
                  class="min-w-38"
                  :link-icon="`img:${assetUrl(link.iconFile)}`"
                  :text-link="link.name"
                  :target="link.url"
                ></LinkBox>
              </div>
            </div>
          </div>

          <div class="flex flex-col md:items-center md:justify-center gap-4">
            <q-avatar size="40vh">
              <q-img :src="assetUrl(data.profileImage)" :ratio="1" />
            </q-avatar>
            <div class="flex flex-col-reverse md:flex-row md:items-center gap-2">
              <span class="text-adaptive-mid text-lg md:text-sm">
                Error <span class="text-accent text-weight-bold">404</span>:
                {{ localized(data.phrase) }}
              </span>
              <router-link to="about">
                <q-icon size="1.5rem" color="accent" name="info"></q-icon>
              </router-link>
            </div>
          </div>
        </div>

        <img class="absolute right-30 z-0" src="../assets/pattern-circle.svg" alt="circle" />

        <div class="flex py-12 md:flex-row-reverse px-4 md:px-42 items-center justify-between">
          <div
            class="relative overflow-hidden w-full md:w-1/2 h-20 flex items-center justify-start border-l-4 border-Red400"
          >
            <div
              v-for="(iconUrl, i) in techIcons"
              :key="i"
              class="absolute will-change-transform"
              :style="{ transform: `translateX(${positions[i]}px)` }"
            >
              <img :src="iconUrl" class="w-8 h-8" />
            </div>
          </div>

          <div class="flex-1 mt-8">
            <span class="text-accent text-weight-bolder text-4xl"
              ><span class="text-adaptive-mid text-weight-thin">{{
                $t('projects.title.announce')
              }}</span
              >{{ $t('projects.title.highlighted') }}...
            </span>
          </div>
        </div>
      </template>
    </LoadingState>
  </q-page>
</template>

<style scoped>
.will-change-transform {
  will-change: transform;
}
</style>
