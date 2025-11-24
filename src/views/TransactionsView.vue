<script setup lang="ts">
import { useWindowSize } from "@vueuse/core";
import type { Coin, FormMode, Transaction } from "../types/index";
import { Merge } from "lucide-vue-next";

const route = useRoute();
const merge = useMerge(route.params.coin as string);
const portfolio = usePortfolioStore();
const { width } = useWindowSize();
const {
  loading: transactionsLoading,
  error: transactionsError,
  ...transactionsService
} = useTransaction();

// Refs
const formMode = ref<"edit" | "merge">("edit");
const activeTransaction = ref<undefined | Transaction>(undefined);
const isMounted = ref(false);
const dialogVisible = ref(false);

// Computeds
const iconSize = computed(() => (width.value > 480 ? 20 : 15));
const symbol = computed(() => {
  const param = route.params.coin;
  return Array.isArray(param) ? param[0] : param;
});
const coin = computed(() => portfolio.getCoin(symbol.value) ?? null);

async function initCoinData() {
  await transactionsService.fetchCoin(symbol.value);
  const transaction = coin.value?.transactions[0];
  merge.setTransactionField("image", transaction?.image || "");
  merge.setTransactionField("name", transaction?.name || "");
}

function handleClickOnTransaction(row: Transaction) {
  const id = row.id;
  const transaction = coin.value?.transactions.find((el) => el.id === id);
  if (!transaction) return;

  // якщо НЕ мерджування то відкриваємо форму для Edit
  if (!merge.isMerging.value) {
    activeTransaction.value = transaction;
    dialogVisible.value = true;
  } else {
    // Якщо мерджування то додаємо в масив транзакцію
    merge.toggleTransactionToMerge(transaction);
  }
}

function closeForm(resetMerge = false) {
  if (resetMerge) merge.resetMerging();
  formMode.value = "edit";
  activeTransaction.value = undefined;
  dialogVisible.value = false;
}

function openForm() {
  activeTransaction.value = merge.mergedTransaction.value;
  dialogVisible.value = true;
  formMode.value = "merge";
}

function getRowClassName({ row }: { row: Transaction }) {
  return merge.mergeSet.value.has(row.id) ? "selected-merge-row" : "";
}

onMounted(() => (isMounted.value = true));
initCoinData();
</script>

<template>
  <TransactionForm
    v-if="dialogVisible && activeTransaction"
    :mode="formMode"
    :mergeSet="merge.mergeSet.value"
    @close="closeForm"
    :transaction="activeTransaction"
    dialogVisible
  />

  <Teleport v-if="isMounted" to="#merge">
    <el-button
      :class="{ mergeBtnActive: merge.isMerging.value }"
      :disabled="merge.canOpenMerge.value"
      @click="merge.toggleMerging"
    >
      <Merge :size="iconSize" :stroke-width="1.5" />
    </el-button>
  </Teleport>

  <template v-if="merge.isMerging.value">
    <el-card class="mergeBlock">
      <div class="flex items-center gap-5">
        <div class="flex items-center">
          <span class="inline-block w-7">
            <img :src="merge.mergedTransaction.value.image" alt="" />
          </span>
          <span>{{ merge.mergedTransaction.value.symbol }}</span>
        </div>
        <div class="text-center">
          <div>Coins</div>
          <div>{{ formatQuantity(merge.mergedTransaction.value.quantity || 0) }}</div>
        </div>
        <div class="text-center">
          <div>Average price</div>
          <div>
            {{ formatPrice(merge.mergedTransaction.value.pricePerCoinBought || 0) }}
          </div>
        </div>
        <div class="ml-auto">
          <button :disabled="!merge.canMerge.value" @click="openForm" class="btn-primary">
            Merge
          </button>
        </div>
      </div>
    </el-card>
  </template>

  <el-card class="relative pb-20">
    <div class="min-h-screen">
      <div v-if="transactionsLoading">
        <el-skeleton :rows="4" animated />
      </div>
      <div v-if="coin && !transactionsLoading">
        <el-table
          :data="coin.transactions"
          :cell-style="{ textAlign: 'center' }"
          :header-cell-style="{ textAlign: 'center' }"
          @row-click="handleClickOnTransaction"
          :row-class-name="getRowClassName"
          :row-key="(row:Transaction) => row.id"
        >
          <el-table-column v-if="width > 480" prop="symbol" label="Name">
            <template #default="{ row }">
              <div class="flex gap-1 sm:gap-2 items-center justify-center">
                <div class="crypto_icon shrink-0">
                  <img :src="row.image" alt="" />
                </div>
                <p class="uppercase truncate text-[#808a9d] shrink-0">
                  {{ row.symbol }}
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="Coins">
            <template #default="{ row }">
              {{ formatQuantity(row.quantity) }}
            </template>
          </el-table-column>

          <el-table-column prop="pricePerCoinBought" label="Bought">
            <template #default="{ row }">
              {{ formatPrice(row.pricePerCoinBought) }}
            </template>
          </el-table-column>
          <el-table-column prop="pricePerCoinSold" label="Sold">
            <template #default="{ row }">
              {{ formatPrice(row.pricePerCoinSold) }}
            </template>
          </el-table-column>
          <el-table-column v-if="width > 480" prop="fees" label="Fee">
            <template #default="{ row }">
              {{ formatMoney(row.fees) }}
            </template>
          </el-table-column>
          <el-table-column prop="profit" label="Profit">
            <template #default="{ row }">
              <span
                :class="{
                  'profit-minus': (row.profit || 0) < 0,
                  'profit-plus': (row.profit || 0) > 0,
                }"
              >
                {{ formatMoney(row.profit) }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.mergeBtnActive {
  background-color: var(--el-button-hover-bg-color);
  border-color: var(--el-button-hover-border-color);
  color: var(--el-button-hover-text-color);
  outline: none;
}
.sceletForFetch tr {
  border-bottom: initial;
}

.sceletForFetch tr:hover {
  background-color: initial;
}

.mergeBlock {
  @apply fixed z-10 left-3 right-3 bottom-0 max-w-[1256px] m-auto;
}

.bottom-decoration {
  position: fixed;
  bottom: 0.5rem;
  height: 3.5rem;
  background-color: #ffffff;
  @apply fixed left-2 right-2 bottom-0;
  @apply 2xl:left-1/2 2xl:-translate-x-1/2 2xl:max-w-[79rem] 2xl:w-full;
}

.bottom-decoration::after {
  content: "";
  position: absolute;
  bottom: 0.5rem;
  top: 0;
  left: 0;
  right: 0;

  border-bottom: 1px solid var(--borderColor);
  border-left: 1px solid var(--borderColor);
  border-right: 1px solid var(--borderColor);
  border-top: 1px solid white;

  border-radius: var(--borderRadius);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
}

:deep(.selected-merge-row),
:deep(.selected-merge-row td),
:deep(.selected-merge-row:hover td) {
  background-color: var(--el-fill-color-light) !important;
}
</style>
