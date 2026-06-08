<template>
  <q-page class="px-4 md:px-42 pt-12 pb-24">
    <!-- <div class="text-center mb-16">
      <h1 class="text-adaptive-dark text-4xl md:text-5xl font-extrabold mb-3">
        {{ $t('pages.portfolio') }}
      </h1>
      <p class="text-adaptive-mid text-lg max-w-xl mx-auto">
        Las raíces de mi trayecto — cada proyecto es una rama que crece hacia el presente.
      </p>
    </div> -->

    <div v-if="loading" class="text-center py-20">
      <q-spinner color="Red400" size="3rem" />
      <p class="text-adaptive-mid mt-4">Cargando trayectoria…</p>
    </div>

    <div v-else-if="error" class="text-center py-20">
      <p class="text-Red400 font-bold text-lg">Error al cargar los datos</p>
      <p class="text-adaptive-mid text-sm mt-2">{{ error }}</p>
    </div>

    <TimelineRoot
      v-else-if="timeline.length > 0"
      :entries="timeline"
      :month-height="60"
      :base-offset="40"
    />

    <div v-else class="text-center py-20">
      <p class="text-adaptive-mid">No hay entradas en la timeline todavía.</p>
    </div>
  </q-page>
</template>

<script setup>
import TimelineRoot from 'src/components/timeline/TimelineRoot.vue'
import { useTimelineData } from 'src/composables/useTimelineData'

const { timeline, loading, error } = useTimelineData()
</script>
