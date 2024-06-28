<script setup lang="ts">
const { stories, getName } = useDucktory()
</script>

<template>
  <div class="ducktory-flex ducktory-min-h-screen">
    <aside class="ducktory-w-1/3 ducktory-max-w-80 ducktory-bg-gray-200 ducktory-border-r-2 ducktory-border-r-gray-400 ducktory-flex ducktory-flex-col">
      <header class="ducktory-py-4 ducktory-mx-4 ducktory-border-b ducktory-border-b-gray-300">
        <div class="ducktory-flex ducktory-items-center ducktory-gap-3 ducktory-leading-none">
          <h1 class="ducktory-text-xl ducktory-font-bold ducktory-text-amber-700">
            Ducktory
          </h1>
          <span class="ducktory-text-sm ducktory-text-gray-800">v0.1.0</span>
        </div>

        <div class="ducktory-flex ducktory-items-center ducktory-text-gray-600 ducktory-gap-2 ducktory-mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke-width="1.5" color="#000"
            viewBox="0 0 24 24">
            <path stroke="#000" stroke-linecap="round"
              d="M5 19.5V5a2 2 0 0 1 2-2h11.4a.6.6 0 0 1 .6.6V21M9 7h6M6.5 15H19M6.5 18H19M6.5 21H19" />
            <path stroke="#000" stroke-linecap="round" stroke-linejoin="round"
              d="M6.5 18c-1 0-1.5-.672-1.5-1.5S5.5 15 6.5 15M6.5 21c-1 0-1.5-.672-1.5-1.5S5.5 18 6.5 18" />
          </svg>
          <span class="ducktory-text-xs">Found {{ stories.length }} stories</span>
        </div>
      </header>

      <section class="ducktory-mt-2">
        <a v-for="story in stories" :key="'story_nav_' + story.id"
          class="ducktory-px-4 ducktory-py-3 hover:ducktory-bg-gray-300 ducktory-block" href="#"
          v-text="getName(story)" />
      </section>

      <footer class="ducktory-mt-auto ducktory-text-gray-400 ducktory-text-xs ducktory-p-2 ducktory-text-center">
        Made with ❤️ by <a class="ducktory-text-gray-600" href="https://github.com/jkniest" target="_blank">jkniest</a>
      </footer>
    </aside>
    <main class="ducktory-bg-gray-100 ducktory-flex-1 ducktory-p-8">
      <NuxtPage />
    </main>
  </div>
</template>
