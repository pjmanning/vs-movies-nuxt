export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const { type } = getQuery(event)

  const movies = await $fetch(`${config.public.tmdbBaseURL}movie/${type}?api_key=${config.tmdbKey}`)

  return movies
})
