<template>
  <q-page class="px-4 md:px-42 pt-12 pb-24">
    <LoadingState
      :loading="loading"
      :error="error"
      message="Cargando trayectoria…"
      error-title="Error al cargar los datos"
    >
      <TimelineRoot
        v-if="timeline.length > 0"
        :entries="timeline"
        :month-height="60"
        :base-offset="40"
      />
      <div v-else class="flex justify-center py-20">
        <p class="text-adaptive-mid">No hay entradas en la timeline todavía.</p>
      </div>
    </LoadingState>
    <PageNavigator :prev="{ name: $t('nav.about'), path: '/about' }" />
  </q-page>
</template>

<script setup>
import TimelineRoot from 'src/components/timeline/TimelineRoot.vue'
import LoadingState from 'src/components/common/LoadingState.vue'
import PageNavigator from 'src/components/common/PageNavigator.vue'
import { useTimelineData } from 'src/composables/useTimelineData'

const { timeline, loading, error } = useTimelineData()
</script>
