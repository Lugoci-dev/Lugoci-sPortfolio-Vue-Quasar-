<script setup>
import LinkBox from 'src/components/common/LinkBox.vue'

import { ref, onMounted } from 'vue'

const icons = ref([
  '/public/icons/angular.svg',
  '/public/icons/axios.svg',
  '/public/icons/expressjs.svg',
  '/public/icons/getpinoio.svg',
  '/public/icons/javascript.svg',
  '/public/icons/nodejs.svg',
  '/public/icons/pinboard.svg',
  '/public/icons/pingcap.svg',
])

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
        <div class="py-4 flex gap-2">
          <LinkBox
            class="min-w-56"
            link-icon="img:src/assets/gmail.png"
            text-link="isaitodaniel@gmail.com"
            action-icon="content_copy"
          ></LinkBox>

          <div class="flex gap-1 justify-between items-center rounded-md w-1/2">
            <LinkBox
              class="min-w-38"
              link-icon="img:src/assets/github-mark-white.svg"
              text-link="GitHub"
            ></LinkBox>
            <LinkBox
              class="min-w-38"
              link-icon="img:src/assets/linkedin.png"
              text-link="LinkedIn"
              action-icon="open_in_new"
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
          <q-icon size="1.5rem" color="accent" name="info"></q-icon>
        </div>
        <!-- <q-space></q-space> -->
      </div>
    </div>

    <!-- <div class="h-18" style="background: linear-gradient(to right, #040918 0%, #091540 100%)"></div> -->

    <img class="absolute right-30" src="../assets/pattern-circle.svg" alt="" />

    <div class="flex pb-16 px-4 md:px-24 items-center justify-between">
      <div class="flex-1">
        <span class="text-accent text-weight-bolder text-4xl"
          ><sapan class="text-warning text-weight-thin">Relevant</sapan> Projects...
          <q-icon color="accent" name="arrow_drop_down"
        /></span>
      </div>

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
    </div>

    <div
      class="px-4 md:px-24 bg-[url('src/assets/pattern-squiggly-line-bottom-desktop.svg')] bg-cover bg-center h-screen"
    >
      <p class="text-2xl">Hello I'am</p>
      <p class="text-4xl">Isaac D. Gonzalez Rodriguez</p>
      <p style="color: hsl(227, 75%, 14%)">- **Neutral 900**: ``</p>
      <p style="color: hsl(226, 25%, 17%)">- **Neutral 800**: ``</p>
      <p style="color: hsl(225, 23%, 24%)">- **Neutral 700**: ``</p>
      <p style="color: hsl(226, 11%, 37%)">- **Neutral 600**: ``</p>
      <p style="color: hsl(0, 0%, 78%)">- **Neutral 300**: ``</p>
      <p style="color: hsl(217, 61%, 90%)">- **Neutral 200**: ``</p>
      <p style="color: hsl(0, 0%, 93%)">- **Neutral 100**: ``</p>
      <p style="color: hsl(200, 60%, 99%)">- **Neutral 0**: ``</p>
    </div>
  </q-page>
</template>

<style></style>
