<template>
  <q-layout>
    <!-- Left drawer: mobile navigation -->
    <q-drawer v-model="leftDrawerOpen" side="left" behavior="mobile" width="280" class="card-bg">
      <div class="flex flex-col h-full p-4">
        <!-- Branding -->
        <div class="flex items-center gap-3 mb-8 mt-6">
          <q-icon name="code" class="text-accent" size="2.5rem" />
          <span class="text-adaptive-dark font-extrabold text-xl"> Lugoci@<b>dev</b> </span>
        </div>

        <!-- Navigation -->
        <q-list separator>
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

        <!-- Language switcher -->
        <LanguageSwitcher />
      </div>
    </q-drawer>

    <q-header class="pt-8 px-4 md:px-42" style="background: transparent" reveal>
      <q-toolbar class="toolbar-bg" style="border-radius: 12px">
        <q-icon
          name="code"
          class="text-accent cursor-pointer select-none"
          size="3rem"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-toolbar-title class="text-adaptive-dark font-extrabold">
          Lugoci@<b>dev</b>
        </q-toolbar-title>

        <!-- Desktop: nav links -->
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

        <!-- Dark mode toggle -->
        <q-btn flat round dense size="sm" @click="toggleDark" class="q-mr-sm border nav-link">
          <q-icon :name="darkIcon" class="nav-link" size="1.2rem" />
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 4]">
            {{ darkTooltip }}
          </q-tooltip>
        </q-btn>

        <!-- Desktop: LanguageSwitcher -->
        <LanguageSwitcher class="max-md:hidden" />
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
import { computed, ref } from 'vue'
import LanguageSwitcher from 'src/components/LanguageSwitcher.vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

const route = useRoute()
const $q = useQuasar()
const cvUrl = `${import.meta.env.BASE_URL}CV%20IsaacGonz%C3%A1lez-es.pdf`

const leftDrawerOpen = ref(false)

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

const navItems = [
  { name: 'home.nav.home', path: '/' },
  { name: 'home.nav.about', path: '/about' },
  { name: 'home.nav.portfolio', path: '/portfolio' },
]
</script>
