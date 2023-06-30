<script setup lang="ts">
import type { Movie } from '@/types'
import { useMovieStore } from '@/stores/movies'
import { useList } from '@/composables/useList'

const props = defineProps({
  movie: {
    type: Object as PropType<Movie>,
    required: true,
  },
  isListModalOpen: {
    type: Boolean as PropType<boolean>,
    required: true,
  },
})
const emits = defineEmits(['closeListModal'])

const movieStore = useMovieStore()
const { addToList } = useList()

async function addMovieToList(listId: number) {
  await addToList(props.movie, listId)
  emits('closeListModal')
}
</script>

<template>
  <UModal :model-value="isListModalOpen" @update:model-value="$emit('update:isListModalOpen', $event)">
    <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <h3>Add to List</h3>
      </template>

      <div v-if="movieStore.lists.length < 1" class="text-center">
        <UIcon name="i-heroicons-list-bullet" class="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
        <h3 class="mt-2 text-sm font-semibold text-gray-100">No Lists</h3>
        <p class="mt-1 text-sm text-gray-300">Get started by creating a new list.</p>
        <div class="mt-6">
          <NuxtLink to="/list" class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"> Go Create a List </NuxtLink>
        </div>
      </div>
      <ul role="list" class="divide-y divide-gray-400">
        <li v-for="list in movieStore.lists" :key="list.id" class="flex cursor-pointer justify-between gap-x-6 px-2 py-5 hover:bg-gray-800" @click="addMovieToList(list.id)">
          <div class="flex gap-x-4">
            <div class="min-w-0 flex-auto">
              <p class="text-lg font-semibold leading-6 text-gray-100">{{ list.name }}</p>
              <p class="mt-1 truncate leading-5 text-gray-300">{{ list.movies.length }} movies</p>
            </div>
          </div>
        </li>
      </ul>
    </UCard>
  </UModal>
</template>

<style></style>
