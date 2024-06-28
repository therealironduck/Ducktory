import type { StoryDefinition } from '../../types/StoryDefinition'
import { stories as raw } from '#build/ducktory-stories.mjs'

export function useDucktory() {
  const stories = raw as StoryDefinition[]

  const getName = (story: StoryDefinition): string => {
    return story.meta?.name || splitPascalCase(story.originalComponentName)
  }

  return {
    stories,
    getName,
  }
}

function splitPascalCase(word: string): string {
  return word.replace(/([A-Z])/g, ' $1').trim()
}
