import { createUnplugin } from 'unplugin'
import { MagicString, parse as parseSFC } from '@vue/compiler-sfc'

export interface TransformMacroPluginOptions {
  sourcemap?: boolean
}

export const TransformMacroPlugin = createUnplugin((options: TransformMacroPluginOptions) => {
  return {
    name: 'therealironduck:ducktory-macros-transform',
    enforce: 'pre',

    transformInclude(id) {
      return id.endsWith('.story.vue')
    },

    transform(code) {
      const parsed = parseSFC(code, { sourceMap: false })
      const script = parsed.descriptor.scriptSetup ?? parsed.descriptor.script
      if (!script) {
        return code
      }

      const s = new MagicString(code)
      const match = script.content.match(/\bdefineStory\s*\(\s*/)
      if (match?.[0]) {
        const scriptString = new MagicString(script.content)
        scriptString.overwrite(match.index!, match.index! + match[0].length, `false && /*#__PURE__*/ ${match[0]}`)
        s.overwrite(script.loc.start.offset, script.loc.end.offset, scriptString.toString())
      }

      if (s.hasChanged()) {
        return {
          code: s.toString(),
          map: options.sourcemap ? s.generateMap({ hires: true }) : undefined,
        }
      }

      return code
    },
  }
})
