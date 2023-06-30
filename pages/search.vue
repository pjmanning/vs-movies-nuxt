<script setup lang="ts">
import type { Movie } from '@/types/Movie'
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'

const error: Ref<Error | null> = ref(null)
onErrorCaptured((e) => {
  error.value = e
})

const isLoading = ref(false)
const isResults = ref(true)
const movies = ref<Movie[]>([])
const sortedMovies = computed(() => {
  if (selectedSort.value.val === 'primary_release_date.asc') {
    return movies.value.sort((a, b) => b.release_date.localeCompare(a.release_date))
  } else if (selectedSort.value.val === 'vote_average.asc') {
    return movies.value.sort((a, b) => b.vote_average - a.vote_average)
  } else if (selectedSort.value.val === 'title') {
    return movies.value.sort((a, b) => a.title.localeCompare(b.title))
  } else {
    return movies.value
  }
})
const filteredMovies = computed(() => {
  const moviesWithRating = sortedMovies.value.map((movie) => {
    const movieIndex = movies.value.findIndex((m) => m.id === movie.id)
    if (movieIndex !== -1) {
      return { ...movie, rating: movies.value[movieIndex].vote_average }
    } else {
      return movie
    }
  })

  if (selectedGenres.value.length === 0) {
    return moviesWithRating
  } else {
    return moviesWithRating.filter((item) => item.genre_ids.some((genre) => selectedGenres.value.includes(genre)))
  }
})

const numberOfPages = ref(0)
const numberOfMovies = ref(0)
const page = ref(1)
const query = ref('')
const year = ref(null)

interface SortOption {
  name: String | null
  val: String | null
}
const sortOptions = [
  { name: 'Best Rating', val: 'vote_average.asc' },
  { name: 'Release Year', val: 'primary_release_date.asc' },
  { name: 'Title', val: 'title' },
]
const selectedSort = ref<SortOption>({ name: null, val: null })
const genres = [
  { value: 28, label: 'Action' },
  { value: 12, label: 'Adventure' },
  { value: 16, label: 'Animation' },
  { value: 35, label: 'Comedy' },
  { value: 80, label: 'Crime' },
  { value: 99, label: 'Documentary' },
  { value: 18, label: 'Drama' },
  { value: 10751, label: 'Family' },
  { value: 14, label: 'Fantasy' },
  { value: 36, label: 'History' },
  { value: 27, label: 'Horror' },
  { value: 10402, label: 'Music' },
  { value: 9648, label: 'Mystery' },
  { value: 10749, label: 'Romance' },
  { value: 878, label: 'Science Fiction' },
  { value: 10770, label: 'TV Movie' },
  { value: 53, label: 'Thriller' },
  { value: 10752, label: 'War' },
  { value: 37, label: 'Western' },
]
const selectedGenres = ref<number[]>([])

