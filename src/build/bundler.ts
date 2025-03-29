import type { Nuxt } from '@nuxt/schema'
import { addVitePlugin } from '@nuxt/kit'
import { TransformMacroPlugin, type TransformMacroPluginOptions } from './transform/macros'

export function extendBundler(nuxt: Nuxt) {
  const macroOptions: TransformMacroPluginOptions = {
    sourcemap: !!nuxt.options.sourcemap.server || !!nuxt.options.sourcemap.client,
  }

  // @ts-ignore
  addVitePlugin(TransformMacroPlugin.vite(macroOptions))
}
