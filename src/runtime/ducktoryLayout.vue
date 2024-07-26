<script lang="ts" setup>
import { useDucktory } from '#imports'

const { stories, getName } = useDucktory()
</script>

<template>
  <div class="ducktory-flex ducktory-min-h-screen ducktory-font-main">
    <aside
      class="ducktory-w-1/3 ducktory-max-w-80 ducktory-bg-gray-200 ducktory-border-r-2 ducktory-border-r-gray-400 ducktory-flex ducktory-flex-col"
    >
      <header class="ducktory-py-4 ducktory-mx-4 ducktory-border-b ducktory-border-b-gray-300">
        <div class="ducktory-flex ducktory-items-center ducktory-gap-3">
          <NuxtLink
            :to="{ name: 'ducktory' }"
            class="ducktory-text-2xl ducktory-font-bold ducktory-text-amber-700"
          >
            Ducktory
          </NuxtLink>
          <span class="ducktory-text-sm ducktory-font-light ducktory-text-gray-800">v0.1.0</span>
        </div>

        <div class="ducktory-flex ducktory-items-center ducktory-text-gray-600 ducktory-gap-2 ducktory-mt-1">
          <svg
            color="#000"
            fill="none"
            height="18"
            stroke-width="1.5"
            viewBox="0 0 24 24"
            width="18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 19.5V5a2 2 0 0 1 2-2h11.4a.6.6 0 0 1 .6.6V21M9 7h6M6.5 15H19M6.5 18H19M6.5 21H19"
              stroke="#000"
              stroke-linecap="round"
            />
            <path
              d="M6.5 18c-1 0-1.5-.672-1.5-1.5S5.5 15 6.5 15M6.5 21c-1 0-1.5-.672-1.5-1.5S5.5 18 6.5 18"
              stroke="#000"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span class="ducktory-text-sm">Found {{ Object.keys(stories).length }} stories</span>
        </div>
      </header>

      <section class="ducktory-mt-2">
        <NuxtLink
          v-for="story in stories"
          :key="'story_nav_' + story.componentName"
          :to="{ name: 'ducktory-story', params: { story: story.originalComponentName } }"
          active-class="ducktory-bg-gray-300"
          class="ducktory-px-4 ducktory-py-3 hover:ducktory-bg-gray-300 ducktory-block"
        >
          {{ getName(story) }}
        </NuxtLink>
      </section>

      <footer class="ducktory-mt-auto ducktory-text-gray-400 ducktory-text-xs ducktory-p-2 ducktory-text-center">
        Made with ❤️ by <a
          class="ducktory-text-gray-600"
          href="https://github.com/jkniest"
          target="_blank"
        >jkniest</a>
      </footer>
    </aside>
    <main
      class="ducktory-bg-gray-100 ducktory-flex-1 ducktory-p-8"
      style="max-width: calc(100vw - 20rem)"
    >
      <NuxtPage />
    </main>
  </div>
</template>
