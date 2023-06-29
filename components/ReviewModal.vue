<script setup lang="ts">
import type { Movie } from '@/types'
import { useMovieStore } from '@/stores/movies'
import { useReview } from '@/composables/useReview'

const props = defineProps({
  movie: {
    type: Object as PropType<Movie>,
    required: true,
  },
  isReviewModalOpen: {
    type: Boolean as PropType<boolean>,
    required: true,
  },
})
const emits = defineEmits(['closeReviewModal'])

const movieStore = useMovieStore()
const toast = useToast()
const isEditReview = ref(false)
const currentReview = ref(movieStore.reviews.find((review) => review.id === props.movie.id))
const reviewRating = ref(currentReview.value?.rating ?? 0)
const reviewText = ref(currentReview.value?.content ?? '')
const { addReview, updateReview } = useReview()

function cancelReview() {
  isEditReview.value = false
  emits('closeReviewModal')
}

function saveReview() {
  const review = movieStore.reviews.find((review) => review.id === props.movie.id)
  if (review) {
    updateReview(review, reviewRating.value, reviewText.value, new Date())
    toast.add({ id: 'review_updated', title: 'Review Updated', description: 'Successfully updated your review.', icon: 'i-heroicons-check-circle' })
  } else {
    addReview(props.movie.id, reviewRating.value, reviewText.value, new Date())
    toast.add({ id: 'review_added', title: 'Review Added!', description: 'Successfully reviewed this movie.', icon: 'i-heroicons-check-circle' })
  }
  isEditReview.value = false
  currentReview.value = movieStore.reviews.find((review) => review.id === props.movie.id)
  // emit to close modal
  emits('closeReviewModal')
}
</script>

<template>
  <UModal :model-value="isReviewModalOpen" @update:model-value="$emit('update:isReviewModalOpen', $event)">
    <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <h3 v-if="currentReview">Your Review</h3>
        <h3 v-else>Write a Review</h3>
      </template>

      <div>
        <FormKit v-if="!currentReview || isEditReview" v-model="reviewRating" type="rating" name="rating" />
        <button v-else type="button" disabled v-for="i in 5" :class="{ 'mr-1': i < 5 }" @click="reviewRating = i">
          <UIcon name="i-heroicons-star-solid" class="block h-6 w-6" :class="[reviewRating >= i ? ' text-yellow-400' : ' text-gray-400']" />
        </button>

        <UTextarea v-if="!currentReview || isEditReview" v-model="reviewText" autoresize class="mt-4" />
        <UTextarea v-else v-model="currentReview.content" disabled autoresize class="mt-4" />
      </div>

      <template #footer>
        <div v-if="!currentReview || isEditReview" class="flex justify-end">
          <UButton label="Cancel" color="gray" class="mr-2" @click="cancelReview" />
          <UButton label="Submit" color="green" :disabled="reviewRating === 0" @click="saveReview" />
        </div>
        <div v-else class="flex justify-end">
          <UButton label="Cancel" color="gray" class="mr-2" @click="cancelReview" />
          <UButton icon="i-heroicons-pencil-square" color="primary" label="Edit" @click="isEditReview = true" />
        </div>
      </template>
    </UCard>
  </UModal>
</template>
