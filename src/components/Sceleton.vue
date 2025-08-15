<script setup lang="ts">
const props = defineProps<{
  width?: string;
  height?: string;
  shape?: "rect" | "circle";
}>();

const width = props.width ?? "100%";
const height = props.height ?? "initial";
</script>

<template>
  <div
    class="skeleton rounded-sm md:rounded-md select-none"
    :class="shape"
    :style="{
      width,
      height,
    }"
  >
    <slot></slot>
  </div>
</template>

<style scoped>
.skeleton {
  color: transparent;
  background: linear-gradient(
    90deg,
    var(--skeleton-base, #ccc) 25%,
    var(--skeleton-highlight, #e0e0e0) 37%,
    var(--skeleton-base, #ccc) 63%
  );
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
