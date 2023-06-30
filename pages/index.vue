<script setup lang="ts">
import type { Movie } from '@/types'
import { useMovieStore } from '@/stores/movies'

const movieStore = useMovieStore()
const movies = movieStore.movies
let movieIds = movies.map((movie: Movie) => movie.id)
const { pending: similarPending, data: similar, error: similarError } = useLazyFetch(`/api/similar?ids=${movieIds}`)
const { pending: popularPending, data: popular, error: errorPopular } = useLazyFetch<Movie[]>('/api/movies?type=popular')
const { pending: top_ratedPending, data: topRated, error: errorTopRated } = useLazyFetch<Movie[]>('/api/movies?type=top_rated')
const { pending: upcomingPending, data: upcoming, error: errorUpcoming } = useLazyFetch<Movie[]>('/api/movies?type=upcoming')
const { pending: now_playingPending, data: nowPlaying, error: errorNowPlaying } = useFetch<Movie[]>('/api/movies?type=now_playing')

const sections = ref([
  { type: 'movie', title: 'For You', pending: similarPending, movies: similar },
  { type: 'movie', title: 'Popular Movies', pending: popularPending, movies: popular },
  { type: 'movie', title: 'Top Rated Movies', pending: top_ratedPending, movies: topRated },
  { type: 'movie', title: 'Upcoming Movies', pending: upcomingPending, movies: upcoming },
  { type: 'movie', title: 'Now Playing Movies', pending: now_playingPending, movies: nowPlaying },
])
</script>

<template>
  <div v-if="similarPending || top_ratedPending || upcomingPending || now_playingPending" class="flex h-screen w-screen items-center justify-center">
    <Loading class="h-24 w-24" />
  </div>
  <div v-else-if="similarError || errorTopRated || errorUpcoming || errorNowPlaying">Error</div>
  <div v-else class="w-screen overflow-hidden pt-4">
    <div v-for="category in sections">
      <div class="flex items-center px-10 py-3">
        <div class="text-2xl">{{ category.title }}</div>
        <div class="flex-auto"></div>
        <!-- <NuxtLink :href="`/movies/category/${category.title}`" class="" n-link="">Explore more</NuxtLink> -->
      </div>

      <div class="relative">
        <div class="overflow-y-auto">
          <ul class="flex w-max gap-2 p-2 px-4 sm:px-10">
            <Loading v-if="category.pending" class="my-10 h-20 w-20" />
            <div v-else-if="category.title === 'For You' && category.movies?.length === 0">
              <NuxtLink to="/search" class="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none">
                <UIcon name="i-heroicons-magnifying-glass" class="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                <span class="mt-2 block text-sm font-semibold text-gray-100">Rate Movies to Find Movies For You</span>
              </NuxtLink>
            </div>
            <template v-else>
              <MovieCard v-for="movie in category.movies" :key="movie.id" :movie="movie" class="w-40 flex-1 pb-2 md:w-60" />
            </template>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
