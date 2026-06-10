<template>
  <router-view />
  <AiAssistant />
</template>

<script setup>
import { useQuasar } from 'quasar'
import AiAssistant from 'src/components/assistant/AiAssistant.vue'

// ── Inicializar dark mode desde preferencia guardada o dispositivo ──
// (solo cliente; en SSR el server no tiene localStorage ni matchMedia)
if (process.env.CLIENT) {
  const $q = useQuasar()
  const saved = localStorage.getItem('dark-mode')

  if (saved === 'true') {
    $q.dark.set(true)
  } else if (saved === 'false') {
    $q.dark.set(false)
  } else {
    // Sin preferencia guardada → seguir al sistema
    $q.dark.mode = 'auto'
  }
}
</script>
