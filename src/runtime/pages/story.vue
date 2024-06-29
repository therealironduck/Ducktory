<script setup lang="ts">
import DucktoryActionBtn from '../components/DucktoryActionBtn'

const { stories, getName } = useDucktory()

const { params } = useRoute()

const story = computed(() => stories[params.story])
const title = computed(() => getName(story.value))
</script>

<template>
  <template v-if="story">
    <h1 class="ducktory-text-2xl ducktory-font-semibold" v-text="title" />

    <div class="ducktory-bg-white ducktory-mt-4 ducktory-shadow-md ducktory-rounded-t-xl ducktory-p-4">
      <component :is="story.componentName" />
      <br><br>
      <pre><code>
      {{ story.code }}
    </code></pre>
    </div>
    <div
      class="ducktory-bg-white ducktory-overflow-hidden ducktory-border-t ducktory-rounded-b-xl ducktory-border-t-gray-200 ducktory-flex ducktory-items-center">
      <DucktoryActionBtn :active="true">
        Preview
      </DucktoryActionBtn>
      <DucktoryActionBtn>Code</DucktoryActionBtn>
      <DucktoryActionBtn>Docs</DucktoryActionBtn>
      <div class="ducktory-ml-auto ducktory-text-sm ducktory-text-gray-600 ducktory-pr-4">
        {{ story.originalComponentName }}.story.vue
      </div>
    </div>
  </template>
  <div v-else>
    Story not found
  </div>
</template>
