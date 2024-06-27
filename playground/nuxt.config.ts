export default defineNuxtConfig({
  modules: ['../src/module'],
  ducktory: {
    path: '/styles',
    enabled: true,
    debug: true,
  },
  devtools: { enabled: true },
})
