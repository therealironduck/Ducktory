import path from 'node:path'
import type { Resolver } from '@nuxt/kit'
import { addComponent, addImportsDir, addLayout, addTypeTemplate, addVitePlugin, createResolver, defineNuxtModule, useLogger } from '@nuxt/kit'
import type { HookResult, Nuxt } from '@nuxt/schema'
import type * as consola from 'consola'
import { addStory, loadStoryTemplate, removeStory, updateStory } from './build/stories'
import { extendBundler } from './build/bundler'

declare module '#app' {
  // noinspection JSUnusedGlobalSymbols
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

// noinspection JSUnusedGlobalSymbols
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

  async setup(options: DucktoryOptions, nuxt: Nuxt) {
    if (!options.enabled) {
      return
    }

    const logger = useLogger('Ducktory', { level: options.debug ? 4 : 3 })

    logger.info('Ducktory Ready!')
    const resolver = createResolver(import.meta.url)

    /**
     * Load all the metadata for existing stories and store them in a template
     * which can be used to render the stories runtime.
     */
    await loadStoryTemplate(options, nuxt, logger)

    /**
     * Extend the vite bundler to remove the `defineStoryMeta` composable from the final
     * build since it is only needed for the story template loading.
     */
    extendBundler(nuxt)

    /**
     * Register the ducktory home page and story subpage. Also register the layout
     * both pages use.
     */
    registerPages(resolver, options, nuxt)

    /**
     * Autoload the stories directory as a global component directory.
     * This will make all story components available globally.
     * Also, the stories will be prefixed with the `storyComponentPrefix` option.
     *
     * Additionally it will register global components which can be used in stories.
     */
    extendComponents(nuxt, options, resolver)

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
    handleHmr(nuxt, options, logger)

    /**
     * Register custom types for nuxt. This is needed to make the `useLocalePath` composable not
     * throw an error if NuxtI18n is not installed.
     */
    registerCustomTypes()
  },
})

function registerPages(resolver: Resolver, options: DucktoryOptions, nuxt: Nuxt) {
  addLayout(resolver.resolve('runtime/ducktoryLayout.vue'), 'ducktory')
  nuxt.hook('pages:extend', (pages) => {
    pages.push({
      name: 'ducktory',
      path: options.path,
      file: resolver.resolve('runtime/pages/index.vue'),
      meta: { layout: 'ducktory' },
    })

    pages.push({
      name: 'ducktory-story',
      path: path.join(options.path, '/:story'),
      file: resolver.resolve('runtime/pages/story.vue'),
      meta: { layout: 'ducktory' },
    })
  })
}

function extendComponents(nuxt: Nuxt, options: DucktoryOptions, resolver: Resolver) {
  nuxt.hook('components:dirs', (dirs) => {
    dirs.push({
      path: path.join(nuxt.options.rootDir, options.storyDirectory),
      prefix: options.storyComponentPrefix,
      extensions: [`${options.storyComponentSuffix}.vue`],
      global: true,
    })

    addComponent({
      name: 'DucktoryDocumentation',
      filePath: resolver.resolve('runtime/components/DucktoryDocumentation.vue'),
    })
  })
}

function handleHmr(nuxt: Nuxt, options: DucktoryOptions, logger: consola.ConsolaInstance) {
  nuxt.hook('builder:watch', async (event, path) => {
    if (!path.includes(options.storyDirectory) || !path.endsWith(`.${options.storyComponentSuffix}.vue`)) {
      return
    }

    logger.debug('Story file changed. Reloading stories...')
    switch (event) {
      case 'add':
        await addStory(path.substring(options.storyDirectory.length + 1), options, nuxt, logger)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await nuxt.callHook('ducktory:full-reload' as any)
        break

      case 'unlink':
        await removeStory(path.substring(options.storyDirectory.length + 1), options, logger)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await nuxt.callHook('ducktory:full-reload' as any)
        break

      case 'change':
        await updateStory(path.substring(options.storyDirectory.length + 1), options, nuxt, logger)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await nuxt.callHook('ducktory:full-reload' as any)
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

function registerCustomTypes() {
  addTypeTemplate({
    filename: 'ducktory-types.d.ts',
    getContents: () => `
        declare global {
          function useLocalePath(): (args: { name: string, params: Record<string, string> }) => any | undefined;
        }

        export {}
      `,
  })
}
