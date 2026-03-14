<script lang="ts" setup>
import { computed } from '#imports'
import type { DucktoryIntegrationInfo } from '../../types/DucktoryIntegration'

const props = defineProps<{
  integration: DucktoryIntegrationInfo
}>()

const wrapperClasses = computed(() => [
  'ducktory:rounded-xl ducktory:py-2 ducktory:px-4 ducktory:flex ducktory:items-center ducktory:gap-2',
  {
    'ducktory:bg-success ducktory:text-white': props.integration.enabled,
    'ducktory:bg-secondary ducktory:text-gray': !props.integration.enabled,
  },
])

const label = computed(() => `${props.integration.name} ${props.integration.enabled ? 'enabled' : 'disabled'}`)
</script>

<template>
  <div :class="wrapperClasses">
    <svg
      v-if="props.integration.enabled"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      class="size-6"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      class="size-6"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
    <span class="">{{ label }}</span>
  </div>
</template>
