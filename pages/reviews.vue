<script setup lang="ts">
import type { Review } from '@/types'
import { useMovieStore } from '~/stores/movies'

const movieStore = useMovieStore()
const reviews: Review[] = movieStore.reviews
</script>

<template>
  <div class="mx-auto h-screen max-w-7xl px-4 py-10">
    <h1 class="text-2xl font-bold">Your Reviews</h1>
    <div v-if="reviews.length === 0" class="-mt-20 flex h-full flex-col place-content-center text-center">
      <UIcon name="i-heroicons-film" class="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
      <h3 class="mt-2 text-sm font-semibold text-gray-100">No lists</h3>
      <p class="mt-1 text-sm text-gray-400">Get started by creating a new list.</p>
      <div class="mt-6">
        <button @click="isListModalOpen = true" type="button" class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          <UIcon name="i-heroicons-plus-20-solid" class="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          New List
        </button>
      </div>
    </div>
    <div v-else-if="reviews.length > 0" class="my-10">
      <ul role="list" class="divide-y divide-gray-100">
        <li v-for="review in reviews" :key="review.id" class="flex gap-x-4 py-5">
          <div class="flex-auto">
            <div class="flex items-baseline justify-between gap-x-4">
              <!-- <FormKit -->
              <p class="text-sm font-semibold leading-6 text-white">{{ review.rating }}</p>
              <p class="flex-none text-xs text-gray-200">Delete</p>
            </div>
            <p class="mt-1 text-sm leading-6 text-gray-200">{{ review.content }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
