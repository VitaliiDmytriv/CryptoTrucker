<script setup lang="ts">
import { ChevronLeft } from "lucide-vue-next";
import { Coin, GlobalStats } from "@/types";

const route = useRoute();
const router = useRouter();
const dialogVisible = ref(false);
const store = usePortfolioStore();

const canShowBackButton = computed(() => !!route.params.coin);
const currentTab = computed(() => route.meta.currentTab);
const statsData = computed<Coin | GlobalStats>(() => {
  const coin = Array.isArray(route.params.coin) ? route.params.coin[0] : route.params.coin;
  if (coin && store.coins[coin]) {
    return store.coins[coin] as Coin;
  } else {
    return store.stats as GlobalStats;
  }
});

function closeForm() {
  dialogVisible.value = false;
}
</script>

<template>
  <section class="flex flex-col gap-3 min-h-screen">
    <TransactionForm v-if="dialogVisible" @close="closeForm" mode="add" dialogVisible />

    <div v-if="canShowBackButton" class="flex-1">
      <el-button @click="router.push('/')" link>
        <ChevronLeft :size="20" :stroke-width="1.5" />
        <span>Back</span>
      </el-button>
    </div>

    <div v-if="'name' in statsData" class="flex gap-1 sm:gap-2 items-center">
      <div class="w-6 shrink-0">
        <img :src="statsData.image" alt="" />
      </div>
      <div class="md:block min-w-0 text-left">
        <p class="truncate">
          {{ statsData.name }}
        </p>
      </div>
      <p class="uppercase truncate text-[#808a9d] shrink-0">({{ statsData.symbol }})</p>
    </div>

    <div class="grid grid-cols-2 gap-2 lg:grid-cols-[repeat(2,minmax(0,200px))]">
      <div class="">
        <el-card>
          <div class="text-[#808a9d] mb-1">Cost Basis</div>
          <div v-if="statsData">
            <b>{{ formatMoney(statsData.activeInvestment) }}</b>
          </div>
        </el-card>
      </div>
      <div class="">
        <el-card>
          <div class="text-[#808a9d] mb-1">All-time profit</div>
          <div v-if="statsData">
            <b>{{ formatMoney(statsData.totalProfit) }}</b>
          </div>
        </el-card>
      </div>
    </div>

    <section class="flex items-center">
      <h2 class="font-bold text-xl">{{ currentTab }}</h2>
      <div class="flex gap-1 xs:gap-2 items-center ml-auto">
        <div id="merge"></div>
        <el-button type="primary" @click="dialogVisible = true">Add Transaction</el-button>
      </div>
    </section>

    <div class="">
      <router-view />
    </div>
  </section>
</template>
