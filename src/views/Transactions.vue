<script setup lang="ts">
import { inject, Ref, computed, ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { CoinData, Transaction } from "../types/index";
import TransactionForm from "../components/TransactionForm.vue";
import Modal from "@/components/Modal.vue";
import { useCoinsStore } from "../stores/coinsStore";

const route = useRoute();
const store = useCoinsStore();
const coin = ref<null | CoinData>(null);

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

// const route = useRoute();
// const coins = inject<Ref<CoinsRecord>>("coins");
// const activeTransaction = ref<null | Transaction>(null);

// const filteredCoin = computed(() => {
//   return coins.value[route.params.coin as string];
// });

// function closeEdit() {
//   activeTransaction.value = null;
// }

// function openTransactionEditor(id: number) {
//   const transaction = filteredCoin.value?.transactions.find(
//     (el) => el.id === id
//   );
//   activeTransaction.value = transaction;
// }
</script>

<template>
  <!-- <Modal v-if="activeTransaction" @close="closeEdit">
    <TransactionForm
      mode="edit"
      @close="closeEdit"
      :transaction="activeTransaction"
    />
  </Modal> -->

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
        <!-- @click="openTransactionEditor(transaction.id)" -->
        <tr v-for="transaction in coin.transactions">
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
