<script setup lang="ts">
withDefaults(defineProps<{ active?: boolean }>(), {
  active: false,
})
</script>

<template>
  <div
    class="ducktory:hover:bg-gray-200 ducktory:cursor-pointer ducktory:px-4 ducktory:py-2"
    :class="{ 'ducktory:bg-gray-200': active }"
  >
    <slot />
  </div>
</template>
