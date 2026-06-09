<template>
  <div
    ref="nodeRef"
    class="timeline-node"
    :class="{
      'is-dimmed': isDimmed,
      'is-hovered': isHovered,
      'is-visible': isVisible,
    }"
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

    <div class="card-stack-wrapper relative">
      <!-- Ghost cards for collage multi-project stack -->
      <div
        v-for="n in ghostCount"
        :key="n"
        class="card-stack-ghost absolute rounded-xl border card-bg card-border pointer-events-none"
        :class="entry.side === 'left' ? 'ghost-peek-right' : 'ghost-peek-left'"
        :style="ghostStackStyle(n)"
      />

      <div
        class="node-card card-bg card-border border rounded-xl p-5 md:p-6"
        :class="entry.side === 'left' ? 'card-left' : 'card-right'"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  entry: { type: Object, required: true },
  isDimmed: { type: Boolean, default: false },
  isHovered: { type: Boolean, default: false },
})

defineEmits(['mouseenter', 'mouseleave'])

/* ── Scroll reveal via IntersectionObserver ── */
const nodeRef = ref(null)
const isVisible = ref(false)
let observer = null

onMounted(() => {
  if (!nodeRef.value) return
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true
        observer?.unobserve(entry.target)
      }
    },
    { threshold: 0.08, rootMargin: '0px 0px -20px 0px' },
  )
  observer.observe(nodeRef.value)
})

onUnmounted(() => {
  observer?.disconnect()
})

/* ── Positioning ── */
const nodeStyle = computed(() => ({
  position: 'absolute',
  top: `${props.entry.top}px`,
  left: props.entry.side === 'left' ? '0' : 'auto',
  right: props.entry.side === 'left' ? 'auto' : '0',
  width: 'calc(50% - 28px)',
}))

/**
 * Always 3 ghost cards for collage type — consistent stacked-card visual.
 */
const ghostCount = computed(() => (props.entry.type === 'collage' ? 3 : 0))

/**
 * Inline style for ghost cards at position n (1-based).
 * Translates away from the timeline center line.
 */
function ghostStackStyle(n) {
  const xOffset = n * 8
  const yOffset = n * 4
  const direction = props.entry.side === 'left' ? -1 : 1
  return {
    zIndex: -n,
    transform: `translateY(${yOffset}px) translateX(${xOffset * direction}px)`,
  }
}

/* ── Dot offset & connectors ── */
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
/* ═══════════════════════════════════════════════
   NODE — entrada con reveal + fade-up
   ═══════════════════════════════════════════════ */

.timeline-node {
  z-index: 10;
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.6s cubic-bezier(0.22, 1, 0.36, 1),
    filter 0.35s ease;
}

