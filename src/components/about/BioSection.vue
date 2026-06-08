<template>
  <div>
    <p class="text-2xl md:text-3xl font-extrabold text-adaptive-dark mb-4">
      {{ $t('about.title') }}
    </p>
    <p class="text-adaptive-mid text-sm md:text-base leading-relaxed">
      <template v-if="!expanded && needsTruncation">
        {{ truncated }}<span class="text-adaptive-mid"> ... </span>
        <button
          @click="expanded = true"
          class="inline text-accent font-semibold hover:opacity-80 transition-opacity cursor-pointer"
        >
          {{ $t('common.show_more') }}
        </button>
      </template>
      <template v-else>
        {{ fullText }}
        <button
          v-if="needsTruncation"
          @click="expanded = false"
          class="inline text-accent font-semibold hover:opacity-80 transition-opacity cursor-pointer"
        >
          {{ $t('common.show_less') }}
        </button>
      </template>
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const props = defineProps({
  description: { type: [Object, String], required: true },
})

const expanded = ref(false)
const truncateAt = 380

function localized(obj) {
  if (!obj) return ''
  if (typeof obj === 'string') return obj
  return obj[locale.value] || obj.en || ''
}

const fullText = computed(() => localized(props.description))

const needsTruncation = computed(() => fullText.value.length > truncateAt)

const truncated = computed(() => {
  const text = fullText.value
  if (text.length <= truncateAt) return text
  const trimmed = text.substring(0, truncateAt)
  const lastSpace = trimmed.lastIndexOf(' ')
  return lastSpace > 0 ? trimmed.substring(0, lastSpace) : trimmed
})
</script>
