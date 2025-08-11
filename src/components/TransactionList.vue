<script setup>
import { useRoute } from "vue-router";
import { computed, watch } from "vue";

const route = useRoute();
const coin = computed(() => route.params.coin);
</script>

<template>
  <section class="mainBorder py-0 flex-1" :class="{ emptyList: !coin }">
    <router-view />
  </section>
</template>

<style scoped>
.emptyList {
  display: flex;
  justify-content: center;
  padding: 1rem;
}
</style>
