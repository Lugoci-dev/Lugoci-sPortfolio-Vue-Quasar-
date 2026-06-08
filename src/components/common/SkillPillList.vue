<template>
  <div v-if="items.length">
    <p class="text-sm font-semibold text-adaptive-mid uppercase tracking-wider mb-3">
      {{ label }}
    </p>
    <div class="flex flex-wrap gap-2">
      <span
        v-for="item in items"
        :key="item"
        class="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
        :class="
          isActive(item)
            ? 'bg-accent text-white shadow-sm'
            : 'border text-adaptive-mid opacity-40 border-adaptive'
        "
      >
        {{ item }}
      </span>
    </div>
  </div>
</template>

<script setup>
function isActive(item) {
  if (!props.activeItems) return false
  if (props.activeItems instanceof Set) return props.activeItems.has(item)
  return props.activeItems.includes(item)
}

const props = defineProps({
  items: { type: Array, required: true },
  activeItems: { type: [Set, Array], default: () => new Set() },
  label: { type: String, default: '' },
})
</script>
