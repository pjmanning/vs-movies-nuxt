<script setup lang="ts">
import type { Movie } from '@/types'

defineProps({
  movie: {
    type: Object as PropType<Movie>,
    required: true,
  },
  isListModalOpen: {
    type: Boolean as PropType<boolean>,
    required: true,
  },
})
</script>

<template>
  <UModal :model-value="isListModalOpen" @update:model-value="$emit('update:isListModalOpen', $event)">
    <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <h3>Add to List</h3>
      </template>

      List

      <template #footer>
        <div class="flex justify-end">
          <!-- <UButton label="Cancel" color="gray" class="mr-2" @click="$emit('closeReviewModal')" /> -->
          <!-- <UButton label="Save" color="green" @click="$emit('saveReview')" /> -->
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<style></style>
