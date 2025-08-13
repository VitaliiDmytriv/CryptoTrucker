<script setup lang="ts">
const props = defineProps<{
  message: string;
  buttonTxt: string;
}>();

const emit = defineEmits<{
  (event: "retry"): void;
}>();
</script>

<template>
  <section
    class="error border bg-[var(--bodyColor)] flex items-center flex-col justify-evenly p-1"
  >
    <p>Ooops, Error</p>
    <p>{{ message }}</p>
    <button @click="emit('retry')" class="inputMain border min-w-[35%]">
      {{ buttonTxt }}
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
