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
