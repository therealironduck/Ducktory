<script lang="ts" setup>
import DucktoryQuickButton from '../../src/runtime/components/DucktoryQuickButton.vue'

defineStory({
  name: 'Quick Button',
  documentation: 'A square button used for quick actions on the dashboard. Can render as a link when `href` is provided, or as a button otherwise.',
})
</script>

<template>
  <div class="ducktory:flex ducktory:gap-4">
    <DucktoryQuickButton
      href="https://example.com"
      label="With Link"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="ducktory:w-12 ducktory:h-12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    </DucktoryQuickButton>

    <DucktoryQuickButton label="As Button">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="ducktory:w-12 ducktory:h-12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle
          cx="11"
          cy="11"
          r="8"
        />
        <path d="m21 21-4.3-4.3" />
      </svg>
    </DucktoryQuickButton>
  </div>
</template>
