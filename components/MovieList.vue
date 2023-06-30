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
      </li>
    </ul>
  </div>
</template>

<style></style>
