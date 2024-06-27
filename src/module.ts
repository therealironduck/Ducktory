import fs from 'node:fs'
import path from 'node:path'
import { defineNuxtModule, extendPages, createResolver, addLayout, addComponent, logger, addTemplate } from '@nuxt/kit'
import { colors } from 'consola/utils'

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

    const resolver = createResolver(import.meta.url)
    const storyComponents: string[] = []
    let storyIndex = 0

    _options.debug && ducktoryLog('Loading stories...')

    fs.readdirSync(path.join(_nuxt.options.rootDir, _options.storyDirectory)).forEach((file) => {
      if (!file.endsWith('.story.vue')) {
        _options.debug && ducktoryLog(`Skipping: "${file}". Not a story file.`, 'warn')
        return
      }

      const name = _options.storyComponentPrefix + (++storyIndex)
      _options.debug && ducktoryLog(`Found story: "${file}". Registring as "${name}"`, 'success')

      addComponent({
        name,
        filePath: path.join(_nuxt.options.rootDir, 'stories', file),
        global: true,
      })
      storyComponents.push(name)
    })

    _options.debug && ducktoryLog(`Complete! Found ${storyComponents.length} stories.`, 'success')
    _options.debug && console.log('')

    const json = JSON.stringify(storyComponents, null, 2)
    addTemplate({
      filename: 'ducktory-stories.mjs',
      getContents: () => `export const stories = ${json};`,
    })

    addLayout(resolver.resolve('runtime/ducktoryLayout.vue'), 'ducktory')
    extendPages((pages) => {
      pages.unshift({
        name: 'ducktory',
        path: _options.path,
        file: resolver.resolve('runtime/pages/ducktory.vue'),
        meta: { layout: 'ducktory' },
      })
    })
  },
})

function ducktoryLog(message: string, level: 'info' | 'warn' | 'success' = 'info') {
  let method = logger.info
  switch (level) {
    case 'warn':
      method = logger.fail
      break
    case 'success':
      method = logger.success
      break
  }

  method([
    colors.yellow('🦆 [Ducktory]'),
    message,
  ].join(' '))
}
