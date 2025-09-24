<template>
  <q-layout view="lHh Lpr lFf ">
    <q-header class="pt-8 px-4 md:px-24" style="background: transparent">
      <q-toolbar
        style="background: linear-gradient(to right, #040918 0%, #091540 100%); border-radius: 12px"
      >
        <q-icon name="code" class="text-accent" size="3rem" />
        <q-toolbar-title class="text-Neutral0"> Lugoci@<b>dev</b> </q-toolbar-title>
        <q-space />
        <div class="text-weight-regular">
          <span v-for="option in options" :key="option" style="margin-right: 1rem">{{
            option
          }}</span>
        </div>
        <q-space />
        <!-- <q-btn to="/start/" style="background: hsl(226, 11%, 37%)" size="sm" rounded no-caps> -->
        <button class="p-0.5 border border-dashed border-Neutral600 rounded-md">
          <q-icon
            class="bg-negative border border-dashed border-Red400 p-1 rounded-md"
            name="download"
            size="1rem"
          />
          <span class="pr-2 text-accent text-weight-bold"> Download CV</span>
        </button>
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

const options = ['Home', 'About', 'Portfolio']

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
