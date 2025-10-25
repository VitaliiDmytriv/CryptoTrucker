<script setup lang="ts">
import { formatCryptoValue } from "@/helpers/helpFunctions";
import { Coin } from "@/types";

//
const store = usePortfolioStore();
const router = useRouter();
const { fetchUserPortfolio, loading: coinListLoading, error: coinListError } = useTransaction();

const coins = computed(() => Object.values(store.coins));

onMounted(async () => {
  if (store.isPortfolioLoaded) return;
  await fetchUserPortfolio();
});

function handleClick(row: Coin) {
  router.push({ name: "coin", params: { coin: row.symbol } });
}
//
</script>

<template>
  <el-card>
    <div class="min-h-screen">
      <!-- <div v-if="true"> -->
      <div v-if="coinListLoading">
        <el-skeleton :rows="4" animated />
      </div>
      <template v-if="store.isPortfolioLoaded">
        <el-table :cell-style="{ textAlign: 'center' }" :data="coins" @row-click="handleClick">
          <el-table-column
            header-align="left"
            label-class-name="table-header--name"
            class-name="table-cell--name"
            prop="name"
            label="Name"
          >
            <template #default="{ row }: { row: Coin }">
              <div class="flex gap-1 sm:gap-2 items-center">
                <div class="crypto_icon shrink-0">
                  <img :src="row.image" alt="" />
                </div>
                <div class="hidden md:block min-w-0 text-left">
                  <p class="truncate">
                    {{ row.name }}
                  </p>
                </div>
                <p class="uppercase truncate text-[#808a9d] shrink-0">
                  {{ row.symbol }}
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column header-align="center" label="Invested">
            <template #default="{ row }: { row: Coin }">
              <div class="">
                {{ formatCryptoValue(row.activeInvestment, "money") }}
              </div>
            </template>
          </el-table-column>
          <el-table-column header-align="center" label="Holdings">
            <template #default="{ row }: { row: Coin }">
              <div class="">
                {{ formatCryptoValue(row.holdings, "quantity") }}
                <div class="text-xs text-[#808a9d] inline-block">{{ row.symbol }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column header-align="center" label="Profit/Loss">
            <template #default="{ row }: { row: Coin }">
              <div class="">
                {{ formatCryptoValue(row.totalProfit, "money") }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
  </el-card>
</template>

<style scoped>
:deep(.table-header--name.el-table__cell) {
  @apply sm:pl-2 pl-1;
}
:deep(.el-table__row .el-table__cell.table-cell--name) {
  @apply sm:pl-2 pl-1;
}
</style>
