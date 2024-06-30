import path from 'node:path'
import { defineNuxtModule, extendPages, createResolver, addLayout, addImportsDir, addVitePlugin } from '@nuxt/kit'
import { ducktoryLog } from './build/utils'
import { addStory, loadStoryTemplate } from './build/stories'
import { extendBundler } from './build/bundler'
import type { HookResult } from '@nuxt/schema'

declare module '#app' {
  interface NuxtHooks {
    'ducktory:full-reload': () => HookResult
  }
}
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

    loadStoryTemplate(_options, _nuxt)
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

    _nuxt.options.css.push(resolver.resolve('./runtime/assets/tailwind.css'))
    _nuxt.options.css.push(resolver.resolve('./runtime/assets/fonts.css'))

    addImportsDir(resolver.resolve('runtime/composables'))

    _nuxt.hook('builder:watch', (event, path) => {
      if (!path.includes(_options.storyDirectory) || !path.endsWith('.story.vue')) {
        return;
      }

      _options.debug && ducktoryLog('Story file changed. Reloading stories...')
      switch (event) {
        case 'add':
          addStory(path.substring(_options.storyDirectory.length + 1), _options, _nuxt);
          _nuxt.callHook('ducktory:full-reload' as any);
          break;
        case 'unlink':
          // removeStory(path);
          break;
        case 'change':
          // updateStory(path);
          break;
      }
    });

    // @see https://github.com/nuxt/nuxt/issues/21690
    addVitePlugin({
      name: 'ducktory-hmr-plugin',
      configureServer(server) {
        server.ws.on('connection', (socket) => {
          _nuxt.hook('ducktory:full-reload' as any, () => {
            setTimeout(() => {
              server.ws.send({type: 'full-reload'})
            }, 1000);
          });
        });
      }
    })
  },
})
