<template>
  <div class="grid grid-cols-2 gap-2 px-4 py-3">
    <button
      v-for="action in actions"
      :key="action.id"
      class="flex items-center gap-2 px-3 py-2.5 text-xs rounded-xl border border-adaptive/10 text-adaptive-mid card-bg hover:border-Red400/30 hover:text-Red400 hover:bg-Red400/5 transition-all duration-200 cursor-pointer"
      @click="$emit('trigger', action.id)"
    >
      <q-icon :name="action.icon" size="1.1rem" class="text-Red400/70" />
      <span class="font-medium truncate">{{ action.label }}</span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  actions: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['trigger'])
</script>
