<script lang="ts" setup>
import { useDucktory } from '../composables/useDucktory'
import DucktoryIntegrationBadge from '../components/DucktoryIntegrationBadge.vue'
import type { DucktoryIntegration } from '../../types/DucktoryIntegration'
import { ref } from '#imports'

const { storyCount } = useDucktory()

const integrations = ref<DucktoryIntegration[]>([{
  name: 'Nuxt i18n',
  enabled: true,
}, {
  name: 'Tailwind',
  enabled: false,
}])
</script>

<template>
  <div class="ducktory:h-full ducktory:w-full ducktory:grid ducktory:place-items-center ducktory:content-center">
    <div class="ducktory:container">
      <h1 class="ducktory:text-2xl ducktory:text-secondary ducktory:font-bold ducktory:text-center">
        Found {{ storyCount }} stories
      </h1>
      <p class="ducktory:text-sm ducktory:text-secondary ducktory:text-center">
        Some birds avoid water, the duck searches for it.
      </p>

      <div class="ducktory:flex ducktory:gap-4 ducktory:mt-8">
        <div class="ducktory:bg-white ducktory:rounded-2xl ducktory:shadow-lg ducktory:py-6 ducktory:px-4 ducktory:w-1/3">
          <h2 class="ducktory:text-lg ducktory:text-secondary ducktory:text-center">
            Integrations
          </h2>

          <ul class="ducktory:flex ducktory:flex-col ducktory:gap-2 ducktory:mt-2">
            <li
              v-for="integration in integrations"
              :key="integration.name"
            >
              <DucktoryIntegrationBadge :integration="integration" />
            </li>
          </ul>
        </div>
        <div class="ducktory:bg-white ducktory:rounded-2xl ducktory:shadow-lg ducktory:py-6 ducktory:px-4 ducktory:w-2/3">
          <h2 class="ducktory:text-lg ducktory:text-secondary ducktory:text-center">
            Quick Links
          </h2>
        </div>
      </div>
    </div>
  </div>
</template>
