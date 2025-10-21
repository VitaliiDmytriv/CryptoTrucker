<script setup lang="ts">
import Header from "@/components/Header.vue";
import PortfolioView from "@/views/PortfolioView.vue";
</script>

<template>
  <section>
    <Header />
    <main>
      <router-view />
    </main>
  </section>
</template>
