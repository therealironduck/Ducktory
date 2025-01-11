export default defineNuxtConfig({
  modules: ['../src/module', '@nuxtjs/i18n'],

  ducktory: {
    enabled: true,
    debug: true,
  },
  devtools: { enabled: true },
  i18n: {
    locales: ['en', 'de'],
    strategy: 'prefix',
    vueI18n: './i18n.config.ts',
  },
})
