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
    :class="{ coinBlockActive: route.params.coin === props.coin }"
    class="card-border container-border select-none text-center min-w-[2.25rem] sm:min-w-[3rem]"
    aria-label="check transactions"
  >
    {{ props.coin }}
  </RouterLink>
</template>

<style>
.coinBlock {
  user-select: none;
  text-align: center;
  min-width: 3.5rem;
}

.coinBlockActive {
  background-color: var(--coinBlockBgActive);
  overflow: hidden;
}
</style>
