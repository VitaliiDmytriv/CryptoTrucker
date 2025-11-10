<script setup lang="ts">
import { ErrorResponse } from "@/types/index";
import { Vue3Lottie } from "vue3-lottie";
import successAnim from "@/assets/animation/Success.json";
import errorAnim from "@/assets/animation/Tomato Error.json";
import { ElMessage } from "element-plus";

const props = defineProps<{
  submitLoading: boolean;
  submitError: ErrorResponse | null;
  submitSuccess: boolean;
}>();

watch(
  () => props.submitError,
  (newError) => {
    if (newError) {
      ElMessage({
        type: "error",
        message: newError.message,
      });
    }
  }
);
</script>

<template>
  <div
    v-if="submitLoading || submitError || submitSuccess"
    class="submitStatus absolute left-0 top-0 right-0 bottom-0 bg-[var(--opacityColor)] flex justify-center items-center z-20"
  >
    <!-- Loading -->
    <div v-if="submitLoading">
      <div class="w-6 h-6 border-2 border-black border-dashed rounded-full animate-spin"></div>
    </div>
    <!-- Error -->
    <div v-else-if="submitError">
      <Vue3Lottie :animation-data="errorAnim" :loop="false" style="width: 80px; height: 80px" />
    </div>
    <!-- Success -->
    <div v-else-if="submitSuccess">
      <Vue3Lottie :animation-data="successAnim" :loop="false" style="width: 80px; height: 80px" />
    </div>
  </div>
</template>
