<script setup lang="ts">
const { stories } = useDucktory()
</script>

<template>
  <component
    :is="story.componentName"
    v-for="story in stories"
    :key="story.componentName"
  />
</template>
