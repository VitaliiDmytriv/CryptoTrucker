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
      <slot />
    </div>
  </section>
</template>

<style scoped>
.modal {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.08);
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal_content {
}
</style>
