<script setup lang="ts">
import { Movie } from '@/types'

defineProps({
  movie: {
    type: Object as PropType<Movie>,
    required: true,
  },
})
</script>

<template>
  <NuxtLink :to="`/movie/${movie.id}`" class="w-40 flex-1 pb-2 md:w-60">
    <div class="aspect-10/16 duration-400 block p-1 transition hover:z-10 hover:scale-105">
      <template v-if="movie.poster_path">
        <img :src="`https://image.tmdb.org/t/p/w500/${movie.poster_path}`" width="400" height="600" :alt="movie.title" class="h-full w-full bg-gray-600 object-cover" />
      </template>
      <template v-else>
        <img src="https://placehold.co/500x750/374151/FFF?text=No+Image" width="400" height="600" alt="No Image" class="h-full w-full bg-gray-700 object-cover" />
      </template>
    </div>
    <h3 class="mt-2">{{ movie.title }}</h3>

    <div>
      <div class="mt-1 flex items-center">
        <UIcon name="i-heroicons-star-solid" v-for="rating in [0, 1, 2, 3, 4]" :key="rating" :class="[movie?.vote_average / 2 > rating ? 'text-yellow-400' : 'text-gray-300', 'h-5 w-5 flex-shrink-0']" aria-hidden="true" />
        <p class="ml-2 text-sm text-gray-300">{{ movie?.vote_average }}</p>
      </div>
      <p class="sr-only">{{ movie?.vote_average / 2 }} out of 5 stars</p>
    </div>

    <p class="mt-1 text-lg font-medium text-gray-100">{{ new Date(movie.release_date).getFullYear() }}</p>
  </NuxtLink>
</template>

<style></style>
