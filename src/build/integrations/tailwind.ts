import type { DucktoryIntegration } from '../../types/DucktoryIntegration'

export const tailwindIntegration = {
  info: {
    name: 'Tailwind CSS',
  },

  isEnabled() {
    return false
  },
} satisfies DucktoryIntegration