.timeline-node.is-visible {
  opacity: 1;
  transform: translateY(0);
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

/* ═══════════════════════════════════════════════
   DOT — anillo expansivo al aparecer
   ═══════════════════════════════════════════════ */

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

.timeline-node.is-visible .node-dot {
  animation: dot-ring-pulse 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes dot-ring-pulse {
  0% {
    box-shadow:
      0 0 0 0 hsla(3, 86%, 64%, 0.5),
      0 0 0 0 hsla(3, 86%, 64%, 0.15);
    transform: translate(-50%, -50%) scale(0.3);
  }
  40% {
    transform: translate(-50%, -50%) scale(1.3);
  }
  100% {
    box-shadow:
      0 0 0 12px hsla(3, 86%, 64%, 0),
      0 0 0 24px hsla(3, 86%, 64%, 0);
    transform: translate(-50%, -50%) scale(1);
  }
}

.dot-left {
  left: 100%;
}

.dot-right {
  left: 0;
}

/* ═══════════════════════════════════════════════
   CONECTORES
   ═══════════════════════════════════════════════ */

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

/* ═══════════════════════════════════════════════
   CARD — "Radial Unfold": swing desde el centro
   ═══════════════════════════════════════════════ */

.card-stack-wrapper {
  position: relative;
}

.node-card {
  position: relative;
  z-index: 10;
  /* Entrada: swing desde centro con rotación */
  transform-origin: var(--swing-origin, center);
  transition:
    transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.35s ease,
    opacity 0.5s ease;
}

/* Left card: swing desde la derecha (desde la línea central) */
.card-left {
  --swing-x: -40px;
  --swing-r: 3.5deg;
  --swing-origin: right center;
}

/* Right card: swing desde la izquierda */
.card-right {
  --swing-x: 40px;
  --swing-r: -3.5deg;
  --swing-origin: left center;
}

/* Estado oculto: desplazado + rotado (como plegado hacia el centro) */
.timeline-node:not(.is-visible) .node-card {
  transform: translateX(var(--swing-x)) rotate(var(--swing-r));
  opacity: 0;
  transition: none;
}

/* Visible: posición final */
.timeline-node.is-visible .node-card {
  transform: translateX(0) rotate(0deg);
  opacity: 1;
  animation: card-unfold 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes card-unfold {
  0% {
    transform: translateX(var(--swing-x)) rotate(var(--swing-r));
    opacity: 0;
  }
  60% {
    /* Micro-rebote para sensación orgánica */
    transform: translateX(calc(var(--swing-x) * -0.08)) rotate(calc(var(--swing-r) * -0.3));
    opacity: 1;
  }
  100% {
    transform: translateX(0) rotate(0deg);
    opacity: 1;
  }
}

/* Hover de la card (solo cuando ya es visible) */
.timeline-node.is-visible.is-hovered .node-card {
  transform: scale(1.03);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* Flechita decorativa */
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

/* ═══════════════════════════════════════════════
   GHOSTS — fade-in en cascada + hover wave
   ═══════════════════════════════════════════════ */

.card-stack-ghost {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  scale: 1;
  border-color: transparent;
  transition:
    opacity 0.45s ease,
    scale 0.45s ease,
    filter 0.45s ease,
    box-shadow 0.45s ease,
    border-color 0.45s ease;
  transition-delay: 0ms;
}

/* ── Opacidad target (cuando son visibles) ── */
.timeline-node.is-visible .card-stack-ghost {
  opacity: 0.6;
}

.timeline-node.is-visible .card-stack-ghost:nth-child(2) {
  opacity: 0.38;
}

.timeline-node.is-visible .card-stack-ghost:nth-child(3) {
  opacity: 0.18;
}

/* ── Cascade de entrada (delays escalonados) ── */
.timeline-node.is-visible .card-stack-ghost:nth-child(1) {
  transition-delay: 90ms;
}

.timeline-node.is-visible .card-stack-ghost:nth-child(2) {
  transition-delay: 180ms;
}

.timeline-node.is-visible .card-stack-ghost:nth-child(3) {
  transition-delay: 280ms;
}

/* ── Hover wave: ghosts se enfocan en cascada ── */
.timeline-node.is-hovered .card-stack-ghost {
  scale: 1.03;
  filter: brightness(1.2);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.2);
  border-color: hsl(3, 86%, 64%, 0.35);
  transition-delay: 0ms;
}

.timeline-node.is-hovered .card-stack-ghost:nth-child(1) {
  transition-delay: 30ms;
}

.timeline-node.is-hovered .card-stack-ghost:nth-child(2) {
  transition-delay: 110ms;
}

.timeline-node.is-hovered .card-stack-ghost:nth-child(3) {
  transition-delay: 200ms;
  opacity: 0.5;
}

/* nth-child hover override */
.timeline-node.is-hovered .card-stack-ghost:nth-child(1) {
  opacity: 0.9;
}

.timeline-node.is-hovered .card-stack-ghost:nth-child(2) {
  opacity: 0.72;
}

/* Ghosts peek away from the timeline center line */
.card-stack-wrapper .ghost-peek-right {
  /* Card is on LEFT → ghost peeks RIGHT */
}

.card-stack-wrapper .ghost-peek-left {
  /* Card is on RIGHT → ghost peeks LEFT */
}

/* ═══════════════════════════════════════════════
   prefers-reduced-motion — respeta accesibilidad
   ═══════════════════════════════════════════════ */

@media (prefers-reduced-motion: reduce) {
  .timeline-node {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .timeline-node .node-card {
    opacity: 1;
    transform: none !important;
    animation: none !important;
    transition: none;
  }

  .card-stack-ghost {
    opacity: 0.6 !important;
    transition: none;
  }

  .card-stack-ghost:nth-child(2) {
    opacity: 0.38 !important;
  }

  .card-stack-ghost:nth-child(3) {
    opacity: 0.18 !important;
  }

  .timeline-node .node-dot {
    animation: none !important;
  }
}
</style>
