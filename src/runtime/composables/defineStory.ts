import type { StoryMeta } from '../../types/StoryMeta'

export function defineStory(_meta: StoryMeta): void {
  if (import.meta.dev) {
    console.warn(
      'defineStory() is a compiler-hint helper that is only usable inside '
      + 'the script block of a single file component. Its arguments should be '
      + 'compiled away and passing it at runtime has no effect.',
    )
  }
}
