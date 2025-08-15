<script setup lang="ts">
const props = defineProps<{
  width?: string;
  height?: string;
  borderRadius?: string;
  shape?: "rect" | "circle";
}>();

const width = props.width ?? "100%";
const height = props.height ?? "1rem";
const borderRadius =
  props.shape === "circle" ? "50%" : props.borderRadius ?? "0.25rem";
</script>

<template>
  <div
    class="skeleton"
    :class="shape"
    :style="{
      width,
      height,
      borderRadius,
    }"
  ></div>
</template>

<style scoped>
.skeleton {
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
