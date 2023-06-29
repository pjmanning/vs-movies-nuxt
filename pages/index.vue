<script setup lang="ts">
import type { Movie } from '@/types'
import { useMovieStore } from '@/stores/movies'

const movieStore = useMovieStore()
const movies = movieStore.movies
let movieIds = movies.map((movie: Movie) => movie.id)
const {
  pending: similarPending,
  data: similar,
  error: similarError,
} = useFetch(`/api/similar?ids=${movieIds}`, {
  lazy: true,
})
const {
  pending: popularPending,
  data: popular,
  error: errorPopular,
} = useFetch<Movie[]>('/api/movies?type=popular', {
  lazy: true,
})
const {
  pending: top_ratedPending,
  data: topRated,
  error: errorTopRated,
} = useFetch<Movie[]>('/api/movies?type=top_rated', {
  lazy: true,
})
const {
  pending: upcomingPending,
  data: upcoming,
  error: errorUpcoming,
} = useFetch<Movie[]>('/api/movies?type=upcoming', {
  lazy: true,
})
const {
  pending: now_playingPending,
  data: nowPlaying,
  error: errorNowPlaying,
} = useFetch<Movie[]>('/api/movies?type=now_playing', {
  lazy: true,
})

const sections = [
  { type: 'movie', title: 'For You', pending: similarPending.value, movies: similar.value },
  { type: 'movie', title: 'Popular Movies', pending: popularPending.value, movies: popular.value },
  { type: 'movie', title: 'Top Rated Movies', pending: top_ratedPending.value, movies: topRated.value },
  { type: 'movie', title: 'Upcoming Movies', pending: upcomingPending.value, movies: upcoming.value },
  { type: 'movie', title: 'Now Playing Movies', pending: now_playingPending.value, movies: nowPlaying.value },
]
</script>

<template>
  <div v-if="similarPending || popularPending || top_ratedPending || upcomingPending || now_playingPending" class="flex h-screen w-screen items-center justify-center">
    <Loading class="h-24 w-24" />
  </div>
  <div v-else-if="similarError || errorPopular || errorTopRated || errorUpcoming || errorNowPlaying">Error</div>
  <div v-else class="w-screen overflow-hidden pt-4">
    <div v-for="category in sections">
      <div class="flex items-center px-10 py-3">
        <div class="text-2xl">{{ category.title }}</div>
        <div class="flex-auto"></div>
        <!-- <NuxtLink :href="`/movies/category/${category.title}`" class="" n-link="">Explore more</NuxtLink> -->
      </div>

      <div class="relative">
        <div class="overflow-y-auto">
          <ul class="flex w-max gap-2 p-2 px-10">
            <Loading v-if="!category.movies" class="my-10 h-20 w-20" />
            <div v-if="category.title === 'For You' && !category.movies?.results">
              <NuxtLink to="/search" class="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none">
                <UIcon name="i-heroicons-magnifying-glass" class="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                <span class="mt-2 block text-sm font-semibold text-gray-100">Rate Movies to Find Movies For You</span>
              </NuxtLink>
            </div>
            <NuxtLink v-else v-for="movie in category.movies?.results" :key="movie.id" :to="`/movie/${movie.id}`" class="w-40 flex-1 pb-2 md:w-60">
              <MovieCard :movie="movie" />
            </NuxtLink>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
