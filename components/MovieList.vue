<script setup lang="ts">
import { Movie } from '~/types'

const props = defineProps({
  movies: {
    type: (Array as PropType<Movie[]>) || null,
    required: true,
  },
})

const filteredMovies = computed(() => {
  return props.movies
})
</script>

<template>
  <div class="my-10">
    <ul class="grid grid-cols-2 gap-x-6 gap-y-10 px-4 lg:grid-cols-3 xl:grid-cols-5 xl:gap-x-8">
      <li v-for="movie in filteredMovies" :key="movie.id">
        <MovieCard :movie="movie" />
        <!-- <div class="aspect-h-3 aspect-w-2 w-full overflow-hidden rounded-lg bg-gray-200">
          <img :src="`https://image.tmdb.org/t/p/w500/${item.poster_path}`" :alt="item.title" class="h-full w-full object-cover object-center group-hover:opacity-75" />
        </div>
        <h3 class="mt-4 text-sm text-gray-700">
          {{ item.title }}
        </h3>

        <p class="mt-1 text-lg font-medium text-gray-900">
          {{ new Date(item.release_date).getFullYear() }}
        </p>

        <div class="mt-1 flex">
          <button type="button" v-for="i in 5" :class="{ 'mr-1': i < 5 }" @click="updateRating(item, i)">
            <StarIcon class="block h-6 w-6" :class="[item.reviews[0].rating >= i ? ' text-blue-400' : ' text-gray-400']" />
          </button>
          <div class="ml-auto">{{ Number(item.vote_average / 2).toFixed(2) }}</div>
        </div>

        <button @click="viewReviews(item.id)" class="mt-1 text-sm text-gray-900">{{ item.reviews ? item.reviews.length : 0 }} Reviews</button> -->
      </li>
      <!-- <p v-show="fetchingData">Fetching more...</p> -->
    </ul>
  </div>
</template>

<style></style>
