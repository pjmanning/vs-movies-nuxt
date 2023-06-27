import { Movie } from '../../types'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { query, year, page, sort, genres } = getQuery(event)

  console.log(sort)

  let data: any
  if (query === '' && year !== null) {
    data = await $fetch(`${config.public.tmdbBaseURL}discover/movie?api_key=${config.tmdbKey}&primary_release_year=${year}&page=${page}`)
    // data = await $fetch(`${config.public.tmdbBaseURL}discover/movie?api_key=${config.tmdbKey}&primary_release_year=${year}&page=${page}&sort_by=${sort}&=with_genres=${genres}`)
  } else {
    data = await $fetch(`${config.public.tmdbBaseURL}search/movie?api_key=${config.tmdbKey}&query=${query}&primary_release_year=${year}&page=${page}`)
    // data = await $fetch(`${config.public.tmdbBaseURL}discover/movie?api_key=${config.tmdbKey}&keywords=${query}&primary_release_year=${year}&page=${page}&sort_by=${sort}&=with_genres=${genres}`)
  }

  const results: Movie[] = data.results || []
  const totalMovies = data.total_results || 0
  const totalPages = data.total_pages || 0

  return {
    results,
    totalMovies,
    totalPages,
  }
})
