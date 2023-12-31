import { useMovieStore } from '@/stores/movies'
import { Movie, Review } from '@/types'

export function useReview() {
  const movieStore = useMovieStore()

  function addReview(movie: Movie, rating: number, content: string, date: Date) {
    const review: Review = {
      id: movie.id,
      movieName: movie.title,
      rating,
      content,
      date: new Date(),
    }
    movieStore.reviews.push(review)
  }

  function updateReview(review: Review, newRating: number, newContent: string, newDate: Date) {
    review.rating = newRating
    review.content = newContent
    review.date = newDate
  }

  return { addReview, updateReview }
}
