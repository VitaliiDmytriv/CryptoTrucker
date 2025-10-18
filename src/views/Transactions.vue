<script setup lang="ts">
import { computed, ref, watch, Teleport } from "vue";
import { useWindowSize } from "@vueuse/core";
import { useRoute } from "vue-router";
import type { CoinData, FormMode, Transaction } from "../types/index";
import TransactionForm from "../components/TransactionForm.vue";
import Modal from "@/components/Modal.vue";
import { useTransaction } from "../composables/useTransactions";
import Error from "../components/Error.vue";
import Sceleton from "@/components/Sceleton.vue";
import { useMerge } from "@/composables/useMerge";
import { Merge } from "lucide-vue-next";
import { formatter } from "@/helpers/helpFunctions";

const formMode = ref<"edit" | "merge">("edit");
const route = useRoute();
const {
  loading: transactionsLoading,
  error: transactionsError,
  ...transactionsService
} = useTransaction();

const coin = ref<null | CoinData>(null);
const activeTransaction = ref<undefined | Transaction>(undefined);
const { width } = useWindowSize();
const colspan = computed(() => (width.value > 480 ? 6 : 4));
const iconSize = computed(() => (width.value > 480 ? 20 : 15));
const merge = useMerge(route.params.coin as string);

const dialogVisible = ref(false);

const canShowModal = computed(() => {
  if (formMode.value === "merge") return true;
  if (activeTransaction.value && !merge.isMerging.value) return true;
});

watch(
  () => route.params.coin,
  async (newSymbol) => {
    const symbol = Array.isArray(newSymbol) ? newSymbol[0] : newSymbol;
    coin.value = null;

    if (symbol) {
      merge.reset(symbol);
      coin.value = await transactionsService.fetchCoin(symbol);
      merge.setCoinImage(coin.value?.transactions[0].image || "");
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

function handleClickOnTransaction(id: string) {
  // якщо мерджування то блокуємо відкриття форми і toggle транзакцію в масиві, якщо ні то відкриваємо форму

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

  <Teleport to="#merge">
    <button
      class="btn-primary flex justify-center h-full"
      :class="{ btnActive: merge.isMerging.value }"
      :disabled="merge.canOpenMerge.value"
      @click="merge.toggleMerging"
    >
      <Merge :size="iconSize" :stroke-width="1.5" />
    </button>
  </Teleport>

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
          <div>{{ merge.defaultTransaction.value.quantity }}</div>
        </div>
        <div class="text-center">
          <div>Average price</div>
          <div>{{ merge.defaultTransaction.value.pricePerCoinBought }}</div>
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
    <table>
      <thead>
        <tr>
          <th class="hidden sm:table-cell">Name</th>
          <th>Coins</th>
          <th>Bought</th>
          <th>Sold</th>
          <th class="hidden sm:table-cell">Fee</th>
          <th>Profit</th>
        </tr>
      </thead>

      <tbody v-if="transactionsLoading" class="sceletForFetch">
        <tr v-for="scelet in 5" :key="scelet">
          <td :colspan="colspan">
            <Sceleton>asd</Sceleton>
          </td>
        </tr>
      </tbody>

      <tbody v-if="coin">
        <tr
          @click="handleClickOnTransaction(transaction.id)"
          v-for="transaction in coin.transactions"
          :class="{
            active: merge.isMerging.value && merge.mergeSet.value.has(transaction.id),
          }"
        >
          <td class="hidden sm:table-cell">{{ transaction.symbol }}</td>
          <td>
            {{ transaction.quantity ? formatter.format(transaction.quantity) : "-" }}
          </td>
          <td>${{ transaction.pricePerCoinBought }}</td>
          <td>
            {{ transaction.pricePerCoinSold ? `$${transaction.pricePerCoinSold}` : "-" }}
          </td>
          <td class="hidden sm:table-cell">
            {{ transaction.fees ? `$${transaction.fees}` : "-" }}
          </td>
          <td>
            {{ transaction.profit ? `$${transaction.profit.toFixed(2)}` : "-" }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  table-layout: fixed;
}

tbody tr.active {
  background-color: var(--transactionHover);
}

th,
td {
  text-align: center;
  padding-block: 0.3rem;
}

tr {
  border-bottom: 1px solid var(--borderColor);
}

tbody tr:hover {
  background-color: var(--transactionHover);
}

td {
  padding: 0.25rem;
}

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
