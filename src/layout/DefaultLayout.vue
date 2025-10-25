<script setup lang="ts">
import Header from "@/components/Header.vue";
</script>

<template>
  <section class="p-3 max-w-7xl m-auto">
    <Header />
    <main>
      <router-view />
    </main>
  </section>
</template>
