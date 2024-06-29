<script setup lang="ts">
const { stories } = useDucktory()

const { params } = useRoute()

const story = computed(() => {
  return stories[params.story]
})
</script>

<template>
  <component
    :is="story.componentName"
    v-if="story"
  />
  <div v-else>
    Story not found
  </div>
</template>
