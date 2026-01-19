<script lang="ts" setup>
import { useDucktory } from '#imports'

defineEmits<{
  toggleMenu: []
}>()

const { version, getPath } = useDucktory()
</script>

<template>
  <header class="ducktory:bg-secondary ducktory:px-4 ducktory:py-3 ducktory:flex ducktory:items-center ducktory:gap-2">
    <button
      type="button"
      class="ducktory:text-primary ducktory:p-2"
      aria-label="Open menu"
      @click="$emit('toggleMenu')"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="ducktory:w-6 ducktory:h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>
    </button>
    <div class="ducktory:-space-y-2">
      <NuxtLink
        :to="getPath('ducktory')"
        class="ducktory:text-xl ducktory:font-bold ducktory:text-primary"
      >
        Ducktory
      </NuxtLink>
      <span class="ducktory:text-xs ducktory:font-light ducktory:text-gray ducktory:block">Version {{ version }}</span>
    </div>
  </header>
</template>
