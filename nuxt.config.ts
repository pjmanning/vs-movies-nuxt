// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@vueuse/nuxt', '@pinia/nuxt', '@nuxthq/ui'],
  runtimeConfig: {
    public: {
      tmdbKey: process.env.NUXT_TMDB_KEY,
      tmdbBaseURL: process.env.NUXT_TMDB_BASE_URL,
    },
  },
})
