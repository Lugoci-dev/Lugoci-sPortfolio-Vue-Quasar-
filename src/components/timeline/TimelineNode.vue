<template>
  <div
    class="timeline-node"
    :class="{ 'is-dimmed': isDimmed, 'is-hovered': isHovered }"
    :style="nodeStyle"
    @mouseenter="$emit('mouseenter')"
    @mouseleave="$emit('mouseleave')"
    role="listitem"
  >
    <span
      class="node-dot"
      :class="entry.side === 'left' ? 'dot-left' : 'dot-right'"
      :style="dotShiftStyle"
    />

    <div
      v-if="hasOffset"
      class="node-connector-v"
      :class="entry.side === 'left' ? 'conn-v-left' : 'conn-v-right'"
      :style="connVStyle"
    />

    <div
      class="node-connector-h"
      :class="entry.side === 'left' ? 'conn-h-left' : 'conn-h-right'"
      :style="dotShiftStyle"
    />

    <div
      class="node-card card-bg card-border border rounded-xl p-5 md:p-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02]"
      :class="entry.side === 'left' ? 'card-left' : 'card-right'"
    >
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  entry: { type: Object, required: true },
  isDimmed: { type: Boolean, default: false },
  isHovered: { type: Boolean, default: false },
})

defineEmits(['mouseenter', 'mouseleave'])

const nodeStyle = computed(() => ({
  position: 'absolute',
  top: `${props.entry.top}px`,
  left: props.entry.side === 'left' ? '0' : 'auto',
  right: props.entry.side === 'left' ? 'auto' : '0',
  width: 'calc(50% - 28px)',
}))

const dotOffset = computed(() => {
  const offset = props.entry.top - props.entry.temporalTop
  return offset > 0 ? offset : 0
})

const hasOffset = computed(() => dotOffset.value > 0)

const dotShiftStyle = computed(() => {
  if (!hasOffset.value) return {}
  return { top: `-${dotOffset.value}px` }
})

const connVStyle = computed(() => ({
  top: `-${dotOffset.value}px`,
  height: `${dotOffset.value}px`,
}))
</script>

<style scoped>
.timeline-node {
  z-index: 10;
  transition:
    opacity 0.35s ease,
    filter 0.35s ease;
}

.timeline-node.is-dimmed {
  opacity: 0.2;
  filter: blur(1px);
  pointer-events: none;
}

.timeline-node.is-hovered {
  z-index: 50 !important;
  opacity: 1;
  filter: none;
}

.timeline-node.is-hovered .node-card {
  transform: scale(1.03);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.node-dot {
  position: absolute;
  top: 0;
  transform: translate(-50%, -50%);
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: var(--n900);
  border: 3px solid hsl(3, 86%, 64%);
  z-index: 15;
  box-shadow: 0 0 6px hsla(3, 86%, 64%, 0.4);
  flex-shrink: 0;
}

.dot-left {
  left: 100%;
}

.dot-right {
  left: 0;
}

.node-connector-v {
  position: absolute;
  width: 2px;
  background: hsl(3, 86%, 64%, 0.15);
  z-index: 4;
  pointer-events: none;
}

.conn-v-left {
  left: calc(100% + 9px);
}

.conn-v-right {
  left: 0;
}

.node-connector-h {
  position: absolute;
  top: 0;
  width: 14px;
  height: 2px;
  background: hsl(3, 86%, 64%, 0.25);
  z-index: 5;
  transform: translateY(-1px);
}

.conn-h-left {
  left: calc(100% + 9px);
}

.conn-h-right {
  right: calc(100% + 9px);
}

.node-card {
  position: relative;
  z-index: 10;
}

.node-card::before {
  content: '';
  position: absolute;
  top: 10px;
  width: 10px;
  height: 10px;
  background: inherit;
  border: inherit;
  z-index: -1;
}

.card-left::before {
  right: -5px;
  border-width: 0 0 1px 1px;
  transform: rotate(45deg);
  box-shadow: -2px 2px 3px rgba(0, 0, 0, 0.08);
}

.card-right::before {
  left: -5px;
  border-width: 1px 1px 0 0;
  transform: rotate(45deg);
  box-shadow: 2px -2px 3px rgba(0, 0, 0, 0.08);
}
</style>
