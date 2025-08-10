<script lang="ts" setup>
import { useDucktory } from '#imports'

const { stories, getName, getPath, version } = useDucktory()
</script>

<template>
  <div
    id="ducktory"
    class="ducktory:flex ducktory:min-h-screen ducktory:font-normal ducktory:text-black"
  >
    <aside
      class="ducktory:w-1/3 ducktory:max-w-72 ducktory:bg-secondary ducktory:flex ducktory:flex-col"
    >
      <header class="ducktory:py-4 ducktory:px-8 ducktory:border-b ducktory:border-b-primary ducktory:text-center ducktory:-space-y-2">
        <NuxtLink
          :to="getPath('ducktory')"
          class="ducktory:text-2xl ducktory:font-bold ducktory:text-primary block"
        >
          Ducktory
        </NuxtLink>
        <span class="ducktory:text-xs ducktory:font-light ducktory:text-gray">Version {{ version }}</span>
      </header>

      <section class="ducktory:mt-2">
        <NuxtLink
          v-for="story in stories"
          :key="'story_nav_' + story.componentName"
          :to="getPath('ducktory-story', { story: story.originalComponentName })"
          active-class="ducktory:bg-gray-300"
          class="ducktory:px-4 ducktory:py-3 ducktory:hover:bg-gray-300 ducktory:block"
        >
          {{ getName(story) }}
        </NuxtLink>
      </section>

      <footer class="ducktory:mt-auto ducktory:text-gray-400 ducktory:text-xs ducktory:p-2 ducktory:text-center">
        Made with ❤️ by <a
          class="ducktory:text-gray-600"
          href="https://github.com/jkniest"
          target="_blank"
        >jkniest</a>
      </footer>
    </aside>
    <main
      class="ducktory:bg-gray-100 ducktory:flex-1 ducktory:p-8"
      style="max-width: calc(100vw - 20rem)"
    >
      <NuxtPage />
    </main>
  </div>
</template>
