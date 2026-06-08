<template>
  <div :class="fullWidth ? 'w-full' : ''">
    <q-btn-dropdown
      :class="fullWidth ? 'px-2 text-adaptive-mid w-full' : 'px-2 text-adaptive-mid'"
      split
      unelevated
      flat
      no-caps
      dropdown-icon="arrow_drop_down"
    >
      <template v-slot:label>
        <div class="row items-center no-wrap">
          <q-icon left size="1rem" :name="currentFlag" />
          <div class="text-center">{{ $t('home.nav.language') }}</div>
        </div>
      </template>

      <q-list class="dropdown-bg dropdown-text">
        <q-item clickable v-close-popup @click="setLang('es')">
          <div class="flex items-center gap-2"><q-icon :name="`img:${es}`" /> Español</div>
        </q-item>
        <q-item clickable v-close-popup @click="setLang('en')">
          <div class="flex items-center gap-2"><q-icon :name="`img:${us}`" /> English</div>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'

import us from '../../public/icons/us.svg'
import es from '../../public/icons/es.svg'

defineProps({
  fullWidth: { type: Boolean, default: false },
})

const { locale } = useI18n()
const $q = useQuasar()

const currentFlag = computed(() => {
  switch (locale.value) {
    case 'es':
      return `img:${es}`
    case 'en':
      return `img:${us}`
    default:
      return `img:${us}`
  }
})

function setLang(lang) {
  locale.value = lang
  // Quasar usa 'en-US' para inglés y 'es' para español
  $q.lang.set(lang === 'es' ? 'es' : 'en-US')
  localStorage.setItem('locale', lang)
}
</script>
