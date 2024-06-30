import path from 'node:path'
import fs, { readFileSync } from 'node:fs'
import type { Nuxt } from '@nuxt/schema'
import { addComponent, addTemplate } from '@nuxt/kit'
import { parse as parseSFC, compileScript } from '@vue/compiler-sfc'
import MagicString from 'magic-string'
import { walk } from 'estree-walker'
import type { Node } from '@babel/types'
import type { DucktoryOptions } from '../module'
import type { StoryMeta } from '../types/StoryMeta'
import type { StoryDefinition } from '../types/StoryDefinition'
import { ducktoryLog } from './utils'

export function loadStories(options: DucktoryOptions, nuxt: Nuxt) {
  const stories: { [k: string]: StoryDefinition } = {}
  let storyIndex = 0

  options.debug && ducktoryLog('Loading stories...')
  const storyPath = path.join(nuxt.options.rootDir, options.storyDirectory)
  if (!fs.existsSync(storyPath)) {
    options.debug && ducktoryLog(`Configured stories path missing: "${storyPath}".`, 'warn')
    return
  }

  fs.readdirSync(storyPath).forEach((file) => {
    if (!file.endsWith('.story.vue')) {
      options.debug && ducktoryLog(`Skipping: "${file}". Not a story file.`, 'warn')
      return
    }

    const name = options.storyComponentPrefix + (++storyIndex)
    options.debug && ducktoryLog(`Found story: "${file}". Registring as "${name}"`, 'success')

    const filePath = path.join(nuxt.options.rootDir, options.storyDirectory, file)
    addComponent({
      name,
      filePath,
      global: true,
    })

    const meta = readStoryMeta(filePath, options)
    const code = readStoryCode(filePath, options)
    const originalName = file.replace('.story.vue', '')
    if (!meta) {
      stories[originalName] = {
        id: storyIndex,
        componentName: name,
        originalComponentName: originalName,
        code
      }
      return
    }

    stories[originalName] = {
      id: storyIndex,
      componentName: name,
      originalComponentName: originalName,
      meta,
      code
    }
  })

  options.debug && ducktoryLog(`Complete! Found ${Object.keys(stories).length} stories.`, 'success')
  options.debug && console.log('')

  const json = JSON.stringify(stories, null, 2)
  addTemplate({
    filename: 'ducktory-stories.mjs',
    getContents: () => `export const stories = ${json};`,
  })
}

function readStoryMeta(path: string, options: DucktoryOptions): StoryMeta | undefined {
  const content = readFileSync(path).toString()
  if (!content.includes('defineStory')) {
    return
  }

  options.debug && ducktoryLog(`Reading story meta from: "${path}"`, 'info')

  const { descriptor } = parseSFC(content)
  const desc = compileScript(descriptor, { id: path })
  const { scriptSetupAst, scriptAst } = desc

  let extract = ''
  const genericSetupAst = scriptSetupAst || scriptAst
  if (genericSetupAst) {
    const s = new MagicString(desc.loc.source)
    genericSetupAst.forEach((ast) => {
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      walk(ast as any, {
        enter(_node) {
          const node = _node as Node
          if (node.type === 'CallExpression' && node.callee.type === 'Identifier' && node.callee.name === 'defineStory') {
            const arg = node.arguments[0]
            if (arg.type === 'ObjectExpression' && arg.start != null && arg.end != null) {
              extract = s.slice(arg.start, arg.end)
            }
          }
        },
      })
    })
  }

  if (extract) {
    return evalValue(extract)
  }
}

function readStoryCode(path: string, options: DucktoryOptions): string {
  const content = readFileSync(path).toString()
  if (!content.includes('template')) {
    return ''
  }

  // Get content of template tag onn content string without regex and using something smart
  const { descriptor } = parseSFC(content)
  const { template } = descriptor

  return template?.content ?? ''
}

function evalValue(value: string): StoryMeta | undefined {
  try {
    // TODO as any
    return new Function(`return (${value})`)() as StoryMeta
  }
  catch (_e) {
    // Todo propper error
    // console.error(formatMessage(`Cannot evaluate value: ${value}`))
    return
  }
}
