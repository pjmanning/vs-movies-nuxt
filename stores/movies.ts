import { defineStore, skipHydrate } from 'pinia'
import { useStorage } from '@vueuse/core'
import type { Movie, Review, List } from '@/types'

export const useMovieStore = defineStore('movies', () => {
  const movies = useStorage('movies', <Movie[]>[])
  const reviews = useStorage('reviews', <Review[]>[])
  const lists = useStorage('lists', <List[]>[])

  return { movies: skipHydrate(movies), reviews: skipHydrate(reviews), lists: skipHydrate(lists) }
})
