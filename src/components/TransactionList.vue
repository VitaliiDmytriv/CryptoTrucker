<script setup>
import { useRoute } from "vue-router";
import { computed, watch } from "vue";

const route = useRoute();
const coin = computed(() => route.params.coin);
</script>

<template>
  <section
    class="relative card-border py-0 flex-1"
    :class="{ 'flex justify-center': !coin }"
  >
    <div class="absolute top-[10%]" v-if="!coin">Chose coin</div>
    <router-view />
  </section>
</template>

<style scoped>
.emptyList {
  display: flex;
  justify-content: center;
  /* padding: 1rem; */
}
</style>
