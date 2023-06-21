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
    <p class="mt-1 text-lg font-medium text-gray-100">{{ new Date(movie.release_date).getFullYear() }}</p>

    <div class="flex items-center gap-2 text-sm">
      <div relative="" aspect="11/2" filter-hue-rotate-320deg="" w-20=""><img src="/stars.webp" absolute="" inset-0="" aria-hidden="true" /><img src="/stars-filled.webp" absolute="" inset-0="" aria-hidden="true" style="clip-path: inset(0px 27% 0px 0px)" /></div>
      <div op60="">7.3</div>
    </div>

    <!-- <div class="mt-1 flex">
          <button type="button" v-for="i in 5" :class="{ 'mr-1': i < 5 }" @click="updateRating(movie, i)">
            <StarIcon class="block h-6 w-6" :class="[movie.reviews[0].rating >= i ? ' text-blue-400' : ' text-gray-400']" />
          </button>
          <div class="ml-auto">{{ Number(movie.vote_average / 2).toFixed(2) }}</div>
        </div>

        <button @click="viewReviews(movie.id)" class="mt-1 text-sm text-gray-900">{{ movie.reviews ? movie.reviews.length : 0 }} Reviews</button> -->
  </NuxtLink>
</template>

<style></style>
