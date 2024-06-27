import { defineNuxtModule, extendPages, createResolver, addLayout } from '@nuxt/kit'

export interface DucktoryOptions { }

export default defineNuxtModule<DucktoryOptions>({
  meta: {
    name: 'ducktory',
    configKey: 'ducktory',
  },
  
  defaults: {},

  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)

    addLayout(resolver.resolve('runtime/layout.vue'), 'ducktory');

    extendPages((pages) => {
      pages.unshift({
        name: 'ducktory',
        path: '/ducktory',
        file: resolver.resolve('runtime/pages/ducktory.vue'),
        meta: { layout: 'ducktory' },
      })
    })
  },
})
