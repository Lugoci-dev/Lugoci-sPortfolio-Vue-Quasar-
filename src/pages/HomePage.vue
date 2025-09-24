<script setup>
import LinkBox from 'src/components/common/LinkBox.vue'
</script>

<template>
  <q-page>
    <div
      class="h-auto flex justify-center py-12 px-4 md:px-24 gap-8 md:gap-20 text-white"
      style="width: 98vw"
    >
      <div class="flex-1 flex-col self-center">
        <p class="text-2xl">Hello <span class="text-accent">I'am</span></p>
        <p class="text-4xl">Isaac D. Gonzalez Rodriguez</p>
        <p class="text-positive">
          <!-- Error <span class="text-accent text-weight-bold">404</span>: Frase ingeniosa no encontrada! -->
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet nisi inventore, iste quo
          neque aperiam suscipit minus ducimus esse odio, debitis obcaecati eum delectus
          consequuntur facere odit nemo? Magnam, repellendus?
        </p>
        <q-separator color="accent"></q-separator>
        <div class="py-4 flex gap-2">
          <!-- <div
            class="flex flex-1 min-w-56 justify-between items-center bg-dark border rounded-md border-Neutral700 p-2"
          >
            <div class="flex flex-2 justify-center gap-2 items-center">
              <q-icon size="1.5rem" name="img:src/assets/gmail.png" />
              <span>isaitodaniel@gmail.com</span>
            </div>

            <q-icon class="bg-negative p-1.5 rounded-md" name="content_copy" />
          </div> -->
          <LinkBox
            class="min-w-56"
            link-icon="img:src/assets/gmail.png"
            text-link="isaitodaniel@gmail.com"
          ></LinkBox>

          <div class="flex gap-1 justify-between items-center rounded-md w-1/2">
            <!-- <div
              class="flex flex-2 min-w-38 justify-between gap-2 items-center bg-dark border rounded-md border-Neutral700 p-2"
            >
              <div class="flex flex-2 justify-center gap-2 items-center">
                <q-icon size="1.5rem" name="img:src/assets/github-mark-white.svg" />
                <span> GitHub</span>
              </div>

              <q-icon class="bg-negative p-1.5 rounded-md" name="open_in_new" />
            </div> -->
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
            <!-- <div
              class="flex flex-2 min-w-38 justify-between gap-2 items-center bg-dark border rounded-md border-Neutral700 p-2"
            >
              <div class="flex flex-2 justify-center gap-2 items-center">
                <q-icon size="1.5rem" name="img:src/assets/linkedin.png" />
                <span> Linkedin</span>
              </div>
              <q-icon class="bg-negative p-1.5 rounded-md" name="open_in_new" />
            </div> -->
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

    <div class="">
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
