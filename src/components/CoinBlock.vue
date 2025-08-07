<script setup lang="ts">
import { useRouter, useRoute, RouterLink } from "vue-router";
const router = useRouter();
const route = useRoute();
const props = defineProps<{
  coin: string;
}>();
</script>

<template>
  <RouterLink
    :to="{ name: 'coin', params: { coin: props.coin } }"
    :class="route.params.coin === props.coin ? 'coinBlockActive' : ''"
    class="mainBorder coinBlock"
    aria-label="check transactions"
  >
    {{ props.coin }}
  </RouterLink>
</template>

<style></style>
