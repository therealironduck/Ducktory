<script lang="ts" setup>
import { codeToHtml } from 'shiki'
import { provide, computed, ref, watch } from 'vue'
import DucktoryActionBtn from '../components/DucktoryActionBtn.vue'
import DucktoryTabContainer from '../components/DucktoryTabContainer.vue'
import { useDucktory } from '../composables/useDucktory'
import { useHead, useRoute, useRouter } from '#app'
import type { StoryDefinition } from '~/src/types/StoryDefinition'
import type { CustomVNode } from '~/src/types/VNodeMagic'

const { stories, getName } = useDucktory()
const { params, query, path } = useRoute()
const { push } = useRouter()

const story = computed(() => stories[params.story as string] ?? null)
const title = computed(() => story.value ? getName(story.value) : '')
const pageTitle = computed(() => `Ducktory - ${title.value || 'Not Found'}`)
const componentDocumentation = ref<CustomVNode[] | undefined>(undefined)

provide('ducktory-documentation', componentDocumentation)

const defaultTab = computed(() => query.tab as string || 'preview')

const codeHighlight = ref('Loading...')
const justCopied = ref(false)

const hasDocumentation = computed(() => story.value?.meta?.documentation !== undefined || componentDocumentation.value?.length > 0)
const documentation = computed(() => story.value?.meta?.documentation ?? undefined)

useHead({
  title: pageTitle,
})

watch(story, async (newStory: StoryDefinition | null) => {
  if (!newStory) return

  codeHighlight.value = await codeToHtml(newStory.code + '\n', { lang: 'html', theme: 'catppuccin-latte' })
}, { immediate: true })

function copy() {
  navigator.clipboard.writeText(story.value.code)
  justCopied.value = true
  setTimeout(() => {
    justCopied.value = false
  }, 1500)
}

function selectTab(newTab: string) {
  push({ path, query: { tab: newTab } })
}
</script>

<template>
  <template v-if="story">
    <h1
      class="ducktory-text-2xl ducktory-font-semibold"
      v-text="title"
    />

    <DucktoryTabContainer
      :default="defaultTab"
      :tabs="['preview', 'code', 'docs']"
      class="ducktory-bg-white ducktory-mt-4 ducktory-overflow-hidden ducktory-shadow-md ducktory-rounded-xl ducktory-p4"
      content-classes="ducktory-p-4"
      tab-classes="ducktory-flex ducktory-border-t ducktory-border-t-gray-200"
      @select="selectTab"
    >
      <template #tab-preview>
        <component
          :is="story.componentName"
          ref="preview"
        />
      </template>
      <template #tab-code>
        <div
          class="ducktory-overflow-scroll ducktory-min-w-full ducktory-code-wrapper"
          v-html="codeHighlight"
        />
        <div class="ducktory-flex ducktory-justify-end ducktory-mt-2 ducktory-text-sm">
          <a
            class="ducktory-underline ducktory-text-amber-700"
            href="#"
            @click.prevent="copy"
            v-text="justCopied ? 'Copied!' : 'Copy'"
          />
        </div>
      </template>
      <template #tab-docs>
        <ClientOnly>
          <template v-if="componentDocumentation?.length > 0">
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
      </template>

      <template #tabs="{ select, active }">
        <DucktoryActionBtn
          :active="active === 'preview'"
          @click="select('preview')"
        >
          Preview
        </DucktoryActionBtn>
        <DucktoryActionBtn
          :active="active === 'code'"
          @click="select('code')"
        >
          Code
        </DucktoryActionBtn>
        <DucktoryActionBtn
          v-show="hasDocumentation"
          :active="active === 'docs'"
          @click="select('docs')"
        >
          Documentation
        </DucktoryActionBtn>
        <div
          class="ducktory-ml-auto ducktory-text-sm ducktory-flex ducktory-items-center ducktory-text-gray-600 ducktory-pr-4"
        >
          {{ story.originalComponentName }}.story.vue
        </div>
      </template>
    </DucktoryTabContainer>
  </template>
  <div v-else>
    Story not found
  </div>
</template>

<style>
.ducktory-code-wrapper > pre {
  min-width: fit-content;
  padding-top: 1rem;
  padding-bottom: 1rem;
  width: 100%;
}
</style>
