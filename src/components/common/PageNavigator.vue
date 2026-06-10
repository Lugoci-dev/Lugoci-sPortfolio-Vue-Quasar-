<template>
  <div v-if="isMobile" class="page-nav w-full">
    <q-separator class="mb-6" color="accent" spaced />

    <div class="flex items-stretch gap-3 md:gap-4">
      <!-- Botón Previous -->
      <router-link
        v-if="prev"
        :to="prev.path"
        class="nav-btn nav-btn-prev flex-1 flex items-center gap-2 md:gap-3 px-4 md:px-5 py-3 rounded-xl border card-border card-bg transition-all duration-200 cursor-pointer no-underline hover:border-accent/40 hover:shadow-sm group"
      >
        <svg
          class="w-5 h-5 md:w-6 md:h-6 shrink-0 text-accent transition-transform duration-200 group-hover:-translate-x-0.5"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M19 12H5m7-7l-7 7 7 7"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <div class="flex flex-col min-w-0">
          <span
            class="text-[10px] md:text-xs font-medium text-adaptive-mid uppercase tracking-wider"
            >{{ $t('nav.prev') }}</span
          >
          <span class="text-xs md:text-sm font-bold text-adaptive-dark truncate">{{
            prev.name
          }}</span>
        </div>
      </router-link>

      <!-- Spacer cuando solo hay un lado -->
      <div v-if="!prev && next" class="flex-1" />

      <!-- Botón Next -->
      <router-link
        v-if="next"
        :to="next.path"
        class="nav-btn nav-btn-next flex-1 flex items-center gap-2 md:gap-3 px-4 md:px-5 py-3 rounded-xl border card-border card-bg transition-all duration-200 cursor-pointer no-underline hover:border-accent/40 hover:shadow-sm group"
        :class="{ 'flex-row-reverse text-right': !prev }"
      >
        <div class="flex flex-col min-w-0" :class="{ 'items-end': !prev }">
          <span
            class="text-[10px] md:text-xs font-medium text-adaptive-mid uppercase tracking-wider"
            >{{ $t('nav.next') }}</span
          >
          <span class="text-xs md:text-sm font-bold text-adaptive-dark truncate">{{
            next.name
          }}</span>
        </div>
        <svg
          class="w-5 h-5 md:w-6 md:h-6 shrink-0 text-accent transition-transform duration-200 group-hover:translate-x-0.5"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M5 12h14m-7-7l7 7-7 7"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </router-link>

      <!-- Spacer cuando solo hay un lado -->
      <div v-if="prev && !next" class="flex-1" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const isMobile = computed(() => $q.screen.lt.md)

defineProps({
  prev: {
    type: Object,
    default: null,
    validator: (v) => v === null || (v.name && v.path),
  },
  next: {
    type: Object,
    default: null,
    validator: (v) => v === null || (v.name && v.path),
  },
})
</script>

<style scoped>
.page-nav {
  max-width: 100%;
}

.nav-btn {
  min-height: 56px;
  text-decoration: none;
}

@media (max-width: 767px) {
  .nav-btn {
    min-height: 52px;
  }
}
</style>
