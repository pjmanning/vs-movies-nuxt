import { Movie } from '../../types'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { query, year, page } = getQuery(event)

  let data
  if (query === '' && year !== null) {
    data = await $fetch(`${config.public.tmdbBaseURL}discover/movie?api_key=${config.tmdbKey}&primary_release_year=${year}&page=${page}`)
  } else {
    data = await $fetch(`${config.public.tmdbBaseURL}search/movie?api_key=${config.tmdbKey}&query=${query}&primary_release_year=${year}&page=${page}`)
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

// if no results set isResults to false

//   try {
//     // if only year is provided, search for movies released in that year
//     if (query.value === '' && year.value) {
//       query.value = year.value
//     } else if (query.value === '' && !year.value) {
//       isResults.value = false
//       isLoading.value = false
//       return
//     }

//     const url = ref(`https://api.themoviedb.org/3/search/movie?api_key=e710ef86fb9f64ca848fde2ace087208&query=${query.value}&page=${page.value}`)
//     if (year.value) {
//       url.value += `&primary_release_year=${year.value}`
//     }

//     const res = await fetch(url.value)
//     const data = await res.json()
//     if (data.total_results === 0) {
//       isResults.value = false
//       isLoading.value = false
//       return
//     }
//     numberOfMovies.value = data.total_results
//     numberOfPages.value = data.total_pages
//     movies.value = data.results || []
//     isResults.value = true
//     isLoading.value = false
//   } catch (error) {
//     isLoading.value = false
//     console.error(error)
//   }
