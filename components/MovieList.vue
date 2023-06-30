<script setup lang="ts">
import { Movie } from '~/types'
import { useMovieStore } from '@/stores/movies'

const props = defineProps({
  movies: {
    type: (Array as PropType<Movie[]>) || null,
    required: true,
  },
  listId: {
    type: Number,
    required: false,
  },
})

const filteredMovies = computed(() => {
  return props.movies
})

function removeFromList(movie: Movie) {
  const movieStore = useMovieStore()
  const listIndex = movieStore.lists.findIndex((list) => list.id === props.listId)
  const movieIndex = movieStore.lists[listIndex].movies.findIndex((m) => m.id === movie.id)
  movieStore.lists[listIndex].movies.splice(movieIndex, 1)
}
</script>

<template>
  <div class="my-10">
    <ul class="grid grid-cols-2 gap-x-6 gap-y-10 px-4 lg:grid-cols-3 xl:grid-cols-5 xl:gap-x-8">
      <li v-for="movie in filteredMovies" :key="movie.id">
        <MovieCard :movie="movie" />
        <UButton v-if="listId" label="Remove from List" block @click="removeFromList(movie)" />
      </li>
    </ul>
  </div>
</template>

<style></style>
