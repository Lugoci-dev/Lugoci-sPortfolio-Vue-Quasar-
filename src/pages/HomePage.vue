<script setup>
import LinkBox from 'src/components/common/LinkBox.vue'
import CopyBox from 'src/components/common/CopyBox.vue'

import { useProjectsStore } from 'src/stores/projects-store'

import gmailIcon from 'src/assets/gmail.png'
import gitHubIcon from 'src/assets/github-mark-white.svg'
import linkedInIcon from 'src/assets/linkedin.png'

import angular from 'src/assets/icons/angular.svg'
import axios from 'src/assets/icons/axios.svg'
import expressjs from 'src/assets/icons/expressjs.svg'
import getpinoio from 'src/assets/icons/getpinoio.svg'
import javascript from 'src/assets/icons/javascript.svg'
import nodejs from 'src/assets/icons/nodejs.svg'
import pinboard from 'src/assets/icons/pinboard.svg'
import pingcap from 'src/assets/icons/pingcap.svg'

import { ref, onMounted, onUnmounted } from 'vue'

const { loadData } = useProjectsStore()

const icons = [angular, axios, expressjs, getpinoio, javascript, nodejs, pinboard, pingcap]

const positions = ref([])
let animId = null

onMounted(() => {
  positions.value = icons.map((_, i) => i * 80)
  loadData()
  loop()
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
})

function loop() {
  positions.value = positions.value.map((x) => (x <= -80 ? (icons.length - 1) * 80 : x - 0.5))
  animId = requestAnimationFrame(loop)
}
</script>

<template>
  <q-page class="text-Neutral200">
    <div
      class="bg-[url('src/assets/pattern-lines.svg')] bg-cover bg-center h-auto flex justify-center pt-12 pb-9 px-4 md:px-42 gap-8 md:gap-20 text-Neutral200"
      style="width: 98vw"
    >
      <img class="absolute top-14 left-32 w-32" loading="lazy" src="../assets/pattern-circle.svg" />
      <div class="flex-1 flex-col self-center">
        <p class="text-2xl text-adaptive-dark">
          {{ $t('home.intro.hello.greeting')
          }}<span class="text-accent font-extrabold">{{ $t('home.intro.hello.highlighted') }}</span>
        </p>
        <p class="text-4xl font-extrabold text-adaptive-dark">{{ $t('home.intro.name') }}</p>
        <p class="text-adaptive-mid">{{ $t('home.intro.bio') }}</p>
        <q-separator color="accent"></q-separator>
        <div class="py-4 flex flex-col md:flex-row gap-2">
          <CopyBox
            class="min-w-68"
            :box-icon="`img:${gmailIcon}`"
            text-link="isaitodaniel@gmail.com"
          ></CopyBox>

          <div class="flex gap-1 justify-between items-center rounded-md md:w-full">
            <LinkBox
              class="min-w-38"
              :link-icon="`img:${gitHubIcon}`"
              text-link="GitHub"
              target="https://www.github.com"
            ></LinkBox>
            <LinkBox
              class="min-w-38"
              :link-icon="`img:${linkedInIcon}`"
              text-link="LinkedIn"
              action-icon="open_in_new"
              target="https://www.linkedin.com"
            ></LinkBox>
          </div>
        </div>
      </div>

      <div class="flex flex-col md:items-center md:justify-center gap-4">
        <q-avatar size="40vh">
          <q-img src="../assets/images/owner.webp" :ratio="1" />
        </q-avatar>
        <div class="flex flex-col-reverse md:flex-row md:items-center gap-2">
          <span class="text-adaptive-mid text-lg md:text-sm">
            Error <span class="text-accent text-weight-bold">404</span>: {{ $t('home.phrase.404') }}
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
          v-for="(icon, i) in icons"
          :key="i"
          class="absolute will-change-transform"
          :style="{ transform: `translateX(${positions[i]}px)` }"
        >
          <img :src="icon" class="w-8 h-8" />
        </div>
      </div>

      <div class="flex-1 mt-8">
        <span class="text-accent text-weight-bolder text-4xl"
          ><span class="text-adaptive-mid text-weight-thin">{{
            $t('projects.title.announce')
          }}</span
          >{{ $t('projects.title.highlighted') }}...
          <!-- <q-icon color="accent" name="arrow_drop_down"/> -->
        </span>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.will-change-transform {
  will-change: transform;
}
</style>
