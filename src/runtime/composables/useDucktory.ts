import type { StoryDefinition } from '../../types/StoryDefinition'
import { stories as raw } from '#build/ducktory-stories.mjs'
import { useNuxtApp } from '#app'

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

  return {
    stories,
    getName,
    getPath,
  }
}

function splitPascalCase(word: string): string {
  return word.replace(/([A-Z])/g, ' $1').trim()
}
