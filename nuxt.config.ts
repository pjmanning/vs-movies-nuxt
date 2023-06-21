// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ['@vueuse/nuxt', '@pinia/nuxt', '@nuxthq/ui', '@formkit/nuxt'],

  runtimeConfig: {
    tmdbKey: process.env.NUXT_TMDB_KEY,
    public: {
      tmdbBaseURL: process.env.NUXT_TMDB_BASE_URL,
    },
  },

  plugins: ['~/plugins/scroll.client.ts'],
})
