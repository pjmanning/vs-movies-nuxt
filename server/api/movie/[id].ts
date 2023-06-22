export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const { id } = event.context.params

  const movie = await $fetch(`${config.public.tmdbBaseURL}movie/${id}?api_key=${config.tmdbKey}`)

  return movie
})