async function searchMovies() {
  isLoading.value = true

  const { pending, data, error } = await useFetch<any>(`/api/search?query=${query.value}&year=${year.value}&page=${page.value}&sort=${selectedSort.value.val}&genres=${selectedGenres.value}`, {
    lazy: true,
  })

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

function clearFilters() {
  selectedSort.value = { name: null, val: null }
  selectedGenres.value = []
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
      <div class="z-50 mt-4 px-4">
        <!-- Filters -->
        <Disclosure as="section" aria-labelledby="filter-heading" class="grid items-center border-b border-t border-gray-600">
          <h2 id="filter-heading" class="sr-only">Filters</h2>
          <div class="relative col-start-1 row-start-1 py-4">
            <div class="mx-auto flex max-w-7xl space-x-6 divide-x divide-gray-100 px-4 text-sm sm:px-6 lg:px-8">
              <div>
                <DisclosureButton class="group flex items-center font-medium text-gray-300">
                  <UIcon name="i-heroicons-funnel" class="mr-2 h-5 w-5 flex-none text-gray-300 group-hover:text-gray-200" aria-hidden="true" />
                  <span v-if="selectedGenres.length > 0">{{ selectedGenres.length }} Genres</span>
                  <span v-else>Filter</span>
                </DisclosureButton>
              </div>
              <div v-if="selectedSort.val !== null || selectedGenres.length > 0" class="pl-6">
                <button @click="clearFilters" type="button" class="text-gray-300">Clear all</button>
              </div>
            </div>
          </div>
          <DisclosurePanel class="border-t border-gray-500 bg-gray-900 py-10">
            <div class="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 px-4 text-sm sm:px-6 md:gap-x-6 lg:px-8">
              <div class="grid auto-rows-min grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-6">
                <fieldset>
                  <div class="space-y-6 pt-6 sm:space-y-4 sm:pt-4">
                    <div v-for="(option, optionIdx) in [genres[0], genres[1], genres[2], genres[3], genres[4]]" :key="option.value" class="flex items-center text-base sm:text-sm">
                      <input v-model="selectedGenres" :id="option.value.toString()" name="price[]" :value="option.value" type="checkbox" class="h-4 w-4 flex-shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                      <label :for="`price-${optionIdx}`" class="ml-3 min-w-0 flex-1 text-gray-200">{{ option.label }}</label>
                    </div>
                  </div>
                </fieldset>
                <fieldset>
                  <div class="space-y-6 pt-6 sm:space-y-4 sm:pt-4">
                    <div v-for="(option, optionIdx) in [genres[5], genres[6], genres[7], genres[8], genres[9]]" :key="option.value" class="flex items-center text-base sm:text-sm">
                      <input v-model="selectedGenres" :id="option.value.toString()" name="color[]" :value="option.value" type="checkbox" class="h-4 w-4 flex-shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                      <label :for="`color-${optionIdx}`" class="ml-3 min-w-0 flex-1 text-gray-200">{{ option.label }}</label>
                    </div>
                  </div>
                </fieldset>
              </div>
              <div class="grid auto-rows-min grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-6">
                <fieldset>
                  <div class="space-y-6 pt-6 sm:space-y-4 sm:pt-4">
                    <div v-for="(option, optionIdx) in [genres[10], genres[11], genres[12], genres[13], genres[14]]" :key="option.value" class="flex items-center text-base sm:text-sm">
                      <input v-model="selectedGenres" :id="option.value.toString()" name="size[]" :value="option.value" type="checkbox" class="h-4 w-4 flex-shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                      <label :for="`size-${optionIdx}`" class="ml-3 min-w-0 flex-1 text-gray-200">{{ option.label }}</label>
                    </div>
                  </div>
                </fieldset>
                <fieldset>
                  <div class="space-y-6 pt-6 sm:space-y-4 sm:pt-4">
                    <div v-for="(option, optionIdx) in [genres[15], genres[16], genres[17], genres[18]]" :key="option.value" class="flex items-center text-base sm:text-sm">
                      <input v-model="selectedGenres" :id="option.value.toString()" name="category[]" :value="option.value" type="checkbox" class="h-4 w-4 flex-shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                      <label :for="`category-${optionIdx}`" class="ml-3 min-w-0 flex-1 text-gray-200">{{ option.label }}</label>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          </DisclosurePanel>
          <div class="col-start-1 row-start-1 py-4">
            <div class="mx-auto flex max-w-7xl justify-end px-4 sm:px-6 lg:px-8">
              <Menu as="div" class="relative inline-block">
                <div class="flex">
                  <MenuButton class="group inline-flex justify-center text-sm font-medium text-gray-300 hover:text-gray-100">
                    <span v-if="!selectedSort.name">Sort</span>
                    <span v-else>{{ selectedSort.name }}</span>
                    <UIcon name="i-heroicons-chevron-down" class="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-300 group-hover:text-gray-200" aria-hidden="true" />
                  </MenuButton>
                </div>

                <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                  <MenuItems class="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div class="py-1">
                      <MenuItem v-for="option in sortOptions" :key="option.name" v-slot="{ active }">
                        <button @click="selectedSort = option" :class="[selectedSort.name === option.name ? 'font-medium text-gray-900' : 'text-gray-500', active ? 'bg-gray-100' : '', 'block w-full px-4 py-2 text-left text-sm']">{{ option.name }}</button>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </transition>
              </Menu>
            </div>
          </div>
        </Disclosure>
      </div>

      <MovieList :movies="filteredMovies" />
      <div class="my-20 flex justify-center">
        <UPagination v-model="page" :page-count="20" :total="numberOfMovies" />
      </div>
    </ul>
  </div>
</template>
