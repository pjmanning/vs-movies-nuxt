import { useMovieStore } from '@/stores/movies'
import type { Movie } from '@/types'

export function useList() {
  const movieStore = useMovieStore()
  const toast = useToast()

  function addToList(movie: Movie, listId: number) {
    const listIndex = movieStore.lists.findIndex((list) => list.id === listId)
    const movieIndex = movieStore.lists[listIndex].movies.findIndex((m) => m.id === movie.id)
    if (movieIndex !== -1) {
      toast.add({ id: 'already_added', title: 'Already Added', description: 'This movie already exists in this list.', icon: 'i-heroicons-x-circle' })
      return
    }
    movieStore.lists[listIndex].movies.push(movie)
    toast.add({ id: 'successfully_added', title: 'Added to List!', description: 'You successfully added this movie.', icon: 'i-heroicons-check-circle' })
  }

  return { addToList }
}
