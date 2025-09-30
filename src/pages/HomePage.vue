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

import { ref, onMounted, computed } from 'vue'
import ProjectBox from 'src/components/common/projectBox.vue'
// import { storeToRefs } from 'pinia'

// const { projects } = storeToRefs(useProjectsStore())

const relevantProjects = computed(() => useProjectsStore().relevantProjects)

const icons = ref([angular, axios, expressjs, getpinoio, javascript, nodejs, pinboard, pingcap])

const positions = ref([])

onMounted(() => {
  // Inicializa las posiciones en fila
  positions.value = icons.value.map((_, i) => i * 80)

  function animate() {
    positions.value = positions.value.map((x) =>
      x <= -80 ? (icons.value.length - 1) * 80 : x - 0.5,
    )
    requestAnimationFrame(animate)
  }

  animate()
})
</script>

<template>
  <q-page class="text-Neutral200">
    <div
      class="bg-[url('src/assets/pattern-lines.svg')] bg-cover bg-center h-auto flex justify-center pt-12 pb-9 px-4 md:px-24 gap-8 md:gap-20 text-Neutral200"
      style="width: 98vw"
    >
      <!-- <img class="absolute top-3.5 right-0" src="../assets/pattern-squiggly-line-top.svg" alt="" /> -->
      <img class="absolute top-14 left-32 w-32" src="../assets/pattern-circle.svg" />
      <div class="flex-1 flex-col self-center">
        <p class="text-2xl">Hello <span class="text-accent text-weight-bolder">I'am</span></p>
        <p class="text-4xl">Isaac D. Gonzalez Rodriguez</p>
        <p class="text-positive">
          <!-- Error <span class="text-accent text-weight-bold">404</span>: Frase ingeniosa no encontrada! -->
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet nisi inventore, iste quo
          neque aperiam suscipit minus ducimus esse odio, debitis obcaecati eum delectus
          consequuntur facere odit nemo? Magnam, repellendus?
        </p>
        <q-separator color="accent"></q-separator>
        <div class="py-4 flex flex-col md:flex-row gap-2">
          <CopyBox
            class="min-w-68"
            :box-icon="`img:${gmailIcon}`"
            text-link="isaitodaniel@gmail.com"
          ></CopyBox>

          <div class="flex gap-1 justify-between items-center rounded-md md:w-1/2">
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

      <div class="flex flex-col items-center justify-center gap-4">
        <q-avatar size="350px">
          <q-img src="../assets/me.jpg" :ratio="1" />
        </q-avatar>
        <div class="flex items-center gap-2">
          <span class="text-positive">
            Error <span class="text-accent text-weight-bold">404</span>: Frase ingeniosa no
            encontrada!
          </span>
          <router-link to="about">
            <q-icon size="1.5rem" color="accent" name="info"></q-icon>
          </router-link>
        </div>
        <!-- <q-space></q-space> -->
      </div>
    </div>

    <!-- <div class="h-18" style="background: linear-gradient(to right, #040918 0%, #091540 100%)"></div> -->

    <img class="absolute right-30" src="../assets/pattern-circle.svg" alt="" />

    <div class="flex pb-12 md:flex-row-reverse px-4 md:px-24 items-center justify-between">
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

      <div class="flex-1">
        <span class="text-accent text-weight-bolder text-4xl"
          ><span class="text-warning text-weight-thin">Relevant</span>Projects...
          <q-icon color="accent" name="arrow_drop_down"
        /></span>
      </div>
    </div>

    <div class="flex justify-around">
      <q-space></q-space>
      <router-link
        to="portfolio"
        class="transition-all duration-300 ease-in-out mx-4 md:mx-24 text-weight-bold hover:shadow-[inset_0_-2px_0_0_hsl(3,86%,64%)]"
        >All projects</router-link
      >
    </div>
    <div
      class="flex flex-col md:flex-row mt-4 justify-center items-center gap-4 px-4 md:px-24 bg-[url('src/assets/pattern-squiggly-line-bottom-desktop.svg')] bg-cover bg-center pb-24"
    >
      <!-- <p v-for="project in relevantProjects" :key="project.id">{{ project.name }}</p> -->

      <ProjectBox
        class="md:min-w-80 md:max-w-100"
        v-for="project in relevantProjects"
        :key="project.id"
        :id="project.id"
        :name="project.name"
        :description="project.description"
        :languages="project.languages"
        :image="project.imageTop"
      ></ProjectBox>

      <!-- <p class="text-2xl">Hello I'am</p>
      <p class="text-4xl">Isaac D. Gonzalez Rodriguez</p>
      <p style="color: hsl(227, 75%, 14%)">- **Neutral 900**: ``</p>
      <p style="color: hsl(226, 25%, 17%)">- **Neutral 800**: ``</p>
      <p style="color: hsl(225, 23%, 24%)">- **Neutral 700**: ``</p>
      <p style="color: hsl(226, 11%, 37%)">- **Neutral 600**: ``</p>
      <p style="color: hsl(0, 0%, 78%)">- **Neutral 300**: ``</p>
      <p style="color: hsl(217, 61%, 90%)">- **Neutral 200**: ``</p>
      <p style="color: hsl(0, 0%, 93%)">- **Neutral 100**: ``</p>
      <p style="color: hsl(200, 60%, 99%)">- **Neutral 0**: ``</p> -->
    </div>
  </q-page>
</template>

<style></style>
