export type DucktoryIntegrationInfo = {
  name: string
  enabled: boolean
}

export type DucktoryIntegration = {
  info: Omit<DucktoryIntegrationInfo, 'enabled'>

  isEnabled: () => boolean
}
