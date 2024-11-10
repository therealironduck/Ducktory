import path from 'node:path'
import fs, { readFileSync } from 'node:fs'
import type { Nuxt } from '@nuxt/schema'
import { addTemplate, updateTemplates } from '@nuxt/kit'
import { compileScript, parse as parseSFC } from '@vue/compiler-sfc'
import MagicString from 'magic-string'
import { walk } from 'estree-walker'
import type { Node } from '@babel/types'
import type { DucktoryOptions } from '../module'
import type { StoryMeta } from '../types/StoryMeta'
import type { StoryDefinition } from '../types/StoryDefinition'
import { ducktoryLog } from './utils'

const stories = new Map<string, StoryDefinition>()
const TEMPLATE_FILE = 'ducktory-stories.mjs'

export async function loadStoryTemplate(options: DucktoryOptions, nuxt: Nuxt) {
  await loadInitialStories(options, nuxt)
  addTemplate({
    filename: TEMPLATE_FILE,
    getContents: () => buildStoryJson(),
  })
}

export async function addStory(file: string, options: DucktoryOptions, nuxt: Nuxt, updateTemplate: boolean = true) {
  const filePath = path.join(nuxt.options.rootDir, options.storyDirectory, file)
  const originalName = file.replace(`.${options.storyComponentSuffix}.vue`, '')

  const name = options.storyComponentPrefix + originalName.charAt(0).toUpperCase() + originalName.slice(1) + 'Story'
  options.debug && ducktoryLog(`Found story: "${file}". Registring as "${name}"`, 'success')

  const meta = readStoryMeta(filePath, options)
  const code = readStoryCode(filePath)

  stories.set(originalName, {
    componentName: name,
    originalComponentName: originalName,
    meta,
    code,
  })

  if (updateTemplate) {
    await updateTemplates({ filter: t => t.filename === TEMPLATE_FILE })
  }
}

export async function removeStory(file: string, options: DucktoryOptions) {
  const originalName = file.replace(`.${options.storyComponentSuffix}.vue`, '')
  if (!stories.has(originalName)) {
    return
  }

  stories.delete(originalName)
  options.debug && ducktoryLog(`Removed story: "${file}"`, 'success')
  await updateTemplates({ filter: t => t.filename === TEMPLATE_FILE })
}

export async function updateStory(file: string, options: DucktoryOptions, nuxt: Nuxt) {
  const filePath = path.join(nuxt.options.rootDir, options.storyDirectory, file)
  const originalName = file.replace(`.${options.storyComponentSuffix}.vue`, '')
  const meta = readStoryMeta(filePath, options)
  const story = stories.get(originalName)

  if (!story || !meta) {
    return false
  }

  const code = readStoryCode(filePath)

  if (JSON.stringify(meta) === JSON.stringify(story.meta) && code === story.code) {
    return
  }

  options.debug && ducktoryLog(`Updated story meta/code: "${file}"`, 'success')

  story.code = code
  story.meta = meta
  await updateTemplates({ filter: t => t.filename === TEMPLATE_FILE })
}

async function loadInitialStories(options: DucktoryOptions, nuxt: Nuxt) {
  options.debug && ducktoryLog('Loading stories...')
  const storyPath = path.join(nuxt.options.rootDir, options.storyDirectory)
  if (!fs.existsSync(storyPath)) {
    options.debug && ducktoryLog(`Configured stories path missing: "${storyPath}".`, 'warn')
    return
  }

  fs.readdirSync(storyPath).forEach((file) => {
    if (!file.endsWith(`.${options.storyComponentSuffix}.vue`)) {
      options.debug && ducktoryLog(`Skipping: "${file}". Not a story file.`, 'warn')
      return
    }

    addStory(file, options, nuxt, false)
  })

  options.debug && ducktoryLog(`Complete! Found ${stories.size} stories.`, 'success')
  options.debug && console.log('')
}

async function buildStoryJson(): Promise<string> {
  const json = JSON.stringify(Object.fromEntries(stories), null, 2)
  return `export const stories = ${json};`
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

function readStoryCode(path: string): string {
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
