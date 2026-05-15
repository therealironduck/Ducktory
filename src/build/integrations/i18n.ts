import type { DucktoryIntegration } from '../../types/DucktoryIntegration'

export const i18nIntegration = {
  info: {
    name: 'Nuxt i18n',
  },

  isEnabled() {
    return false
  },
} satisfies DucktoryIntegration
