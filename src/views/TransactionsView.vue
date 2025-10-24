<script setup lang="ts">
import { computed, ref, watch, Teleport, nextTick } from "vue";
import { useWindowSize } from "@vueuse/core";
import { useRoute } from "vue-router";
import type { Coin, FormMode, Transaction } from "../types/index";
import TransactionForm from "../components/TransactionForm.vue";
import { useTransaction } from "../composables/useTransactions";
import { useMerge } from "@/composables/useMerge";
import { Merge } from "lucide-vue-next";
import { formatCryptoValue } from "@/helpers/helpFunctions";

const portfolio = usePortfolioStore();
const formMode = ref<"edit" | "merge">("edit");
const route = useRoute();
const {
  loading: transactionsLoading,
  error: transactionsError,
  ...transactionsService
} = useTransaction();

// const coin = ref<null | Coin>(null);
const activeTransaction = ref<undefined | Transaction>(undefined);
const { width } = useWindowSize();
const iconSize = computed(() => (width.value > 480 ? 20 : 15));
const merge = useMerge(route.params.coin as string);

const dialogVisible = ref(false);

const coin = computed(() => {
  const symbol = Array.isArray(route.params.coin) ? route.params.coin[0] : route.params.coin;
  return symbol ? portfolio.getCoin(symbol) : null;
});

watch(
  () => route.params.coin,
  async (newSymbol) => {
    const symbol = Array.isArray(newSymbol) ? newSymbol[0] : newSymbol;

    if (symbol) {
      await transactionsService.fetchCoin(symbol);
      // merge.reset(symbol);
      // merge.setCoinImage(coin.value?.transactions[0].image || "");
      // merge.setCoinName(coin.value?.transactions[0].name || "");
    }
  },
  { immediate: true }
);

// Handle Edit Form ==
function closeForm(afterSuccses = false) {
  if (afterSuccses) {
    merge.cancelMerging();
  }
  formMode.value = "edit";
  activeTransaction.value = undefined;
  dialogVisible.value = false;
}

function handleClickOnTransaction(row: Transaction) {
  // якщо мерджування то блокуємо відкриття форми і toggle транзакцію в масиві, якщо ні то відкриваємо форму
  const id = row.id;

  const transaction = coin.value?.transactions.find((el) => el.id === id);

  if (!merge.isMerging.value) {
    activeTransaction.value = transaction;
    dialogVisible.value = true;
  } else {
    if (transaction) {
      merge.toggleTransactionToMerge(transaction);
    }
  }
}

function handleMerge() {
  activeTransaction.value = merge.defaultTransaction.value;
  dialogVisible.value = true;
  formMode.value = "merge";
}
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

  <!-- <Teleport to="#merge">
    <button
      class="btn-primary flex justify-center h-full"
      :class="{ btnActive: merge.isMerging.value }"
      :disabled="merge.canOpenMerge.value"
      @click="merge.toggleMerging"
    >
      <Merge :size="iconSize" :stroke-width="1.5" />
    </button>
  </Teleport> -->

  <div class="bottom-decoration"></div>

  <template v-if="merge.isMerging.value">
    <div class="mergeBlock card-border">
      <div class="flex items-center gap-5">
        <div class="flex items-center">
          <span class="inline-block w-7">
            <img :src="merge.defaultTransaction.value.image" alt="" />
          </span>
          <span>{{ merge.defaultTransaction.value.symbol }}</span>
        </div>
        <div class="text-center">
          <div>Coins</div>
          <div>{{ formatCryptoValue(merge.defaultTransaction.value.quantity, "quantity") }}</div>
        </div>
        <div class="text-center">
          <div>Average price</div>
          <div>
            {{ formatCryptoValue(merge.defaultTransaction.value.pricePerCoinBought, "currency") }}
          </div>
        </div>
        <div class="ml-auto">
          <button :disabled="!merge.canMerge.value" @click="handleMerge" class="btn-primary">
            Merge
          </button>
        </div>
      </div>
    </div>
  </template>

  <div>
    <div v-if="transactionsLoading">
      <el-skeleton :rows="4" animated />
    </div>
    <div v-if="coin && !transactionsLoading">
      <el-table
        :data="coin.transactions"
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ textAlign: 'center' }"
        @row-click="handleClickOnTransaction"
        stripe
        border
      >
        <el-table-column v-if="width > 480" prop="symbol" label="Name" />
        <el-table-column prop="quantity" label="Coins">
          <template #default="{ row }">
            {{ formatCryptoValue(row.quantity, "quantity") }}
          </template>
        </el-table-column>

        <el-table-column prop="pricePerCoinBought" label="Bought">
          <template #default="{ row }">
            {{ formatCryptoValue(row.pricePerCoinBought, "money") }}
          </template>
        </el-table-column>
        <el-table-column prop="pricePerCoinSold" label="Sold">
          <template #default="{ row }">
            {{ formatCryptoValue(row.pricePerCoinSold, "money") }}
          </template>
        </el-table-column>
        <el-table-column v-if="width > 480" prop="fees" label="Fee">
          <template #default="{ row }">
            {{ formatCryptoValue(row.fees, "money") }}
          </template>
        </el-table-column>
        <el-table-column prop="profit" label="Profit" fixed="right">
          <template #default="{ row }">
            {{ formatCryptoValue(row.profit, "money") }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped>
.sceletForFetch tr {
  border-bottom: initial;
}

.sceletForFetch tr:hover {
  background-color: initial;
}

.mergeBlock {
  @apply fixed left-2 right-2 bottom-2 p-2 bg-white;
  @apply 2xl:left-1/2 2xl:-translate-x-1/2 2xl:max-w-[79rem] 2xl:w-full;
  border: 1px solid var(--borderColor);
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
</style>
