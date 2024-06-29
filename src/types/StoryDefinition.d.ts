import type { StoryMeta } from './StoryMeta'

export type StoryDefinition = {
  id: number
  componentName: string
  originalComponentName: string
  meta?: StoryMeta | undefined
}
