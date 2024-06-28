<script setup lang="ts">
const { stories, getName } = useDucktory()
</script>

<template>
  <div class="ducktory-flex ducktory-min-h-screen">
    <aside class="ducktory-w-1/3 ducktory-max-w-80 ducktory-bg-gray-200 ducktory-border-r-2 ducktory-border-r-gray-400">
      <header class="ducktory-flex ducktory-items-center ducktory-p-4 ducktory-gap-3 ducktory-leading-none">
        <h1 class="ducktory-text-xl ducktory-font-bold ducktory-text-amber-700">
          Ducktory
        </h1>
        <span class="ducktory-text-sm ducktory-text-gray-800">v0.1.0</span>
      </header>

      <section>
        <a
          v-for="story in stories"
          :key="'story_nav_' + story.id"
          class="ducktory-px-4 ducktory-py-3 hover:ducktory-bg-gray-300 ducktory-block"
          href="#"
          v-text="getName(story)"
        />
      </section>
    </aside>
    <main class="ducktory-bg-gray-100 ducktory-flex-1 ducktory-p-8">
      <NuxtPage />
    </main>
  </div>
</template>
