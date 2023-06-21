<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { Movie } from '@/types'
import { useInfiniteScroll } from '@vueuse/core'
import { Dialog, DialogPanel, DialogTitle, Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems, Popover, PopoverButton, PopoverGroup, PopoverPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
// import { StarIcon } from '@heroicons/vue/24/solid'
// import { XMarkIcon } from '@heroicons/vue/24/outline'
// import { ChevronDownIcon } from '@heroicons/vue/20/solid'
// import { useMovieStore } from '@/stores/movies'

const props = defineProps({
  header: {
    type: String,
    required: true,
  },
  subheader: {
    type: String,
    required: false,
  },
  api: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: false,
    default: 'movie',
  },
  params: {
    type: String,
    required: false,
  },
})

const listEl = ref(null)
const error: Ref<Error | null> = ref(null)
const page = ref(1)
const items = ref<Movie[]>(await getItems())
const fetchingData = ref(false)

async function getItems() {
  try {
    console.log('get items')
    const res = await fetch(`https://api.themoviedb.org/3/${props.api}?api_key=e710ef86fb9f64ca848fde2ace087208&page=${page.value}${props.params ?? ''}`)
    const items = await res.json()
    page.value = items.page + 1
    return items.results
  } catch (e) {
    error.value = e as Error
  }
}

async function getItemsOnScroll() {
  console.log('get new items')
  fetchingData.value = true
  const newItems = await getItems()
  items.value = [...items.value, ...newItems]
  fetchingData.value = false
}

useInfiniteScroll(
  listEl,
  async () => {
    if (selectedFilters.value.length > 0 || selectedSort.value !== 'rating') {
      return
    }
    await getItemsOnScroll()
  },
  {
    distance: 10,
  }
)

