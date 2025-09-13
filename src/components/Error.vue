<script setup lang="ts">
import router from "@/router/router";
import { ErrorResponse } from "@/types/index";
import { computed } from "vue";

const props = defineProps<{
  error: ErrorResponse;
}>();

const emit = defineEmits<{
  (event: "resetError"): void;
}>();

const errorButtonText = computed(() => {
  switch (props.error.code) {
    case "not-found":
      return "Go back";
    case "server-error":
      return "Try again";
    case "network":
      return "Check connection";
    default:
      return "Go back";
  }
});

function handleRetry() {
  switch (props.error.code) {
    case "not-found":
      router.push("/");
      emit("resetError");
      break;

    default:
      router.push("/");
      emit("resetError");
      break;
  }
}
</script>

<template>
  <section
    class="error border bg-[var(--bodyColor)] flex items-center flex-col justify-evenly p-1"
  >
    <p>Ooops, Error</p>
    <p>{{ error.message }}</p>
    <button @click="handleRetry" class="inputMain border min-w-[35%]">
      {{ errorButtonText }}
    </button>
  </section>
</template>

<style scoped>
.error {
  min-width: 70vw;
  max-width: 31rem;
  aspect-ratio: 16 / 9;
}

@media (min-width: 680px) {
  .error {
    font-size: 1rem;
    min-width: 31rem;
  }
}
</style>
