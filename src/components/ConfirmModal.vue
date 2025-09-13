<script setup lang="ts">
import { ref } from "vue";
import { CircleAlert } from "lucide-vue-next";

const emits = defineEmits<{
  (e: "closeModal"): void;
  (e: "handleAction"): void;
}>();
const isConfirm = ref(false);
</script>

<template>
  <section
    class="flex items-center justify-center absolute left-0 bg-[var(--opacityColor)] w-full h-full drop-shadow-lg z-10"
  >
    <div
      class="h-1/2 bg-[var(--bodyColor)] w-4/5 flex justify-center flex-col rounded border items-center gap-2 p-2"
    >
      <div class="mb-2"><CircleAlert :size="32" /></div>
      <div>Are you sure you want to remove this transaction?</div>
      <div class="flex gap-5 w-full mt-3">
        <button @click="emits('handleAction')" class="flex-1 border rounded">
          Remove
        </button>
        <button @click="emits('closeModal')" class="flex-1 border rounded">
          Cancel
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
button {
  transition: all 0.3s;
}
button:hover {
  background-color: var(--coinBlockBgActive);
}
</style>
