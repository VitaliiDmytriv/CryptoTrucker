<script setup lang="ts">
import { ChevronLeft } from "lucide-vue-next";
const route = useRoute();
const router = useRouter();
const dialogVisible = ref(false);

const canShowBackButton = computed(() => !!route.params.coin);

function closeForm() {
  dialogVisible.value = false;
}
</script>

<template>
  <section class="p-2 flex flex-col gap-2 min-h-screen">
    <TransactionForm v-if="dialogVisible" @close="closeForm" mode="add" dialogVisible />

    <section class="flex justify-end items-center">
      <div v-if="canShowBackButton" class="flex-1">
        <el-button @click="router.push('/')" link>
          <ChevronLeft :size="20" :stroke-width="1.5" />
          <span>Back</span>
        </el-button>
      </div>
      <div class="flex gap-1 xs:gap-2">
        <div id="merge"></div>
        <el-button @click="dialogVisible = true">Add Transaction</el-button>
      </div>
    </section>
    <div class="card-border h-[2000px]">
      <router-view />
    </div>
  </section>
</template>
