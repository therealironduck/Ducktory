import path from 'node:path'
import fs, { readFileSync } from 'node:fs'
import type { Nuxt } from '@nuxt/schema'
import { addTemplate, updateTemplates } from '@nuxt/kit'
import { compileScript, parse as parseSFC } from '@vue/compiler-sfc'
import MagicString from 'magic-string'
import { walk } from 'estree-walker'
import type { Node } from '@babel/types'
import type * as consola from 'consola'
import type { DucktoryOptions } from '../module'
import type { StoryMeta } from '../types/StoryMeta'
import type { StoryDefinition } from '../types/StoryDefinition'

const stories = new Map<string, StoryDefinition>()
const TEMPLATE_FILE = 'ducktory-stories.mjs'

export async function loadStoryTemplate(options: DucktoryOptions, nuxt: Nuxt, logger: consola.ConsolaInstance) {
  await loadInitialStories(options, nuxt, logger)
  addTemplate({
    filename: TEMPLATE_FILE,
    getContents: () => buildStoryJson(),
  })
}

export async function addStory(file: string, options: DucktoryOptions, nuxt: Nuxt, logger: consola.ConsolaInstance, updateTemplate: boolean = true) {
  const filePath = path.join(nuxt.options.rootDir, options.storyDirectory, file)
  const originalName = file.replace(`.${options.storyComponentSuffix}.vue`, '')

  const name = options.storyComponentPrefix + originalName.charAt(0).toUpperCase() + originalName.slice(1) + 'Story'
  logger.debug(`Found story: "${file}". Registring as "${name}"`)

  const meta = readStoryMeta(filePath, logger)
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

export async function removeStory(file: string, options: DucktoryOptions, logger: consola.ConsolaInstance) {
  const originalName = file.replace(`.${options.storyComponentSuffix}.vue`, '')
  if (!stories.has(originalName)) {
    return
  }

  stories.delete(originalName)
  logger.debug(`Removed story: "${file}"`)
  await updateTemplates({ filter: t => t.filename === TEMPLATE_FILE })
}

export async function updateStory(file: string, options: DucktoryOptions, nuxt: Nuxt, logger: consola.ConsolaInstance) {
  const filePath = path.join(nuxt.options.rootDir, options.storyDirectory, file)
  const originalName = file.replace(`.${options.storyComponentSuffix}.vue`, '')
  const meta = readStoryMeta(filePath, logger)
  const story = stories.get(originalName)

  if (!story || !meta) {
    return false
  }

  const code = readStoryCode(filePath)

  if (JSON.stringify(meta) === JSON.stringify(story.meta) && code === story.code) {
    return
  }

  logger.debug(`Updated story meta/code: "${file}"`)

  story.code = code
  story.meta = meta
  await updateTemplates({ filter: t => t.filename === TEMPLATE_FILE })
}

async function loadInitialStories(options: DucktoryOptions, nuxt: Nuxt, logger: consola.ConsolaInstance) {
  logger.debug('Loading stories...')
  const storyPath = path.join(nuxt.options.rootDir, options.storyDirectory)
  if (!fs.existsSync(storyPath)) {
    logger.debug(`Configured stories path missing: "${storyPath}".`)
    return
  }

  fs.readdirSync(storyPath).forEach((file) => {
    if (!file.endsWith(`.${options.storyComponentSuffix}.vue`)) {
      logger.debug(`Skipping: "${file}". Not a story file.`)
      return
    }

    addStory(file, options, nuxt, logger, false)
  })

  logger.debug(`Complete! Found ${stories.size} stories.`)
  logger.debug('')
}

async function buildStoryJson(): Promise<string> {
  const json = JSON.stringify(Object.fromEntries(stories), null, 2)
  return `export const stories = ${json};`
}

function readStoryMeta(path: string, logger: consola.ConsolaInstance): StoryMeta | undefined {
  const content = readFileSync(path).toString()
  if (!content.includes('defineStory')) {
    return
  }

  logger.debug(`Reading story meta from: "${path}"`)

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

  // Get content of template tag / content string without regex and using something smart
  const { descriptor } = parseSFC(content)
  const { template } = descriptor

  const innerTemplate = filterOutDucktoryTags(template?.content ?? '')

  // Remove empty lines
  return innerTemplate.split('\n').filter(line => line.trim().length > 0).join('\n')
}

function evalValue(value: string): StoryMeta | undefined {
  try {
    // TODO as any
    return new Function(`return (${value})`)() as StoryMeta
  }
  catch {
    // Todo propper error
    // console.error(formatMessage(`Cannot evaluate value: ${value}`))
    return
  }
}

function filterOutDucktoryTags(content: string): string {
  const ducktoryDocumentationRegex = /<ducktory-?documentation[^>]*>[\s\S]*?<\/ducktory-?documentation>/gi

  return content.replace(ducktoryDocumentationRegex, '')
}
