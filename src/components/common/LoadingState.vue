<template>
  <div v-if="loading" class="flex flex-col justify-center items-center py-20">
    <q-spinner :color="color" size="3rem" />
    <p v-if="message" class="text-adaptive-mid mt-4">
      {{ message }}
    </p>
  </div>

  <div v-else-if="error" class="flex flex-col justify-center items-center py-20 text-center">
    <p class="text-Red400 font-bold text-lg">{{ errorTitle || $t('common.error') }}</p>
    <p v-if="error" class="text-adaptive-mid text-sm mt-2">{{ error }}</p>
  </div>

  <slot v-else />
</template>

<script setup>
defineProps({
  loading: Boolean,
  error: { type: String, default: null },
  message: { type: String, default: '' },
  errorTitle: { type: String, default: '' },
  color: { type: String, default: 'accent' },
})
</script>
