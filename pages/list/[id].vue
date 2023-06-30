<script setup lang="ts">
import { useMovieStore } from '@/stores/movies'

const movieStore = useMovieStore()
const route = useRoute()
const lists = movieStore.lists

const list = computed(() => {
  return lists.find((list) => list.id === Number(route.params.id))
})
</script>

<template>
  <div class="mx-auto h-screen max-w-7xl px-4 py-10">
    <h1 class="text-2xl font-bold">{{ list?.name }}</h1>

    <template v-if="list?.movies.length === 0">
      <div class="-mt-24 flex h-full flex-col place-content-center text-center">
        <UIcon name="i-heroicons-list-bullet" class="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
        <h3 class="mt-2 text-sm font-semibold text-gray-100">No Movies</h3>
        <p class="mt-1 text-sm text-gray-400">Search for movies to add to your lists.</p>
        <div class="mt-6">
          <NuxtLink to="/search" class="inline-flex cursor-pointer items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            <UIcon name="i-heroicons-magnifying-glass-20-solid" class="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Search Now
          </NuxtLink>
        </div>
      </div>
    </template>
    <div v-else-if="list?.movies !== undefined && list?.movies.length > 0" class="mb-20">
      <MovieList :movies="list!.movies" />
    </div>
  </div>
</template>

<style scoped></style>
