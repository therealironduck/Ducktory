import { colors } from 'consola/utils'
import { logger } from '@nuxt/kit'

export function ducktoryLog(message: string, level: 'info' | 'warn' | 'success' = 'info') {
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
