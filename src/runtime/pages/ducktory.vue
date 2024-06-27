<script setup lang="ts">
import { stories } from '#build/ducktory-stories.mjs'
</script>

<template>
  <component
    :is="story"
    v-for="story in stories"
    :key="story"
  />
</template>
