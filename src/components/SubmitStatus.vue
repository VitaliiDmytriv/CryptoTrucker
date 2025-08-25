<script setup lang="ts">
import { ErrorResponse } from "@/types/index";
import { Vue3Lottie } from "vue3-lottie";
import successAnim from "@/assets/animation/Success.json";

defineProps<{
  submitLoading: boolean;
  submitError: ErrorResponse | null;
  submitSuccess: boolean;
}>();
</script>

<template>
  <div
    v-if="submitLoading || submitError || submitSuccess"
    class="absolute left-0 top-0 right-0 bottom-0 bg-[var(--opacityColor)] flex justify-center items-center"
  >
    <!-- Loading -->
    <div v-if="submitLoading">
      <div
        class="w-6 h-6 border-2 border-black border-dashed rounded-full animate-spin"
      ></div>
    </div>
    <!-- Error -->
    <div v-else-if="submitError">
      <object data="" type="">
        {{ submitError }}
      </object>
    </div>
    <!-- Success -->
    <div v-else-if="submitSuccess">
      <Vue3Lottie
        :animation-data="successAnim"
        :loop="false"
        style="width: 80px; height: 80px"
      />
    </div>
  </div>
</template>
