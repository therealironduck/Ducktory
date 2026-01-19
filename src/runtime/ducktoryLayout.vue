<script lang="ts" setup>
import { ref } from 'vue'
import { useDucktory } from '#imports'

const { stories, getName, getPath, version } = useDucktory()

const mobileMenuOpen = ref(false)

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}
</script>

<template>
  <div
    id="ducktory"
    class="ducktory:flex ducktory:flex-col ducktory:lg:flex-row ducktory:min-h-screen ducktory:font-normal ducktory:text-black"
  >
    <!-- Mobile Header -->
    <DucktoryMobileHeader
      class="ducktory:lg:hidden"
      @toggle-menu="toggleMobileMenu"
    />

    <!-- Mobile Menu -->
    <DucktoryMobileMenu
      :open="mobileMenuOpen"
      @close="closeMobileMenu"
    />

    <!-- Desktop Sidebar -->
    <aside
      class="ducktory:hidden ducktory:lg:flex ducktory:w-1/3 ducktory:max-w-72 ducktory:bg-secondary ducktory:flex-col"
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
          active-class="ducktory:text-primary"
          class="ducktory:px-4 ducktory:py-3 ducktory:flex ducktory:items-center ducktory:gap-2 ducktory:hover:text-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
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
      class="ducktory:bg-gray ducktory:flex-1 ducktory:p-8"
    >
      <NuxtPage />
    </main>
  </div>
</template>
