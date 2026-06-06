<template>
  <q-layout>
    <q-header class="pt-8 px-4 md:px-42" style="background: transparent">
      <q-toolbar class="toolbar-bg" style="border-radius: 12px">
        <q-icon name="code" class="text-accent" size="3rem" />
        <q-toolbar-title class="text-adaptive-dark not-md:hidden font-extrabold">
          Lugoci@<b>dev</b>
        </q-toolbar-title>
        <q-space />
        <div class="text-weight-regular">
          <router-link
            :to="item.path"
            v-for="item in navItems"
            :key="item"
            class="mr-3 nav-link"
            :class="{
              'text-weight-bold  border-Red400 border-b-2': route.path === item.path,
            }"
            >{{ $t(item.name) }}</router-link
          >
        </div>
        <q-space />
        <q-btn flat round dense size="sm" @click="toggleDark" class="q-mr-sm border nav-link">
          <q-icon :name="darkIcon" class="nav-link" size="1.2rem" />
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 4]">
            {{ darkTooltip }}
          </q-tooltip>
        </q-btn>
        <LanguageSwitcher class="md-hidden"></LanguageSwitcher>
        <a
          :href="cvUrl"
          download
          class="transition-all duration-300 ease-in-out p-0.5 cursor-pointer download-hover border border-dashed download-border rounded-md"
        >
          <q-icon
            class="download-bg border border-dashed border-Red400 p-1 rounded-md"
            name="download"
            size="1rem"
          />
          <span class="pr-2 text-accent text-weight-bold">
            <span class="not-md:hidden pl-1">{{ $t('home.nav.download_cv.hide') }}</span
            >{{ $t('home.nav.download_cv.not_hide') }}</span
          >
          <!-- <span class="pr-2 text-accent text-weight-bold"> Download CV</span> -->
        </a>
        <!-- </q-btn> -->
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
// import { ref } from 'vue'
// import EssentialLink from 'components/EssentialLink.vue'
import { computed } from 'vue'
import LanguageSwitcher from 'src/components/LanguageSwitcher.vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

const route = useRoute()
const $q = useQuasar()
const cvUrl = `${import.meta.env.BASE_URL}CV%20IsaacGonz%C3%A1lez-es.pdf`

/* ── Dark mode: 3 estados (auto → forced dark → forced light → auto) ── */
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
    // Salir de auto → forzar el opuesto al estado actual del sistema
    $q.dark.set(!$q.dark.isActive)
  } else if ($q.dark.isActive) {
    // Oscuro forzado → claro
    $q.dark.set(false)
  } else {
    // Claro forzado → volver a auto
    $q.dark.mode = 'auto'
  }
  localStorage.setItem('dark-mode', $q.dark.mode)
}

// const options = ['Home', 'About', 'Portfolio']
const navItems = [
  { name: 'home.nav.home', path: '/' },
  { name: 'home.nav.about', path: '/about' },
  { name: 'home.nav.portfolio', path: '/portfolio' },
]

// const downloadCv = () => {
//   console.log('Downloading CV...')
// }

// const linksList = [
//   {
//     title: 'Docs',
//     caption: 'quasar.dev',
//     icon: 'school',
//     link: 'https://quasar.dev',
//   },
//   {
//     title: 'Github',
//     caption: 'github.com/quasarframework',
//     icon: 'code',
//     link: 'https://github.com/quasarframework',
//   },
//   {
//     title: 'Discord Chat Channel',
//     caption: 'chat.quasar.dev',
//     icon: 'chat',
//     link: 'https://chat.quasar.dev',
//   },
//   {
//     title: 'Forum',
//     caption: 'forum.quasar.dev',
//     icon: 'record_voice_over',
//     link: 'https://forum.quasar.dev',
//   },
//   {
//     title: 'Twitter',
//     caption: '@quasarframework',
//     icon: 'rss_feed',
//     link: 'https://twitter.quasar.dev',
//   },
//   {
//     title: 'Facebook',
//     caption: '@QuasarFramework',
//     icon: 'public',
//     link: 'https://facebook.quasar.dev',
//   },
//   {
//     title: 'Quasar Awesome',
//     caption: 'Community Quasar projects',
//     icon: 'favorite',
//     link: 'https://awesome.quasar.dev',
//   },
// ]

// const leftDrawerOpen = ref(false)

// function toggleLeftDrawer() {
//   leftDrawerOpen.value = !leftDrawerOpen.value
// }
</script>
