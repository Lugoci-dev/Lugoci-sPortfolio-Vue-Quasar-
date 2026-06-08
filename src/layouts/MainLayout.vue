<template>
  <q-layout>
    <q-drawer v-model="leftDrawerOpen" side="left" behavior="mobile" width="280" class="card-bg">
      <div class="flex flex-col h-full p-4">
        <div class="flex items-center justify-center gap-3 mb-1 mt-6">
          <q-avatar size="2.5rem">
            <img :src="assetUrl(data?.profileImage)" loading="lazy" alt="Isaac" />
          </q-avatar>
          <div class="flex-col justify-center">
            <router-link
              to="/"
              class="flex-1 text-adaptive-dark font-extrabold text-xl no-underline"
            >
              Lugoci@<b>dev</b>
            </router-link>
            <p class="flex-1 text-adaptive-mi text-[11px] mt-0.5 opacity-60 leading-tight">
              {{ data?.name || $t('home.intro.name') }}
            </p>
          </div>
        </div>

        <q-list separator class="mt-6">
          <q-item
            v-for="item in navItems"
            :key="item.path"
            clickable
            :to="item.path"
            @click="leftDrawerOpen = false"
            :active="route.path === item.path"
            active-class="text-accent"
          >
            <q-item-section>
              <q-item-label>{{ $t(item.name) }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <q-space />

        <div class="flex flex-col gap-2">
          <LanguageSwitcher full-width />
          <a
            :href="data?.sourceCode || '#'"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-adaptive/20 text-adaptive-mid hover:text-accent hover:border-accent/30 transition-colors duration-200 text-xs font-semibold no-underline"
          >
            <q-icon name="code" size="1rem" />
            {{ $t('home.nav.source') }}
          </a>

          <q-separator class="my-1" />

          <CopyBox
            :box-icon="`img:${assetUrl(data?.emailIconFile)}`"
            :text-link="data?.email || 'isaitodaniel@gmail.com'"
          />
          <LinkBox
            v-for="link in data?.socialLinks ?? []"
            :key="link.name"
            :link-icon="`img:${assetUrl(link.iconFile)}`"
            :text-link="link.name"
            :target="link.url"
          />
        </div>
      </div>
    </q-drawer>

    <q-header class="pt-8 px-4 md:px-42" style="background: transparent" reveal>
      <q-toolbar class="toolbar-bg" style="border-radius: 12px">
        <q-icon
          name="code"
          class="text-accent cursor-pointer select-none nudge-mobile"
          size="3rem"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title class="text-adaptive-dark font-extrabold">
          <router-link to="/" class="no-underline text-adaptive-dark">
            Lugoci@<b>dev</b>
          </router-link>
        </q-toolbar-title>

        <q-space class="max-md:hidden" />
        <div class="text-weight-regular max-md:hidden">
          <router-link
            :to="item.path"
            v-for="item in navItems"
            :key="item.path"
            class="mr-3 nav-link"
            :class="{
              'text-weight-bold border-Red400 border-b-2': route.path === item.path,
            }"
            >{{ $t(item.name) }}</router-link
          >
        </div>
        <q-space class="max-md:hidden" />

        <q-btn flat round dense size="sm" @click="toggleDark" class="q-mr-sm border nav-link">
          <q-icon :name="darkIcon" class="nav-link" size="1.2rem" />
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 4]">
            {{ darkTooltip }}
          </q-tooltip>
        </q-btn>

        <LanguageSwitcher class="max-md:hidden" />
        <a
          :href="assetUrl(data?.cvFile)"
          download
          class="transition-all duration-300 ease-in-out p-0.5 cursor-pointer download-hover border border-dashed download-border rounded-md"
        >
          <q-icon
            class="download-bg border border-dashed border-Red400 p-1 rounded-md"
            name="download"
            size="1rem"
          />
          <span class="pr-2 text-accent text-weight-bold">
            <span class="not-md:hidden pl-1">{{ $t('home.nav.download_cv.hide') }}</span>
            {{ $t('home.nav.download_cv.not_hide') }}
          </span>
        </a>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view :key="$route.fullPath" />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import LanguageSwitcher from 'src/components/LanguageSwitcher.vue'
import CopyBox from 'src/components/common/CopyBox.vue'
import LinkBox from 'src/components/common/LinkBox.vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

const route = useRoute()
const $q = useQuasar()

const leftDrawerOpen = ref(false)

/* ── Data from me.json ── */
const data = ref(null)

const baseUrl = import.meta.env.BASE_URL ?? '/'

function assetUrl(relativePath) {
  return relativePath ? `${baseUrl}${relativePath}` : ''
}

onMounted(async () => {
  try {
    const res = await fetch(`${baseUrl}data/me.json`)
    if (res.ok) data.value = await res.json()
  } catch (e) {
    console.error('[MainLayout] Error loading me.json:', e)
  }
})

/* ── Dark mode ── */
const darkIcon = computed(() => {
  if ($q.dark.mode === 'auto') return 'brightness_4'
  return $q.dark.isActive ? 'dark_mode' : 'light_mode'
})

const darkTooltip = computed(() => {
  if ($q.dark.mode === 'auto') return 'Auto — sigue al sistema'
  return $q.dark.isActive ? 'Oscuro — toca para cambiar' : 'Claro — toca para cambiar'
})

function toggleDark() {
  const mode = $q.dark.mode
  if (mode === 'auto') {
    $q.dark.set(!$q.dark.isActive)
  } else if ($q.dark.isActive) {
    $q.dark.set(false)
  } else {
    $q.dark.mode = 'auto'
  }
  localStorage.setItem('dark-mode', $q.dark.mode)
}

/* ── Navigation ── */
const navItems = [
  { name: 'home.nav.home', path: '/' },
  { name: 'home.nav.about', path: '/about' },
  { name: 'home.nav.portfolio', path: '/portfolio' },
]
</script>

<style scoped>
@media (max-width: 767px) {
  .nudge-mobile {
    animation: hey-look 2s ease-in-out 8s infinite;
  }
}

@keyframes hey-look {
  0%,
  100% {
    transform: translateX(0);
  }
  15% {
    transform: translateX(4px);
  }
  30% {
    transform: translateX(-4px);
  }
  45% {
    transform: translateX(0);
  }
}
</style>
