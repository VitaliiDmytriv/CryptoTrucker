<script setup lang="ts">
import { inject, Ref, computed, ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import type { CoinData, Transaction } from "../types/index";
import TransactionForm from "../components/TransactionForm.vue";
import Modal from "@/components/Modal.vue";
import { useCoinsCacheStore } from "../stores/coinsCacheStore";
import Error from "../components/Error.vue";
import router from "@/router/router";

const route = useRoute();
const store = useCoinsCacheStore();
const coin = ref<null | CoinData>(null);
const activeTransaction = ref<undefined | Transaction>(undefined);

watch(
  () => route.params.coin,
  async (newSymbol) => {
    if (typeof newSymbol === "string") {
      coin.value = await store.fetchCoinData(newSymbol);
    } else {
      coin.value = null;
    }
  },
  { immediate: true }
);

// Handle Edit Form ==
function closeEdit() {
  activeTransaction.value = undefined;
}

function openTransactionEditor(id: number) {
  const transaction = coin.value?.transactions.find((el) => el.id === id);
  activeTransaction.value = transaction;
}

// Handle Errors ===
const errorButtonText = computed(() => {
  if (!store.error) return "Go back";
  switch (store.error.code) {
    case "not-found":
      return "Go back";
    case "server-error":
      return "Try again";
    case "network":
      return "Check connection";
    default:
      return "Go back";
  }
});

function handleErrorRetry() {
  if (!store.error) return;

  switch (store.error.code) {
    case "server-error":
      store.resetError();
      if (typeof route.params.coin === "string") {
        (async () =>
          (coin.value = await store.fetchCoinData(
            route.params.coin as string
          )))();
      }
      break;
    default:
      // Reset error and navigate to home
      store.resetError();
      router.push("/");
      break;
  }
}
</script>

<template>
  <Modal v-if="activeTransaction" @close="closeEdit">
    <TransactionForm
      mode="edit"
      @close="closeEdit"
      :transaction="activeTransaction"
    />
  </Modal>

  <Modal v-if="store.error">
    <Error
      @retry="handleErrorRetry"
      :message="store.error.message"
      :button-txt="errorButtonText"
    />
  </Modal>

  <div>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Coins</th>
          <th>Bought</th>
          <th>Sold</th>
          <th>Fee</th>
          <th>Profit</th>
        </tr>
      </thead>

      <tbody v-if="coin">
        <tr
          @click="openTransactionEditor(transaction.id)"
          v-for="transaction in coin.transactions"
        >
          <td>{{ transaction.name }}</td>
          <td>{{ transaction.quantity }}</td>
          <td>${{ transaction.pricePerCoinBought }}</td>
          <td>
            {{
              transaction.pricePerCoinSold
                ? `$${transaction.pricePerCoinSold}`
                : "-"
            }}
          </td>
          <td>
            {{ transaction.fees ? `$${transaction.fees}` : "-" }}
          </td>
          <td>
            {{ transaction.profit ? `$${transaction.profit}` : "-" }}
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
</style>
