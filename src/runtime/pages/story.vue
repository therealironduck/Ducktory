<script setup lang="ts">
const { stories, getName } = useDucktory()

const { params } = useRoute()

const story = computed(() => stories[params.story])
const title = computed(() => getName(story.value))
</script>

<template>
  <h1
    class="ducktory-text-2xl ducktory-font-semibold"
    v-text="title"
  />

  <component
    :is="story.componentName"
    v-if="story"
  />
  <div v-else>
    Story not found
  </div>
</template>
