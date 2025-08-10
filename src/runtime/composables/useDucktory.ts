import type { StoryDefinition } from '../../types/StoryDefinition'
import { stories as raw } from '#build/ducktory-stories.mjs'
import { ducktoryVersion } from '#build/ducktory-version.mjs'
import { useNuxtApp } from '#app'
import { computed } from '#imports'

export function useDucktory() {
  const app = useNuxtApp()
  const stories = raw as { [k: string]: StoryDefinition }

  const getName = (story: StoryDefinition): string => {
    return story.meta?.name || splitPascalCase(story.originalComponentName)
  }

  const getPath = (routeName: string, params: Record<string, string> = {}) => {
    const routeDefinition = { name: routeName, params }

    if (typeof app.$localePath === 'function') {
      return app.$localePath(routeDefinition)
    }

    return routeDefinition
  }

  const v = computed(() => {
    return ducktoryVersion
  })

  return {
    stories,
    getName,
    getPath,
    version: v,
  }
}

function splitPascalCase(word: string): string {
  return word.replace(/([A-Z])/g, ' $1').trim()
}
