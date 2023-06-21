<script setup lang="ts">
import type { Movie } from '@/types/Movie'

const error: Ref<Error | null> = ref(null)
onErrorCaptured((e) => {
  error.value = e
})

const isLoading = ref(false)
const isResults = ref(true)
const movies = ref<Movie[]>([])
const numberOfPages = ref(0)
const numberOfMovies = ref(0)
const page = ref(1)
const query = ref('')
const year = ref(null)

async function searchMovies() {
  isLoading.value = true

  const { pending, data, error } = await useFetch(`/api/search?query=${query.value}&year=${year.value}&page=${page.value}`, {
    lazy: true,
  })

  console.log(pending.value)
  console.log(data.value)
  console.log(error.value)

  if (error.value) {
    isLoading.value = false
    console.error(error.value)
    return
  }

  if (data.value.totalMovies === 0) {
    isResults.value = false
    isLoading.value = false
    return
  }

  numberOfMovies.value = data.value.totalMovies
  numberOfPages.value = data.value.totalPages
  movies.value = data.value.results
  isLoading.value = pending.value
}

function newSearch() {
  page.value = 1
  isResults.value = true
  movies.value = []
  numberOfPages.value = 0
  numberOfMovies.value = 0
  searchMovies()
}

watch(
  () => page.value,
  (newValue, oldValue) => {
    movies.value = []
    numberOfPages.value = 0
    numberOfMovies.value = 0
    searchMovies()
    window.scrollTo(0, 0)
  }
)
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-7xl flex-col">
    <div class="z-50 mt-4 flex flex-col px-4 sm:mt-20 sm:flex-row">
      <div class="mr-4 w-full">
        <UInput v-model="query" name="q" :loading="isLoading" placeholder="Search for movies..." icon="i-heroicons-magnifying-glass-20-solid" :ui="{ icon: { trailing: { pointer: '' } } }" class="h-12">
          <template #trailing>
            <UButton v-show="query !== ''" color="gray" variant="link" icon="i-heroicons-x-mark-20-solid" :padded="false" @click="query = ''" />
          </template>
        </UInput>
      </div>

      <UInput v-model="year" type="number" min="1900" max="2023" placeholder="Release Year" class="mt-4 h-12 w-full sm:mt-0 sm:w-32"></UInput>

      <div class="mt-4 w-full sm:ml-4 sm:mt-0 sm:w-40">
        <UButton color="primary" variant="solid" size="xl" block :loading="isLoading" :disabled="query === '' && year == null" class="h-12" @click="newSearch">Search</UButton>
      </div>
    </div>

    <div v-if="isLoading" class="flex flex-auto items-center justify-center">
      <Loading class="-mt-20 h-20 w-20" />
    </div>
    <template v-else-if="!isResults">
      <div class="z-0 -mt-40 flex h-full w-full flex-auto flex-col items-center justify-center text-center">
        <UIcon name="i-heroicons-film" class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-semibold text-gray-200">No movies :(</h3>
        <p class="mt-1 text-sm text-gray-300">Sorry, try your search again.</p>
      </div>
    </template>
    <template v-else-if="movies.length < 1">
      <div class="z-0 -mt-40 flex h-full w-full flex-auto flex-col items-center justify-center text-center">
        <UIcon name="i-heroicons-film" class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-semibold text-gray-200">Search for movies</h3>
        <p class="mt-1 text-sm text-gray-300">Get started by searching by title or release year.</p>
      </div>
    </template>
    <ul v-else>
      <MovieList :movies="movies" />
      <div class="my-20 flex justify-center">
        <UPagination v-model="page" :page-count="20" :total="numberOfMovies" />
      </div>
      <!-- <div>
          <div v-if="error">{{ error }}</div>
          <Suspense>
            <WatchList :header="`Search results for: ${route.query.title} ${route.query.year ? ' in ' + route.query.year : ''}`" :api="`search/movie`" :params="`&query=${title}${year ? `&primary_release_year=${year}` : ''}`" />

            <template #fallback>
              <Loading class="mt-44 h-20 w-20" />
            </template>
          </Suspense>
        </div> -->
    </ul>
  </div>
</template>
