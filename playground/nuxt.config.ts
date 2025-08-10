export default defineNuxtConfig({
  modules: ['../src/module', '@nuxtjs/i18n', '@nuxt/ui'],

  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2025-03-29',

  ducktory: {
    enabled: true,
    debug: true,
  },

  i18n: {
    vueI18n: './i18n.config.ts',
    strategy: 'prefix_except_default',
    defaultLocale: 'de-DE',
    detectBrowserLanguage: false,
    locales: [
      {
        code: 'de-DE',
        files: ['de-DE/messages.json'],
      },
      {
        code: 'en-GB',
        files: ['en-GB/messages.json'],
      },
    ],
  },
})
