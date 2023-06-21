<script setup lang="ts">
import { ref } from 'vue'

const footerNavigation = {
  account: [
    { name: 'Manage Account', href: '#' },
    { name: 'Saved Items', href: '#' },
    { name: 'Orders', href: '#' },
    { name: 'Redeem Gift card', href: '#' },
  ],
  service: [
    { name: 'Shipping & Returns', href: '#' },
    { name: 'Warranty', href: '#' },
    { name: 'FAQ', href: '#' },
    { name: 'Find a store', href: '#' },
    { name: 'Get in touch', href: '#' },
  ],
  company: [
    { name: 'Who we are', href: '#' },
    { name: 'Press', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Terms & Conditions', href: '#' },
    { name: 'Privacy', href: '#' },
  ],
  connect: [
    { name: 'Instagram', href: '#' },
    { name: 'Pinterest', href: '#' },
    { name: 'Twitter', href: '#' },
  ],
}
</script>

<template>
  <footer aria-labelledby="footer-heading" class="bg-white">
    <h2 id="footer-heading" class="sr-only">Footer</h2>
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="border-t border-gray-100 py-10 sm:flex sm:items-center sm:justify-between">
        <div class="flex items-center justify-center text-sm text-gray-500">
          <p>United States (USD)</p>
          <p class="ml-3 border-l border-gray-200 pl-3">English</p>
        </div>
        <p class="mt-6 text-center text-sm text-gray-500 sm:mt-0">&copy; {{ new Date().getFullYear() }} VueVie Night, LLC.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped></style>
