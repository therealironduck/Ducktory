<script lang="ts" setup>
import DucktoryTabContainer from '../../src/runtime/components/DucktoryTabContainer.vue'
import DucktoryActionBtn from '../../src/runtime/components/DucktoryActionBtn.vue'

defineStory({
  name: 'Tabs',
})
</script>

<template>
  <DucktoryDocumentation>
    <h1>This is a documentation for the tabs story.</h1>
    <p>This is a paragraph.</p>
    <hr>
    <p>As you can see, you can use html in the documentation.</p>
    <hr>
    <br>
    <p>And even use components and composables.</p>
    <hr>
    <DucktoryActionBtn>This is a button</DucktoryActionBtn>
  </DucktoryDocumentation>

  <DucktoryTabContainer
    class="ducktory-bg-gray-300 ducktory-p-4"
    :tabs="['example1', 'example2', 'example3']"
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
