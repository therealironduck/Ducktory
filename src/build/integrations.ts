import { addTemplate } from '@nuxt/kit'
import type { DucktoryIntegrationInfo } from '../types/DucktoryIntegration'
import type * as consola from 'consola'
import { i18nIntegration } from './integrations/i18n'
import { tailwindIntegration } from './integrations/tailwind'

const integrations = new Map<string, DucktoryIntegrationInfo>()
const TEMPLATE_FILE = 'ducktory-integrations.mjs'

const allIntegrations = [
  tailwindIntegration,
  i18nIntegration,
]

export function loadIntegrations(logger: consola.ConsolaInstance) {
  logger.debug('Checking integrations')
  for (const integration of allIntegrations) {
    const enabled = integration.isEnabled()

    logger.debug(`Integration "${integration.info.name}": ${enabled ? '✅' : '❌'}`)
    integrations.set(integration.info.name, {
      ...integration.info,
      enabled,
    })
  }

  addTemplate({
    filename: TEMPLATE_FILE,
    getContents: () => buildIntegrationJson(),
  })
}

async function buildIntegrationJson(): Promise<string> {
  const json = JSON.stringify(Object.fromEntries(integrations), null, 2)
  return `export const integrations = ${json};`
}
