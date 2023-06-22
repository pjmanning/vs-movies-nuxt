<!--
  This example requires some changes to your config:

  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/aspect-ratio'),
    ],
  }
  ```
-->

<script setup lang="ts">
import { RadioGroup, RadioGroupDescription, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue'
import type { Movie } from '@/types'

const route = useRoute()

const {
  pending,
  data: movie,
  error,
} = useFetch<Movie>(`/api/movie/${route.params.id}`, {
  lazy: true,
})
</script>

<template>
  <div class="bg-gray-900">
    <div v-if="pending" class="flex h-screen items-center justify-center">
      <Loading class="h-24 w-24" />
    </div>
    <div v-else-if="error"></div>
    <div v-else class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
      <!-- Movie details -->
      <div class="lg:max-w-lg lg:self-end">
        <nav aria-label="Breadcrumb" class="font-medium text-gray-500">
          {{ new Date(movie?.release_date).getFullYear() }}
          <!-- <ol role="list" class="flex items-center space-x-2">
            <li v-for="(breadcrumb, breadcrumbIdx) in product.breadcrumbs" :key="breadcrumb.id">
              <div class="flex items-center text-sm">
                <a :href="breadcrumb.href" class="font-medium text-gray-500 hover:text-gray-900">{{ breadcrumb.name }}</a>
                <svg v-if="breadcrumbIdx !== product.breadcrumbs.length - 1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="ml-2 h-5 w-5 flex-shrink-0 text-gray-300">
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
              </div>
            </li>
          </ol> -->
        </nav>

        <div class="mt-4">
          <h1 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{{ movie?.title }}</h1>
        </div>

        <section aria-labelledby="information-heading" class="mt-4">
          <h2 id="information-heading" class="sr-only">Movie information</h2>

          <div class="flex items-center">
            <p class="text-lg text-gray-900 sm:text-xl">{{ movie?.vote_average?.toFixed(1) }}</p>

            <div class="ml-4 border-l border-gray-300 pl-4">
              <h2 class="sr-only">Reviews</h2>
              <div class="flex items-center">
                <div>
                  <div class="flex items-center">
                    <UIcon name="i-heroicons-star-solid" v-for="rating in [0, 1, 2, 3, 4]" :key="rating" :class="[movie?.vote_average / 2 > rating ? 'text-yellow-400' : 'text-gray-300', 'h-5 w-5 flex-shrink-0']" aria-hidden="true" />
                  </div>
                  <p class="sr-only">{{ movie?.vote_average / 2 }} out of 5 stars</p>
                </div>
                <p class="ml-2 text-sm text-gray-500">{{ movie?.vote_count }} reviews -</p>
                <button @click="" class="ml-1 text-sm text-gray-500 hover:text-gray-600">Write a review</button>
              </div>
            </div>
          </div>

          <div class="mt-4 space-y-6">
            <p class="text-base text-gray-500">{{ movie?.overview }}</p>
          </div>

          <!-- Status -->
          <!-- <div class="mt-6 flex items-center">
            <UIcon name="i-heroicons-check" class="h-5 w-5 flex-shrink-0 text-green-500" aria-hidden="true" />
            <p class="ml-2 text-sm text-gray-500">{{ movie?.status }}</p>
          </div> -->
        </section>
      </div>

      <!-- Movie image -->
      <div class="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
        <div class="aspect-10/16 overflow-hidden rounded-lg">
          <img v-if="movie?.poster_path" :src="`https://image.tmdb.org/t/p/w500/${movie.poster_path}`" :alt="movie.title" class="mx-auto h-full w-auto rounded object-cover object-center" />
          <img v-else src="https://placehold.co/500x750/374151/FFF?text=No+Image" alt="No Image" class="mx-auto h-full w-full rounded bg-gray-700 object-cover" />
        </div>
      </div>

      <div class="mt-10">
        <button type="submit" class="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50">Add to List</button>
      </div>

      <!-- Movie form -->
      <!-- <div class="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
        <section aria-labelledby="options-heading">
          <h2 id="options-heading" class="sr-only">Product options</h2>

          <form>
            <div class="sm:flex sm:justify-between">
              <RadioGroup v-model="selectedSize">
                <RadioGroupLabel class="block text-sm font-medium text-gray-700">Size</RadioGroupLabel>
                <div class="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <RadioGroupOption as="template" v-for="size in product.sizes" :key="size.name" :value="size" v-slot="{ active, checked }">
                    <div :class="[active ? 'ring-2 ring-indigo-500' : '', 'relative block cursor-pointer rounded-lg border border-gray-300 p-4 focus:outline-none']">
                      <RadioGroupLabel as="p" class="text-base font-medium text-gray-900">{{ size.name }}</RadioGroupLabel>
                      <RadioGroupDescription as="p" class="mt-1 text-sm text-gray-500">{{ size.description }}</RadioGroupDescription>
                      <div :class="[active ? 'border' : 'border-2', checked ? 'border-indigo-500' : 'border-transparent', 'pointer-events-none absolute -inset-px rounded-lg']" aria-hidden="true" />
                    </div>
                  </RadioGroupOption>
                </div>
              </RadioGroup>
            </div>
            <div class="mt-4">
              <a href="#" class="group inline-flex text-sm text-gray-500 hover:text-gray-700">
                <span>What size should I buy?</span>
                <UIcon name="i-heroicons-question-mark-circle-20-solid" class="ml-2 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
              </a>
            </div>
          </form>
        </section>
      </div> -->
    </div>
    <pre class="text-black">{{ movie }}</pre>
  </div>
</template>
