import { Movie } from '../../types'

export default defineEventHandler(async (event) => {
  const config = await useRuntimeConfig()
  const { ids } = await getQuery(event)
  const idsArray = await String(ids)?.split(',')
  let movieArray: Movie[] = []

  if (idsArray.length > 0 && idsArray[0] !== '') {
    for (const id of idsArray) {
      const res = await $fetch(`${config.public.tmdbBaseURL}movie/${id}/similar?api_key=${config.tmdbKey}`)
      if (res.results) {
        const movieList = res.results
        for (let i = 0; i < 5; i++) {
          // if movie already exists don't add it
          if (movieArray.findIndex((m) => m.id === movieList[i].id) !== -1) {
            continue
          }

          movieArray.push(movieList[i])
        }
      } else {
        console.log(`No similar movies for id ${id}`)
      }
    }
  } else {
    console.log('No valid ids provided')
  }

  return movieArray
})
