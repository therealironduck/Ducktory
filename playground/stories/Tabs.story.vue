<script lang="ts" setup>
import DucktoryTabContainer from '../../src/runtime/components/DucktoryTabContainer.vue'

defineStory({
  name: 'Tabs',
})
</script>

<template>
  <DucktoryTabContainer
    class="ducktory-bg-gray-300 ducktory-p-4"
    content-classes="ducktory-text-amber-700"
    default="example1"
    tab-classes="ducktory-flex ducktory-mt-4 ducktory-bg-white ducktory-gap-2"
  >
    <template #tab-example1>
      The first tab
    </template>
    <template #tab-example2>
      The second tab
    </template>
    <template #tab-example3>
      The third tab
    </template>
    <template #tabs="{ select, active }">
      <button
        :class="{ 'ducktory-bg-gray-200': active === 'example1' }"
        class="ducktory-p-2"
        @click="select('example1')"
      >
        Tab 1
      </button>
      <button
        :class="{ 'ducktory-bg-gray-200': active === 'example2' }"
        class="ducktory-p-2"
        @click="select('example2')"
      >
        Tab 2
      </button>
      <button
        :class="{ 'ducktory-bg-gray-200': active === 'example3' }"
        class="ducktory-p-2"
        @click="select('example3')"
      >
        Tab 3
      </button>
    </template>
  </DucktoryTabContainer>
</template>
