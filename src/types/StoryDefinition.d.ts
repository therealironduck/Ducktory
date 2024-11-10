import type { StoryMeta } from './StoryMeta'

export type StoryDefinition = {
  componentName: string
  originalComponentName: string
  meta?: StoryMeta | undefined
  code: string
}
