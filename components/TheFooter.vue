<script setup lang="ts"></script>

<template>
  <footer aria-labelledby="footer-heading" class="bg-[#1d185e]">
    <h2 id="footer-heading" class="sr-only">Footer</h2>
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="py-10 sm:flex sm:items-center sm:justify-between">
        <div class="flex items-center justify-center text-sm text-gray-300">
          <p>United States (USD)</p>
          <p class="ml-3 border-l border-gray-200 pl-3">English</p>
        </div>
        <p class="mt-6 text-center text-sm text-gray-300 sm:mt-0">&copy; {{ new Date().getFullYear() }} VueVie Night, LLC.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped></style>
