<script lang="ts" setup>
import { useDucktory } from '#imports'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { stories, getName, getPath } = useDucktory()

function handleNavigate() {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="ducktory-menu">
      <div
        v-if="open"
        class="ducktory:fixed ducktory:inset-0 ducktory:z-50 ducktory:flex"
      >
        <!-- Backdrop -->
        <div
          class="ducktory:absolute ducktory:inset-0 ducktory:bg-black/50"
          @click="$emit('close')"
        />

        <!-- Menu Panel -->
        <aside class="ducktory:relative ducktory:w-72 ducktory:max-w-[80vw] ducktory:bg-secondary ducktory:flex ducktory:flex-col ducktory:h-full">
          <!-- Header with close button -->
          <header class="ducktory:py-4 ducktory:px-4 ducktory:border-b ducktory:border-b-primary ducktory:flex ducktory:items-center ducktory:justify-between">
            <div class="ducktory:-space-y-2">
              <NuxtLink
                :to="getPath('ducktory')"
                class="ducktory:text-xl ducktory:font-bold ducktory:text-primary"
                @click="handleNavigate"
              >
                Ducktory
              </NuxtLink>
              <span class="ducktory:text-xs ducktory:font-light ducktory:text-gray ducktory:block">Menu</span>
            </div>
            <button
              type="button"
              class="ducktory:text-primary ducktory:p-2"
              aria-label="Close menu"
              @click="$emit('close')"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="ducktory:w-6 ducktory:h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </header>

          <!-- Story Navigation -->
          <section class="ducktory:mt-2 ducktory:flex-1 ducktory:overflow-y-auto">
            <NuxtLink
              v-for="story in stories"
              :key="'mobile_story_nav_' + story.componentName"
              :to="getPath('ducktory-story', { story: story.originalComponentName })"
              active-class="ducktory:text-primary"
              class="ducktory:px-4 ducktory:py-3 ducktory:flex ducktory:items-center ducktory:gap-2 ducktory:hover:text-primary"
              @click="handleNavigate"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="ducktory:w-6 ducktory:h-6"
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

          <!-- Footer -->
          <footer class="ducktory:text-gray-400 ducktory:text-xs ducktory:p-2 ducktory:text-center">
            Made with ❤️ by <a
              class="ducktory:text-gray-600"
              href="https://github.com/jkniest"
              target="_blank"
            >jkniest</a>
          </footer>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.ducktory-menu-enter-active,
.ducktory-menu-leave-active {
  transition: opacity 0.2s ease;
}

.ducktory-menu-enter-active aside,
.ducktory-menu-leave-active aside {
  transition: transform 0.2s ease;
}

.ducktory-menu-enter-from,
.ducktory-menu-leave-to {
  opacity: 0;
}

.ducktory-menu-enter-from aside,
.ducktory-menu-leave-to aside {
  transform: translateX(-100%);
}
</style>
