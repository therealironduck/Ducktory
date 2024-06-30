<script setup lang="ts">
import DucktoryActionBtn from '../components/DucktoryActionBtn'
import DucktoryTabContainer from '../components/DucktoryTabContainer'
import { codeToHtml } from 'shiki'
import { stories as raw } from '#build/ducktory-stories.mjs'

const { stories, getName } = useDucktory()

const { params } = useRoute()

const story = computed(() => stories[params.story] ?? null)
const title = computed(() => story.value ? getName(story.value) : '')

const codeHighlight = ref('Loading...');
const justCopied = ref(false);

watch(story, async (newStory) => {
  if (!newStory) return
  codeHighlight.value = await codeToHtml(newStory.code + "\n", { lang: 'html', theme: 'catppuccin-latte' })
}, { immediate: true });

function copy() {
  navigator.clipboard.writeText(story.value.code);
  justCopied.value = true;
  setTimeout(() => {
    justCopied.value = false;
  }, 1500);
}
</script>

<template>
  <template v-if="story !== undefined">
    <h1 class="ducktory-text-2xl ducktory-font-semibold" v-text="title" />
    {{ raw }}

    <DucktoryTabContainer
      class="ducktory-bg-white ducktory-mt-4 ducktory-overflow-hidden ducktory-shadow-md ducktory-rounded-xl ducktory-p4"
      content-classes="ducktory-p-4" tab-classes="ducktory-flex ducktory-border-t ducktory-border-t-gray-200"
      default="preview">
      <template #tab-preview>
        <component :is="story.componentName" />
      </template>
      <template #tab-code>
        <div class="ducktory-overflow-scroll ducktory-min-w-full ducktory-code-wrapper" v-html="codeHighlight"></div>
        <div class="ducktory-flex ducktory-justify-end ducktory-mt-2 ducktory-text-sm">
          <a href="#" @click.prevent="copy" class="ducktory-underline ducktory-text-amber-700" v-text="justCopied ? 'Copied!' : 'Copy'" />
        </div>
      </template>
      <template #tab-docs>docs</template>

      <template #tabs="{ select, active }">
        <DucktoryActionBtn :active="active === 'preview'" @click="select('preview')">Preview</DucktoryActionBtn>
        <DucktoryActionBtn :active="active === 'code'" @click="select('code')">Code</DucktoryActionBtn>
        <DucktoryActionBtn :active="active === 'docs'" @click="select('docs')">Docs</DucktoryActionBtn>
        <div class="ducktory-ml-auto ducktory-text-sm ducktory-text-gray-600 ducktory-pr-4">
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
    width: 100%;
  }
</style>