<script lang="ts" setup>
import { codeToHtml } from 'shiki'
import { provide, computed, ref, watch } from 'vue'
import { useDucktory } from '../composables/useDucktory'
import { useHead, useRoute } from '#app'
import type { StoryDefinition } from '../../types/StoryDefinition'
import type { CustomVNode } from '../../types/VNodeMagic'

const { stories, getName } = useDucktory()
const { params } = useRoute()

const story = computed(() => stories[params.story as string] ?? null)
const title = computed(() => story.value ? getName(story.value) : '')
const pageTitle = computed(() => `Ducktory - ${title.value || 'Not Found'}`)
const componentDocumentation = ref<CustomVNode[] | undefined>(undefined)

provide('ducktory-documentation', componentDocumentation)

const codeHighlight = ref('Loading...')
const justCopied = ref(false)

const hasDocumentation = computed(() => story.value?.meta?.documentation !== undefined || (componentDocumentation.value?.length ?? 0) > 0)
const documentation = computed(() => story.value?.meta?.documentation ?? undefined)

useHead({
  title: pageTitle,
})

watch(story, async (newStory: StoryDefinition | null) => {
  if (!newStory) return

  codeHighlight.value = await codeToHtml(newStory.code + '\n', { lang: 'html', theme: 'catppuccin-latte' })
}, { immediate: true })

function copy() {
  if (!story.value) return

  navigator.clipboard.writeText(story.value.code)
  justCopied.value = true
  setTimeout(() => {
    justCopied.value = false
  }, 1500)
}
</script>

<template>
  <template v-if="story">
    <h1
      class="ducktory:text-center ducktory:text-secondary ducktory:text-xl ducktory:font-semibold ducktory:mt-6"
      v-text="title"
    />

    <section
      v-if="hasDocumentation"
      class="ducktory:text-center ducktory:text-secondary ducktory:mt-3"
    >
      <ClientOnly>
        <template v-if="(componentDocumentation?.length ?? 0) > 0">
          <component
            :is="(node)"
            v-for="(node, idx) in componentDocumentation"
            :key="idx"
          />
        </template>
        <div
          v-else
          v-html="documentation"
        />
      </ClientOnly>
    </section>

    <section class="ducktory:text-secondary ducktory:bg-white ducktory:rounded-2xl ducktory:mt-6 ducktory:p-6">
      <h2 class="ducktory:text-xl ducktory:text-center ducktory:mb-4">
        Preview
      </h2>

      <component
        :is="story.componentName"
        ref="preview"
      />
    </section>

    <section class="ducktory:text-secondary ducktory:bg-white ducktory:rounded-2xl ducktory:p-6 mt-6">
      <div class="ducktory:mb-4 ducktory:text-center">
        <h2 class="ducktory:text-xl">
          Source Code
        </h2>
        <span class="ducktory:text-sm">{{ story.originalComponentName }}.story.vue</span>
      </div>

      <div
        class="ducktory:overflow-scroll ducktory:min-w-full ducktory-code-wrapper"
        v-html="codeHighlight"
      />
      <div class="ducktory:flex ducktory:justify-end ducktory:mt-2 ducktory:text-sm">
        <a
          class="ducktory:underline ducktory:text-amber-700"
          href="#"
          @click.prevent="copy"
          v-text="justCopied ? 'Copied!' : 'Copy'"
        />
      </div>
    </section>
  </template>
  <div v-else>
    Story not found
  </div>
</template>

<style>
.ducktory-code-wrapper>pre {
  min-width: fit-content;
  padding-top: 1rem;
  padding-bottom: 1rem;
  width: 100%;
}
</style>
