<script setup lang="ts">
const {
  pending: popularPending,
  data: popular,
  error: errorPopular,
} = useFetch('/api/movies?type=popular', {
  lazy: true,
})
const {
  pending: top_ratedPending,
  data: topRated,
  error: errorTopRated,
} = useFetch('/api/movies?type=top_rated', {
  lazy: true,
})
const {
  pending: upcomingPending,
  data: upcoming,
  error: errorUpcoming,
} = useFetch('/api/movies?type=upcoming', {
  lazy: true,
})
const {
  pending: now_playingPending,
  data: nowPlaying,
  error: errorNowPlaying,
} = useFetch('/api/movies?type=now_playing', {
  lazy: true,
})

const sections = [
  { type: 'movie', title: 'Popular Movies', query: 'popular', pending: popularPending.value, movies: popular.value },
  { type: 'movie', title: 'Top Rated Movies', query: 'top_rated', pending: top_ratedPending.value, movies: topRated.value },
  { type: 'movie', title: 'Upcoming Movies', query: 'upcoming', pending: upcomingPending.value, movies: upcoming.value },
  { type: 'movie', title: 'Now Playing Movies', query: 'now_playing', pending: now_playingPending.value, movies: nowPlaying.value },
]
</script>

<template>
  <div v-if="popularPending || top_ratedPending || upcomingPending || now_playingPending" class="flex h-screen w-screen items-center justify-center">
    <Loading class="h-24 w-24" />
  </div>
  <div v-else-if="errorPopular || errorTopRated || errorUpcoming || errorNowPlaying">Error</div>
  <div v-else class="pt-4">
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
            <NuxtLink v-else v-for="movie in category.movies?.results" :key="movie.id" :to="`/movie/${movie.id}`" class="w-40 flex-1 pb-2 md:w-60">
              <MovieCard :movie="movie" />
            </NuxtLink>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
