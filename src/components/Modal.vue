<script setup lang="ts">
import { defineEmits, onMounted, onUnmounted } from "vue";
const emit = defineEmits<{
  (event: "close"): void;
}>();

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") {
    emit("close");
  }
}

onMounted(() => {
  document.body.style.overflow = "hidden"; // блок скролу
  window.addEventListener("keydown", handleKeydown);
});
onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
  document.body.style.overflow = ""; // повертаємо скролл
});
</script>

<template>
  <section @click="emit('close')" role="dialog" aria-modal="true" class="modal">
    <div @click.stop class="modal_content">
      <!-- <div @click.stop class="modal_content animate__animated animate__fadeInUp"> -->
      <slot />
    </div>
  </section>
</template>

<style scoped>
.modal {
  position: fixed;
  width: 100%;
  height: 100vh;
  min-height: fit-content;
  background-color: rgba(0, 0, 0, 0.08);
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;

  overflow-y: auto;
  padding: 1.5rem;
}

.modal_content {
  max-height: 100%;
  position: relative;
  overflow-y: auto;
  border: 1px solid var(--borderColor);
  border-radius: var(--borderRadius);
  /* z-index: 100; */
}
</style>
