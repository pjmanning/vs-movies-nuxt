<script setup lang="ts">
import { useMovieStore } from '@/stores/movies'
import type { Movie } from '@/types'

const movieStore = useMovieStore()
const route = useRoute()

const {
  pending,
  data: movie,
  error,
} = useFetch<Movie>(`/api/movie/${route.params.id}`, {
  lazy: true,
})
const currentReview = ref(movieStore.reviews.find((review) => review.id === movie.value?.id))

////////// RATINGS //////////
const updateRating = (movie: Movie, rating: number) => {
  const movieIndex = movieStore.movies.findIndex((m) => m.id === movie.id)
  if (movieIndex !== -1) {
    // edit the rating in the reviews array
    movieStore.movies[movieIndex].reviews = movieStore.movies[movieIndex].reviews.map((review) => {
      return { ...review, rating: rating }
    })
  } else {
    movieStore.movies.push({ ...movie, reviews: [{ id: Math.floor(Math.random() * 1000001), content: '', rating: rating, date: new Date() }] })
  }
}

////////// REVIEW MODAL //////////
const isReviewModalOpen = ref(false)
const openReviewModal = ref(false)
const selectedMovie = ref({} as Movie)
const reviewName = ref(null)
const reviewContent = ref(null)
function viewReviews(id: number) {
  openReviewModal.value = true
  //   selectedMovie.value = movie.value.find((movie) => movie.id === id) as Movie
}
function saveReview() {
  console.log('saveReview')
  isReviewModalOpen.value = false
}

////////// LIST MODAL //////////
const isListModalOpen = ref(false)
</script>

<template>
  <div>
    <div v-if="pending" class="flex min-h-screen items-center justify-center">
      <Loading class="h-24 w-24" />
    </div>
    <div v-else-if="error"></div>
    <div v-else-if="movie" class="mx-auto min-h-screen max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
      <!-- Movie details -->
      <div class="lg:max-w-lg lg:self-end">
        <nav aria-label="Breadcrumb" class="font-medium text-gray-300">
          {{ new Date(movie.release_date).getFullYear() }}
        </nav>

        <div class="mt-4">
          <h1 class="text-xl font-bold tracking-tight text-white sm:text-4xl">{{ movie.title }}</h1>
        </div>

        <section aria-labelledby="information-heading" class="mt-4">
          <h2 id="information-heading" class="sr-only">Movie information</h2>

          <div class="flex items-center">
            <p class="text-lg text-gray-100 sm:text-xl">{{ movie.vote_average.toFixed(1) }}</p>

            <div class="ml-4 border-l border-gray-300 pl-4">
              <h2 class="sr-only">Reviews</h2>
              <div class="flex items-center">
                <div>
                  <div class="flex items-center">
                    <UIcon name="i-heroicons-star-solid" v-for="rating in [0, 1, 2, 3, 4]" :key="rating" :class="[movie.vote_average / 2 > rating ? 'text-yellow-400' : 'text-gray-300', 'h-5 w-5 flex-shrink-0']" aria-hidden="true" />
                  </div>
                  <p class="sr-only">{{ movie.vote_average / 2 }} out of 5 stars</p>
                </div>
                <p class="ml-2 text-sm text-gray-300">{{ movie.vote_count }} reviews <span class="hidden sm:block">-</span></p>
                <div class="mt-2 hidden sm:ml-2 sm:block">
                  <UButton v-if="currentReview" block size="lg" label="Your review" @click="isReviewModalOpen = true" />
                  <UButton v-else block size="lg" label="Write a review" @click="isReviewModalOpen = true" />
                  <ReviewModal :movie="movie" :is-review-modal-open="isReviewModalOpen" @update:isReviewModalOpen="isReviewModalOpen = $event" @saveReview="saveReview" @closeReviewModal="isReviewModalOpen = false" />
                </div>
              </div>
            </div>
          </div>

          <div class="mt-2 block sm:ml-2 sm:hidden">
            <UButton v-if="currentReview" block size="lg" label="Your review" @click="isReviewModalOpen = true" />
            <UButton v-else block size="lg" label="Write a review" @click="isReviewModalOpen = true" />
            <ReviewModal :movie="movie" :is-review-modal-open="isReviewModalOpen" @update:isReviewModalOpen="isReviewModalOpen = $event" @saveReview="saveReview" @closeReviewModal="isReviewModalOpen = false" />
          </div>

          <div class="mt-4 space-y-6">
            <p class="text-base text-gray-300">{{ movie.overview }}</p>
          </div>

          <!-- Status -->
          <!-- <div class="mt-6 flex items-center">
            <UIcon name="i-heroicons-check" class="h-5 w-5 flex-shrink-0 text-green-500" aria-hidden="true" />
            <p class="ml-2 text-sm text-gray-500">{{ movie.status }}</p>
          </div> -->
        </section>
      </div>

      <!-- Movie image -->
      <div class="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
        <div class="aspect-10/16 overflow-hidden rounded-lg">
          <img v-if="movie.poster_path" :src="`https://image.tmdb.org/t/p/w500/${movie.poster_path}`" :alt="movie.title" class="mx-auto h-full w-auto rounded object-cover object-center" />
          <img v-else src="https://placehold.co/500x750/374151/FFF?text=No+Image" alt="No Image" class="mx-auto h-full w-full rounded bg-gray-700 object-cover" />
        </div>
      </div>

      <div class="mt-10">
        <UButton label="Add to List" color="violet" @click="isListModalOpen = true" class="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50" />
        <ListModal :movie="movie" :is-list-modal-open="isListModalOpen" @update:isListModalOpen="isListModalOpen = $event" @closeListModal="isListModalOpen = false" />
      </div>
    </div>
  </div>
</template>
