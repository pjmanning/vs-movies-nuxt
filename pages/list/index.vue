<script setup lang="ts">
import type { List } from '@/types'
import { useMovieStore } from '~/stores/movies'

useHead({
  title: 'Lists',
})

const movieStore = useMovieStore()
const router = useRouter()
const lists = computed<List[]>(() => {
  return movieStore.lists
})
const isListModalOpen = ref(false)
const listName = ref('')

function saveList() {
  if (!listName.value) {
    return
  }
  const generatedId = Math.floor(Math.random() * 1000001)
  movieStore.lists.push({ id: generatedId, name: listName.value, movies: [] })
  isListModalOpen.value = false
  listName.value = ''
  router.push(`/list/${generatedId}`)
}

////////// DELETE //////////
const isDeleteModalOpen = ref(false)
const selectedList = ref<List | null>(null)
function openDeleteModal(list: List) {
  selectedList.value = list
  isDeleteModalOpen.value = true
}
function deleteList() {
  const listIndex = movieStore.lists.findIndex((list) => list.id === selectedList.value?.id)
  movieStore.lists.splice(listIndex, 1)
  isDeleteModalOpen.value = false
  selectedList.value = null
}
function cancelDelete() {
  isDeleteModalOpen.value = false
  selectedList.value = null
}
</script>

<template>
  <!-- NEW LIST MODAL -->
  <UModal v-model="isListModalOpen">
    <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex justify-between">
          <h2 class="text-lg font-bold">Create a New List</h2>
          <UButton icon="i-heroicons-x-mark" :padded="false" size="sm" color="white" square variant="ghost" @click="isListModalOpen = false" />
        </div>
      </template>

      <UInput v-model="listName" color="white" variant="outline" size="lg" placeholder="List Name" />

      <template #footer>
        <UButton block size="lg" :disabled="listName === ''" label="Create List" color="green" @click="saveList" />
      </template>
    </UCard>
  </UModal>

  <!-- DELETE MODAL -->
  <UModal v-model="isDeleteModalOpen">
    <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex justify-between">
          <h2 class="text-lg font-bold">
            Delete List: <span v-if="selectedList !== null">{{ selectedList.name }}</span>
          </h2>
          <UButton icon="i-heroicons-x-mark" :padded="false" size="sm" color="white" square variant="ghost" @click="isDeleteModalOpen = false" />
        </div>
      </template>

      Are you sure you want to delete this list?

      <template #footer>
        <div v-if="selectedList" class="flex justify-end">
          <UButton size="md" label="Cancel" color="gray" @click="cancelDelete" />
          <UButton size="md" label="Delete" color="red" class="ml-2" @click="deleteList" />
        </div>
      </template>
    </UCard>
  </UModal>

  <!-- PAGE -->
  <ClientOnly>
    <div class="mx-auto h-screen max-w-7xl px-4 py-10">
      <h1 class="text-2xl font-bold">Your Lists</h1>

      <template v-if="lists.length === 0">
        <div class="flex h-full flex-col place-content-center text-center">
          <UIcon name="i-heroicons-film" class="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
          <h3 class="mt-2 text-sm font-semibold text-gray-100">No lists</h3>
          <p class="mt-1 text-sm text-gray-400">Get started by creating a new list.</p>
          <div class="mt-6">
            <button @click="isListModalOpen = true" type="button" class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              <UIcon name="i-heroicons-plus-20-solid" class="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              New List
            </button>
          </div>
        </div>
      </template>
      <template v-else-if="lists.length > 0">
        <div class="my-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <NuxtLink :to="`list/${list.id}`" v-for="list in lists" :key="list.name" class="relative flex items-center space-x-3 rounded-lg border border-gray-600 bg-violet-800 px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-600">
            <div class="min-w-0 flex-1">
              <span class="absolute inset-0" aria-hidden="true" />
              <p class="text-sm font-medium text-gray-100">{{ list.name }}</p>
              <p class="truncate text-sm text-gray-300">{{ list.movies.length }} movies</p>
            </div>
            <UButton @click.prevent="openDeleteModal(list)" icon="i-heroicons-trash" variant="outline" size="md" color="red" :padding="false" />
          </NuxtLink>
          <button @click="isListModalOpen = true" class="relative flex items-center space-x-3 rounded-lg border border-dashed border-gray-600 px-6 py-7 shadow-sm">
            <div class="min-w-0 flex-1">
              <button class="flex items-center focus:outline-none">
                <span class="absolute inset-0" aria-hidden="true" />
                <UIcon name="i-heroicons-plus-20-solid" class="mr-2 h-5 w-5" />
                <p class="text-sm font-medium text-gray-100">Create a new list</p>
              </button>
            </div>
          </button>
        </div>
      </template>
    </div>
  </ClientOnly>
</template>

<style scoped></style>
