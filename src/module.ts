import path from 'node:path'
import { defineNuxtModule, extendPages, createResolver, addLayout, addImportsDir } from '@nuxt/kit'
import { ducktoryLog } from './build/utils'
import { loadStories } from './build/stories'
import { extendBundler } from './build/bundler'

export interface DucktoryOptions {
  path: string
  enabled: boolean
  storyComponentPrefix: string
  debug: boolean
  storyDirectory: string
}

export default defineNuxtModule<DucktoryOptions>({
  meta: {
    name: 'ducktory',
    configKey: 'ducktory',
  },

  defaults: {
    path: '/ducktory',
    enabled: true,
    storyComponentPrefix: 'ducktory-story-',
    debug: false,
    storyDirectory: 'stories',
  },

  setup(_options, _nuxt) {
    if (!_options.enabled) {
      return
    }

    ducktoryLog('Ready!')
    console.log('')

    loadStories(_options, _nuxt)
    extendBundler(_nuxt)

    const resolver = createResolver(import.meta.url)
    addLayout(resolver.resolve('runtime/ducktoryLayout.vue'), 'ducktory')
    extendPages((pages) => {
      pages.unshift({
        name: 'ducktory',
        path: _options.path,
        file: resolver.resolve('runtime/pages/index.vue'),
        meta: { layout: 'ducktory' },
      })

      pages.unshift({
        name: 'ducktory-story',
        path: path.join(_options.path, '/:story'),
        file: resolver.resolve('runtime/pages/story.vue'),
        meta: { layout: 'ducktory' },
      })
    })

    _nuxt.options.css.push(resolver.resolve('./runtime/tailwind.css'))

    addImportsDir(resolver.resolve('runtime/composables'))
  },
})
