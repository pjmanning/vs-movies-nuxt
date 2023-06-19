// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      tmdbKey: process.env.NUXT_TMDB_KEY,
      tmdbBaseURL: process.env.NUXT_TMDB_BASE_URL,
    },
  },
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt', '@pinia/nuxt'],
})
