<script setup>
import LinkBox from 'src/components/common/LinkBox.vue'
import CopyBox from 'src/components/common/CopyBox.vue'

import { useProjectsStore } from 'src/stores/projects-store'

// LinkBox icons importing
import gmailIcon from 'src/assets/gmail.png'
import gitHubIcon from 'src/assets/github-mark-white.svg'
import linkedInIcon from 'src/assets/linkedin.png'

// Technologies Icons importing
import angular from 'src/assets/icons/angular.svg'
import axios from 'src/assets/icons/axios.svg'
import expressjs from 'src/assets/icons/expressjs.svg'
import getpinoio from 'src/assets/icons/getpinoio.svg'
import javascript from 'src/assets/icons/javascript.svg'
import nodejs from 'src/assets/icons/nodejs.svg'
import pinboard from 'src/assets/icons/pinboard.svg'
import pingcap from 'src/assets/icons/pingcap.svg'

// import { ref, onMounted, computed } from 'vue'
import { ref, onMounted } from 'vue'

import ProjectBox from 'src/components/common/projectBox.vue'
import { storeToRefs } from 'pinia'

const { loadData } = useProjectsStore()
const { projects } = storeToRefs(useProjectsStore())

// const relevantProjects = computed(() => useProjectsStore().relevantProjects)

const icons = ref([angular, axios, expressjs, getpinoio, javascript, nodejs, pinboard, pingcap])

const positions = ref([])

onMounted(() => {
  positions.value = icons.value.map((_, i) => i * 80)

  function animate() {
    positions.value = positions.value.map((x) =>
      x <= -80 ? (icons.value.length - 1) * 80 : x - 0.5,
    )
    requestAnimationFrame(animate)
  }

  loadData()

  animate()
})
</script>

<template>
  <q-page class="text-Neutral200">
    <div
      class="bg-[url('src/assets/pattern-lines.svg')] bg-cover bg-center h-auto flex justify-center pt-12 pb-9 px-4 md:px-42 gap-8 md:gap-20 text-Neutral200"
      style="width: 98vw"
    >
      <!-- <img class="absolute top-3.5 right-0" src="../assets/pattern-squiggly-line-top.svg" alt="" /> -->
      <img class="absolute top-14 left-32 w-32" src="../assets/pattern-circle.svg" />
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
          <q-img src="../assets/me.jpg" :ratio="1" />
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
          class="absolute transition-transform"
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
          >{{ $t('projects.title.highlighted') }}... <q-icon color="accent" name="arrow_drop_down"
        /></span>
      </div>
    </div>

    <div class="">
      <div class="flex px-4 gap-4 md:px-42">
        <q-space></q-space>

        <router-link
          to=""
          class="z-10 cursor-pointer text-weight-bold shadow-[inset_0_-2px_0_0_hsl(3,86%,64%)]"
          >{{ $t('projects.relevant') }}</router-link
        >
        <router-link
          to="portfolio"
          class="z-10 transition-all cursor-pointer duration-300 ease-in-out text-weight-bold hover:shadow-[inset_0_-2px_0_0_hsl(3,86%,64%)]"
          >{{ $t('projects.all') }}</router-link
        >
      </div>
      <div
        class="flex flex-col px-4 md:flex-row mt-4 justify-center items-center gap-4 md:px-42 pb-24"
      >
        <!-- <p v-for="project in relevantProjects" :key="project.id">{{ project.name }}</p> -->

        <ProjectBox
          class="max-w-120"
          v-for="project in projects"
          :key="project.id"
          :id="project.id"
          :name="project.name"
          :description="project.description"
          :languages="project.languages"
          :image="project.imageTop"
        ></ProjectBox>
      </div>
    </div>
  </q-page>
</template>
