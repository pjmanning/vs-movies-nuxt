<script setup lang="ts">
import { Dialog, DialogPanel } from '@headlessui/vue'

const mobileMenuOpen = ref(false)
const router = useRouter()
const navigation = [
  { name: 'Movies', to: '/' },
  { name: 'Lists', to: '/list' },
  { name: 'Reviews', to: '/reviews' },
]

function changePage(item: any) {
  mobileMenuOpen.value = false
  router.push(item.to)
}
</script>

<template>
  <header class="bg-[#1d185e]">
    <nav class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
      <div class="flex flex-1">
        <div class="hidden lg:flex lg:gap-x-12">
          <button v-for="item in navigation" :key="item.name" class="w-full text-left font-semibold leading-6" @click="changePage(item)">{{ item.name }}</button>
        </div>
        <div class="flex lg:hidden">
          <button type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white" @click="mobileMenuOpen = true">
            <span class="sr-only">Open main menu</span>
            <UIcon name="i-heroicons-bars-3" class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
      <NuxtLink to="/" class="-m-1.5 flex items-center p-1.5">
        <UIcon name="i-heroicons-video-camera-solid" class="mr-2 h-8 w-8" />
        <h1 class="text-2xl font-bold uppercase">Vue-vie Night</h1>
      </NuxtLink>
      <div class="flex flex-1 justify-end">
        <NuxtLink to="/search"><UIcon name="i-heroicons-magnifying-glass-20-solid" class="h-6 w-6 text-white" aria-hidden="true" /></NuxtLink>
      </div>
    </nav>
    <Dialog as="div" class="lg:hidden" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
      <div class="fixed inset-0 z-10" />
      <DialogPanel class="fixed inset-y-0 left-0 z-[60] w-full overflow-y-auto bg-white px-6 py-6">
        <div class="flex items-center justify-between">
          <div class="flex flex-1">
            <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = false">
              <span class="sr-only">Close menu</span>
              <UIcon name="i-heroicons-x-mark" class="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <NuxtLink to="/" class="-m-1.5 flex items-center p-1.5 text-[#2c2678]">
            <UIcon name="i-heroicons-film" class="mr-2 h-8 w-8" />
            <h1 class="text-2xl font-bold uppercase">Vue-vie Night</h1>
          </NuxtLink>
          <div class="flex flex-1 justify-end">
            <NuxtLink to="/"> <UIcon name="i-heroicons-magnifying-glass" class="h-6 w-6 text-gray-700" aria-hidden="true" /></NuxtLink>
          </div>
        </div>
        <div class="mt-6 space-y-2">
          <button v-for="item in navigation" :key="item.name" class="-mx-3 block w-full rounded-lg px-3 py-2 text-left text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50" @click="changePage(item)">{{ item.name }}</button>
        </div>
      </DialogPanel>
    </Dialog>
  </header>
</template>
