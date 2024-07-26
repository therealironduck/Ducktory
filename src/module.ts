import path from 'node:path'
import type { Resolver } from '@nuxt/kit'
import { addImportsDir, addLayout, addVitePlugin, createResolver, defineNuxtModule, extendPages } from '@nuxt/kit'
import type { HookResult, Nuxt } from '@nuxt/schema'
import { ducktoryLog } from './build/utils'
import { addStory, loadStoryTemplate } from './build/stories'
import { extendBundler } from './build/bundler'

declare module '#app' {
  interface NuxtHooks {
    'ducktory:full-reload': () => HookResult
  }
}

export interface DucktoryOptions {
  /**
   * The path where ducktory will be available
   * @default '/ducktory'
   */
  path: string

  /**
   * Enable or disable ducktory. This option can be used to disable
   * ducktory in production.
   * @default true
   */
  enabled: boolean

  /**
   * The prefix for story components. It is recommended to not change this
   * unless you know what you are doing.
   * @default 'Ducktory'
   */
  storyComponentPrefix: string

  /**
   * Enable debug mode. This will log additional information to the console.
   * @default false
   */
  debug: boolean

  /**
   * The directory where stories are located relative to the root directory.
   * @default 'stories'
   */
  storyDirectory: string

  /**
   * The file suffix for story components. It is recommended to not change this
   * unless you know what you are doing.
   * @default 'story'
   */
  storyComponentSuffix: string
}

export default defineNuxtModule<DucktoryOptions>({
  meta: {
    name: 'ducktory',
    configKey: 'ducktory',
  },

  defaults: {
    path: '/ducktory',
    enabled: true,
    storyComponentPrefix: 'Ducktory',
    debug: false,
    storyDirectory: 'stories',
    storyComponentSuffix: 'story',
  },

  async setup(options, nuxt) {
    if (!options.enabled) {
      return
    }

    ducktoryLog('Ready!')
    const resolver = createResolver(import.meta.url)

    /**
     * Load all the meta data for existing stories and store them in a template
     * which can be used to render the stories runtime.
     */
    await loadStoryTemplate(options, nuxt)

    /**
     * Extend the vite bundler to remove the `defineStoryMeta` composable from the final
     * build since it is only needed for the story template loading.
     */
    extendBundler(nuxt)

    /**
     * Register the ducktory home page and story subpage. Also register the layout
     * both pages use.
     */
    registerPages(resolver, options)

    /**
     * Autoload the stories directory as a global component directory.
     * This will make all story components available globally.
     * Also, the stories will be prefixed with the `storyComponentPrefix` option.
     */
    extendComponents(nuxt, options)

    /**
     * Add the tailwind and font css to the nuxt options, so they are included in the build.
     * Also, add the composable directory to the imports. This is needed to make the
     * `defineStoryMeta` composable available in the stories.
     */
    nuxt.options.css.push(resolver.resolve('./runtime/assets/tailwind.css'))
    nuxt.options.css.push(resolver.resolve('./runtime/assets/fonts.css'))

    addImportsDir(resolver.resolve('runtime/composables'))

    /**
     * Handle hot module reloading for story files. When a story file changes, the stories
     * will be reloaded and the browser will be notified to reload the page.
     */
    handleHmr(nuxt, options)
  },
})

function registerPages(resolver: Resolver, options: DucktoryOptions) {
  addLayout(resolver.resolve('runtime/ducktoryLayout.vue'), 'ducktory')
  extendPages((pages) => {
    pages.unshift({
      name: 'ducktory',
      path: options.path,
      file: resolver.resolve('runtime/pages/index.vue'),
      meta: { layout: 'ducktory' },
    })

    pages.unshift({
      name: 'ducktory-story',
      path: path.join(options.path, '/:story'),
      file: resolver.resolve('runtime/pages/story.vue'),
      meta: { layout: 'ducktory' },
    })
  })
}

function extendComponents(nuxt: Nuxt, options: DucktoryOptions) {
  nuxt.hook('components:dirs', (dirs) => {
    dirs.push({
      path: path.join(nuxt.options.rootDir, options.storyDirectory),
      prefix: options.storyComponentPrefix,
      extensions: [`${options.storyComponentSuffix}.vue`],
      global: true,
    })
  })
}

function handleHmr(nuxt: Nuxt, options: DucktoryOptions) {
  nuxt.hook('builder:watch', async (event, path) => {
    if (!path.includes(options.storyDirectory) || !path.endsWith(`.${options.storyComponentSuffix}.vue`)) {
      return
    }

    options.debug && ducktoryLog('Story file changed. Reloading stories...')
    switch (event) {
      case 'add':
        await addStory(path.substring(options.storyDirectory.length + 1), options, nuxt)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await nuxt.callHook('ducktory:full-reload' as any)
        break

      case 'unlink':
        // removeStory(path);
        break

      case 'change':
        // updateStory(path);
        break
    }
  })

  // @see https://github.com/nuxt/nuxt/issues/21690
  addVitePlugin({
    name: 'ducktory-hmr-plugin',
    configureServer(server) {
      server.ws.on('connection', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        nuxt.hook('ducktory:full-reload' as any, () => {
          setTimeout(() => {
            server.ws.send({ type: 'full-reload' })
          }, 1000)
        })
      })
    },
  })
}
