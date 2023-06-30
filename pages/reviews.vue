<script setup lang="ts">
import type { Review } from '@/types'
import { useMovieStore } from '~/stores/movies'

const movieStore = useMovieStore()
const reviews: Review[] = movieStore.reviews

function deleteReview(id: number) {
  const reviewIndex = movieStore.reviews.findIndex((review) => review.id === id)
  movieStore.reviews.splice(reviewIndex, 1)
}
</script>

<template>
  <div class="mx-auto h-screen max-w-7xl px-4 py-10">
    <h1 class="text-2xl font-bold">Your Reviews</h1>

    <div class="mx-auto my-10 w-full max-w-xl">
      <template v-if="reviews.length === 0">
        <div class="flex h-full flex-col place-content-center text-center">
          <UIcon name="i-heroicons-film" class="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
          <h3 class="mt-2 text-sm font-semibold text-gray-100">No reviews</h3>
          <p class="mt-1 text-sm text-gray-400">Get started by searching for a movie.</p>
          <div class="mt-6">
            <NuxtLink to="/search" class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              <UIcon name="i-heroicons-magnifying-glass" class="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Search for movies
            </NuxtLink>
          </div>
        </div>
      </template>
      <template v-else-if="reviews.length > 0">
        <ul role="list" class="mx-auto divide-y divide-gray-100">
          <li v-for="review in reviews" :key="review.id" class="flex gap-x-4 py-5">
            <div class="flex-auto">
              <div class="flex items-baseline justify-between gap-x-4">
                <div>
                  <NuxtLink :to="`/movie/${review.id}`" class="mb-2 block font-bold">{{ review.movieName }}</NuxtLink>
                  <button type="button" disabled v-for="i in 5" :class="{ 'mr-1': i < 5 }">
                    <UIcon name="i-heroicons-star-solid" class="block h-6 w-6" :class="[review.rating >= i ? ' text-yellow-400' : ' text-gray-400']" />
                  </button>
                </div>
                <UButton @click="deleteReview(review.id)" icon="i-heroicons-trash" variant="outline" size="md" color="red" :padding="false" class="flex-none" />
              </div>
              <p class="mt-1 text-sm leading-6 text-gray-200">{{ review.content }}</p>
            </div>
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>

<style scoped></style>
