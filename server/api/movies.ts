export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const { type } = getQuery(event)

  const res = await $fetch(`${config.public.tmdbBaseURL}movie/${type}?api_key=${config.tmdbKey}`)
  const movies = res.results || []

  return movies
})
