<script setup></script>

<template>
  <TheHeader />
  <div data-scroll class="min-h-screen bg-[#1d185e] bg-opacity-60">
    <slot />
  </div>
  <TheFooter />

  <UNotifications />
</template>

<style></style>
