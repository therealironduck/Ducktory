<script lang="ts" setup>
import { useDucktory } from '../composables/useDucktory'
import DucktoryIntegrationBadge from '../components/DucktoryIntegrationBadge.vue'
import DucktoryQuickButton from '../components/DucktoryQuickButton.vue'
import { computed } from 'vue'

const { storyCount, integrations } = useDucktory()

const title = computed(() => {
  return storyCount.value === 0 ? 'No stories found' : `Found ${storyCount.value} stories`
})

const subtitle = computed(() => {
  return storyCount.value === 0 ? 'Let\'s get started!' : 'Some birds avoid water, the duck searches for it.'
})
</script>

<template>
  <div class="ducktory:h-full ducktory:w-full ducktory:grid ducktory:place-items-center ducktory:content-center">
    <div class="ducktory:max-w-6xl">
      <h1
        class="ducktory:text-2xl ducktory:text-secondary ducktory:font-bold ducktory:text-center"
        v-text="title"
      />
      <p
        class="ducktory:text-sm ducktory:text-secondary ducktory:text-center"
        v-text="subtitle"
      />

      <div class="ducktory:flex ducktory:flex-col ducktory:xl:flex-row-reverse ducktory:gap-4 ducktory:mt-8">
        <!-- Quick Links (first on mobile, right side on desktop) -->
        <div
          class="ducktory:bg-white ducktory:rounded-2xl ducktory:shadow-lg ducktory:py-6 ducktory:px-4 ducktory:w-full ducktory:xl:w-2/3"
        >
          <h2 class="ducktory:text-lg ducktory:text-secondary ducktory:text-center">
            Quick Links
          </h2>

          <div class="ducktory:flex ducktory:justify-center ducktory:gap-4 ducktory:mt-4">
            <DucktoryQuickButton
              href="https://github.com/therealironduck/ducktory/releases"
              label="Changelog"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="ducktory:w-12 ducktory:h-12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21 12a9 9 0 1 1-9-9" />
                <path d="M12 3v4" />
                <path d="m16 8 2-2 2 2" />
                <path d="M18 6v4" />
                <path d="M12 12v4" />
                <path d="m8 16-2 2-2-2" />
                <path d="M6 18v-4" />
              </svg>
            </DucktoryQuickButton>

            <DucktoryQuickButton
              href="https://github.com/therealironduck/ducktory#readme"
              label="Documentation"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="ducktory:w-12 ducktory:h-12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a2.5 2.5 0 0 1 0-5H20" />
                <path d="M8 7h6" />
                <path d="M8 11h8" />
              </svg>
            </DucktoryQuickButton>

            <DucktoryQuickButton label="Search story">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="ducktory:w-12 ducktory:h-12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="8"
                />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </DucktoryQuickButton>
          </div>
        </div>

        <!-- Integrations (second on mobile, left side on desktop) -->
        <div
          class="ducktory:bg-white ducktory:rounded-2xl ducktory:shadow-lg ducktory:py-6 ducktory:px-4 ducktory:w-full ducktory:xl:w-1/3"
        >
          <h2 class="ducktory:text-lg ducktory:text-secondary ducktory:text-center">
            Integrations
          </h2>

          <div class="ducktory:bg-primary ducktory:text-secondary ducktory:rounded-2xl ducktory:my-2 ducktory:p-3">
            <strong>Note:</strong> The integration feature is currently still Work In Progress and does not work yet!
          </div>

          <ul class="ducktory:flex ducktory:flex-col ducktory:gap-2 ducktory:mt-2">
            <li
              v-for="integration in integrations"
              :key="integration.name"
            >
              <DucktoryIntegrationBadge :integration="integration" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
