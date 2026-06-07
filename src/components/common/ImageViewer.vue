<template>
  <Teleport to="body">
    <div
      class="image-viewer-overlay fixed inset-0 z-[9999] bg-black/85 flex items-center justify-center"
      @click="onBackdropClick"
      @wheel.prevent="onWheel"
      @keydown.escape="emit('close')"
      @keydown.left="prev"
      @keydown.right="next"
      tabindex="0"
      ref="overlayRef"
    >
      <!-- Close button -->
      <button
        class="absolute top-4 right-4 z-10 text-white/80 hover:text-white transition-colors cursor-pointer"
        @click="emit('close')"
      >
        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <!-- Counter -->
      <div class="absolute top-4 left-4 z-10 text-white/60 text-sm font-mono select-none">
        {{ currentIndex + 1 }} / {{ images.length }}
      </div>

      <!-- Prev button -->
      <button
        v-if="images.length > 1"
        class="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white/70 hover:text-white transition-all hover:scale-110 cursor-pointer p-2 rounded-full hover:bg-white/10"
        @click.stop="prev"
      >
        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <!-- Next button -->
      <button
        v-if="images.length > 1"
        class="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white/70 hover:text-white transition-all hover:scale-110 cursor-pointer p-2 rounded-full hover:bg-white/10"
        @click.stop="next"
      >
        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <!-- Zoom controls -->
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
        <button
          class="text-white/70 hover:text-white transition-colors p-1.5 rounded-md hover:bg-white/10 cursor-pointer"
          @click.stop="zoomOut"
          title="Zoom out"
        >
          <svg
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35M8 11h6" />
          </svg>
        </button>

        <span class="text-white/60 text-xs font-mono min-w-[3rem] text-center select-none">
          {{ Math.round(zoom * 100) }}%
        </span>

        <button
          class="text-white/70 hover:text-white transition-colors p-1.5 rounded-md hover:bg-white/10 cursor-pointer"
          @click.stop="zoomIn"
          title="Zoom in"
        >
          <svg
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
          </svg>
        </button>

        <button
          class="text-white/60 hover:text-white transition-colors p-1.5 rounded-md hover:bg-white/10 cursor-pointer text-xs ml-2"
          @click.stop="resetZoom"
          title="Reset zoom"
        >
          Reset
        </button>
      </div>

      <!-- Image container -->
      <div
        class="relative flex items-center justify-center w-full h-full p-16 select-none"
        ref="containerRef"
      >
        <img
          :src="images[currentIndex]"
          :key="currentIndex"
          class="max-w-full max-h-full object-contain transition-transform duration-200 ease-out"
          :style="{
            transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
            cursor: zoom > 1 ? 'grab' : 'zoom-in',
          }"
          @click.stop="onImageClick"
          @mousedown="startPan"
          @mousemove="pan"
          @mouseup="endPan"
          @mouseleave="endPan"
          draggable="false"
        />
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  images: { type: Array, required: true },
  initialIndex: { type: Number, default: 0 },
})

const emit = defineEmits(['close'])

const currentIndex = ref(props.initialIndex)
const zoom = ref(1)
const panX = ref(0)
const panY = ref(0)
const isPanning = ref(false)
const startX = ref(0)
const startY = ref(0)
const startPanX = ref(0)
const startPanY = ref(0)
const overlayRef = ref(null)

/* ── Focus overlay for keyboard events ── */
onMounted(() => {
  overlayRef.value?.focus()
})

/* ── Reset zoom/image when index changes ── */
watch(currentIndex, () => {
  zoom.value = 1
  panX.value = 0
  panY.value = 0
})

/* ── Navigation ── */
const ZOOM_STEP = 0.25
const MAX_ZOOM = 5
const MIN_ZOOM = 0.25

function next() {
  if (currentIndex.value < props.images.length - 1) currentIndex.value++
}

function prev() {
  if (currentIndex.value > 0) currentIndex.value--
}

function zoomIn() {
  zoom.value = Math.min(MAX_ZOOM, zoom.value + ZOOM_STEP)
}

function zoomOut() {
  zoom.value = Math.max(MIN_ZOOM, zoom.value - ZOOM_STEP)
}

function resetZoom() {
  zoom.value = 1
  panX.value = 0
  panY.value = 0
}

/* ── Mouse wheel zoom ── */
function onWheel(e) {
  if (e.deltaY < 0) zoomIn()
  else zoomOut()
}

/* ── Click to toggle zoom ── */
function onImageClick() {
  if (zoom.value > 1) {
    resetZoom()
  } else {
    zoom.value = 2
  }
}

/* ── Pan (drag when zoomed) ── */
function startPan(e) {
  if (zoom.value <= 1) return
  isPanning.value = true
  startX.value = e.clientX
  startY.value = e.clientY
  startPanX.value = panX.value
  startPanY.value = panY.value
}

function pan(e) {
  if (!isPanning.value) return
  const dx = e.clientX - startX.value
  const dy = e.clientY - startY.value
  panX.value = startPanX.value + dx
  panY.value = startPanY.value + dy
}

function endPan() {
  isPanning.value = false
}

/* ── Close on backdrop click (not on image) ── */
function onBackdropClick(e) {
  if (e.target === e.currentTarget) emit('close')
}

/* ── Keyboard navigation via global listener ── */
function onKeyDown(e) {
  if (e.key === 'Escape') emit('close')
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'ArrowRight') next()
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<style scoped>
.image-viewer-overlay {
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