const sortOptions = [
  { name: 'Best Rating', val: 'rating' },
  { name: 'Release Year', val: 'year' },
  { name: 'Title', val: 'title' },
]
const movieGenres = [
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
const filters = [
  {
    id: 'genre',
    name: 'Genre',
    options: [
      { id: 28, name: 'Action' },
      { id: 12, name: 'Adventure' },
      { id: 16, name: 'Animation' },
      { id: 35, name: 'Comedy' },
      { id: 80, name: 'Crime' },
      { id: 99, name: 'Documentary' },
      { id: 18, name: 'Drama' },
      { id: 10751, name: 'Family' },
      { id: 14, name: 'Fantasy' },
      { id: 36, name: 'History' },
      { id: 27, name: 'Horror' },
      { id: 10402, name: 'Music' },
      { id: 9648, name: 'Mystery' },
      { id: 10749, name: 'Romance' },
      { id: 878, name: 'Science Fiction' },
      { id: 10770, name: 'TV Movie' },
      { id: 53, name: 'Thriller' },
      { id: 10752, name: 'War' },
      { id: 37, name: 'Western' },
    ],
  },
]

const open = ref(false)

const selectedSort = ref('rating')
const sortedMovies = computed(() => {
  if (selectedSort.value === 'year') {
    return items.value.sort((a, b) => b.release_date.localeCompare(a.release_date))
  } else if (selectedSort.value === 'rating') {
    return items.value.sort((a, b) => b.vote_average - a.vote_average)
  } else if (selectedSort.value === 'title') {
    return items.value.sort((a, b) => a.title.localeCompare(b.title))
  } else {
    return items.value
  }
})

const selectedFilters = ref<number[]>([])
const filteredItems = computed(() => {
  const moviesWithRating = sortedMovies.value.map((movie) => {
    const movieIndex = movieStore.movies.findIndex((m) => m.id === movie.id)
    if (movieIndex !== -1) {
      return { ...movie, rating: movieStore.movies[movieIndex].rating }
    } else {
      return movie
    }
  })

  if (selectedFilters.value.length === 0) {
    return moviesWithRating
  } else {
    return moviesWithRating.filter((item) => item.genre_ids.some((genre) => selectedFilters.value.includes(genre)))
  }
})

////////// RATINGS //////////
const movieStore = useMovieStore()
const updateRating = (movie: Movie, rating: number) => {
  const movieIndex = movieStore.movies.findIndex((m) => m.id === movie.id)
  if (movieIndex !== -1) {
    // edit the rating in the reviews array
    movieStore.movies[movieIndex].reviews = movieStore.movies[movieIndex].reviews.map((review) => {
      if (review.author === 'You') {
        return { ...review, rating: rating }
      } else {
        return review
      }
    })
  } else {
    movieStore.movies.push({ ...movie, reviews: [{ id: Math.floor(Math.random() * 1000001), title: '', content: '', rating: rating, author: '', date: new Date() }] })
  }
}

////////// REVIEW MODAL //////////
const openReviewModal = ref(false)
const selectedMovie = ref({} as Movie)
const reviewName = ref(null)
const reviewContent = ref(null)
function viewReviews(id: number) {
  openReviewModal.value = true
  selectedMovie.value = filteredItems.value.find((movie) => movie.id === id) as Movie
}
// function addReview(id: number) {
//   openReviewModal.value = false
//   const movieIndex = movieStore.movies.findIndex((m) => m.id === id)
//   // add review to movie reviews array
//   if (movieIndex !== -1) {
//     movieStore.movies[movieIndex].reviews.push({
//       name: reviewName.value,
//       content: reviewContent.value,
//     })
//   } else {
//     movieStore.movies.push({
//       id,
//       reviews: [
//         {
//           name: reviewName.value,
//           content: reviewContent.value,
//         },
//       ],
//     })
//   }
//   reviewName.value = null
//   reviewContent.value = null
// }
</script>

<template>
  <TransitionRoot as="template" :show="openReviewModal">
    <Dialog as="div" class="relative z-10" @close="openReviewModal = false">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <div class="flex justify-between">
                      <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">{{ selectedMovie.title }}</DialogTitle>
                      <p>{{ selectedMovie.reviews ? selectedMovie.reviews.length : 0 }} reviews</p>
                    </div>

                    <div class="mt-2 bg-white">
                      <div>
                        <h2 id="reviews-heading" class="sr-only">Reviews</h2>

                        <div class="space-y-10">
                          <div v-for="review in selectedMovie.reviews" :key="review.id" class="flex flex-col sm:flex-row">
                            <div class="order-2 mt-6 sm:ml-16 sm:mt-0">
                              <h3 class="text-sm font-medium text-gray-900">{{ review.title }}</h3>
                              <p class="sr-only">{{ review.rating }} out of 5 stars</p>

                              <div class="mt-3 space-y-6 text-sm text-gray-600" v-html="review.content" />
                            </div>

                            <div class="order-1 flex items-center sm:flex-col sm:items-start">
                              <div class="ml-4 sm:ml-0 sm:mt-4">
                                <p class="text-sm font-medium text-gray-900">{{ review.author }}</p>
                                <div class="mt-2 flex items-center">
                                  <StarIcon v-for="rating in [0, 1, 2, 3, 4]" :key="rating" :class="[review.rating > rating ? 'text-gray-900' : 'text-gray-200', 'h-5 w-5 flex-shrink-0']" aria-hidden="true" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {{ selectedMovie }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6">
                <div>
                  <label for="comment" class="block text-sm font-medium leading-6 text-gray-900">Add your review</label>
                  <div class="mt-2">
                    <input v-model="reviewName" type="text" name="name" id="name" class="mb-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Name" />
                    <textarea v-model="reviewContent" rows="4" name="comment" id="comment" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                  </div>
                </div>
                <button type="button" class="float-right my-2 inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto" @click="addReview(movie.id)">Write Review</button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

  <div ref="listEl" class="-mt-16 h-screen overflow-y-auto bg-gray-50">
    <!-- Mobile filter dialog -->
    <TransitionRoot as="template" :show="open">
      <Dialog as="div" class="relative z-40 sm:hidden" @close="open = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 z-40 flex">
          <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0" leave-to="translate-x-full">
            <DialogPanel class="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
              <div class="flex items-center justify-between px-4">
                <h2 class="text-lg font-medium text-gray-900">Filters</h2>
                <button type="button" class="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" @click="open = false">
                  <span class="sr-only">Close menu</span>
                  <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <!-- Filters -->
              <form class="mt-4">
                <Disclosure as="div" v-for="section in filters" :key="section.name" class="border-t border-gray-200 px-4 py-6" v-slot="{ open }">
                  <h3 class="-mx-2 -my-3 flow-root">
                    <DisclosureButton class="flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400">
                      <span class="font-medium text-gray-900">{{ section.name }}</span>
                      <span class="ml-6 flex items-center">
                        <ChevronDownIcon :class="[open ? '-rotate-180' : 'rotate-0', 'h-5 w-5 transform']" aria-hidden="true" />
                      </span>
                    </DisclosureButton>
                  </h3>
                  <DisclosurePanel class="pt-6">
                    <div class="space-y-6">
                      <div v-for="(option, optionIdx) in section.options" :key="option.id" class="flex items-center">
                        <input :id="`filter-mobile-${section.id}-${optionIdx}`" :name="`${section.id}[]`" :value="option.id" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                        <label :for="`filter-mobile-${section.id}-${optionIdx}`" class="ml-3 text-sm text-gray-500">{{ option.name }}</label>
                      </div>
                    </div>
                  </DisclosurePanel>
                </Disclosure>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <div class="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:max-w-[1600px] lg:px-8">
      <div class="pb-12 pt-32">
        <h1 class="text-4xl font-bold tracking-tight text-gray-900">{{ header }}</h1>
        <p class="mx-auto mt-4 max-w-3xl text-base text-gray-500">{{ subheader }}</p>
      </div>

      <section aria-labelledby="filter-heading" class="border-t border-gray-200 py-6">
        <h2 id="filter-heading" class="sr-only">Product filters</h2>

        <div class="flex items-center justify-between">
          <Menu as="div" class="relative inline-block text-left">
            <div>
              <MenuButton class="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                Sort
                <ChevronDownIcon class="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
              </MenuButton>
            </div>

            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
              <MenuItems class="absolute left-0 z-10 mt-2 w-40 origin-top-left rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div class="py-1">
                  <MenuItem v-for="option in sortOptions" :key="option.val" v-slot="{ active }">
                    <button @click="selectedSort = option.val" :class="[selectedSort === option.val ? 'bg-gray-100' : '', 'block w-full px-4 py-2 text-left text-sm font-medium text-gray-900']">{{ option.name }}</button>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>

          <button type="button" class="inline-block text-sm font-medium text-gray-700 hover:text-gray-900 sm:hidden" @click="open = true">Filters</button>

          <PopoverGroup class="hidden sm:flex sm:items-baseline sm:space-x-8">
            <Popover as="div" v-for="(section, sectionIdx) in filters" :key="section.name" :id="`desktop-menu-${sectionIdx}`" class="relative inline-block text-left">
              <div class="flex items-center">
                <button v-if="selectedFilters.length > 0" @click="selectedFilters = []" class="mr-1 flex text-red-600"><XMarkIcon class="h-5 w-5" /></button>
                <PopoverButton class="group inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  <span>{{ section.name }}</span>
                  <span v-if="selectedFilters.length > 0" class="ml-1.5 rounded bg-gray-200 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-gray-700">{{ selectedFilters.length }}</span>
                  <ChevronDownIcon class="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                </PopoverButton>
              </div>

              <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                <PopoverPanel class="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <FormKit v-model="selectedFilters" type="checkbox" :options="movieGenres" wrapper-class="flex space-x-2 whitespace-nowrap" />
                </PopoverPanel>
              </transition>
            </Popover>
          </PopoverGroup>
        </div>
      </section>

      <div class="mx-auto max-w-2xl pb-16 pt-10 text-left sm:pb-24 lg:max-w-[1600px]">
        <h2 class="sr-only">Movies</h2>

        <ul class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-x-8">
          <li v-for="item in filteredItems" :key="item.id" class="group">
            <div class="aspect-h-3 aspect-w-2 w-full overflow-hidden rounded-lg bg-gray-200">
              <img :src="`https://image.tmdb.org/t/p/w500/${item.poster_path}`" :alt="item.title" class="h-full w-full object-cover object-center group-hover:opacity-75" />
            </div>
            <h3 class="mt-4 text-sm text-gray-700">
              <span v-if="props.type === 'tv'">{{ item.original_name }}</span>
              <span v-else>{{ item.title }}</span>
            </h3>

            <p class="mt-1 text-lg font-medium text-gray-900">
              <span v-if="props.type === 'tv'">{{ new Date(item.first_air_date).getFullYear() }}</span>
              <span v-else>{{ new Date(item.release_date).getFullYear() }}</span>
            </p>

            <div class="mt-1 flex">
              <button type="button" v-for="i in 5" :class="{ 'mr-1': i < 5 }" @click="updateRating(item, i)">
                <StarIcon class="block h-6 w-6" :class="[item.reviews[0].rating >= i ? ' text-blue-400' : ' text-gray-400']" />
              </button>
              <div class="ml-auto">{{ Number(item.vote_average / 2).toFixed(2) }}</div>
            </div>

            <button @click="viewReviews(item.id)" class="mt-1 text-sm text-gray-900">{{ item.reviews ? item.reviews.length : 0 }} Reviews</button>
          </li>
          <p v-show="fetchingData">Fetching more...</p>
        </ul>
      </div>
    </div>
  </div>
</template>
