<script setup lang="ts">
import { ref, provide, computed, onMounted } from "vue";
import DataBlock from "./components/DataBlock.vue";
import CoinBlock from "./components/CoinBlock.vue";
import TransactionList from "./components/TransactionList.vue";
import { usePortfolioAnoteheStore } from "./stores/portfolioAnotherStore";
import Modal from "./components/Modal.vue";
import Error from "./components/Error.vue";
import Sceleton from "./components/Sceleton.vue";
import { nanoid } from "nanoid";
import TransactionForm from "@/components/TransactionForm.vue";
import { useTransactions } from "./composables/useTransactions";
import { usePortfolioStore } from "./stores/portfolioStore";
import { storeToRefs } from "pinia";

const store = usePortfolioAnoteheStore();
const showAddTransaction = ref(false);
const {
  fetchCoinList,
  loading: coinListLoading,
  error: coinListError,
} = useTransactions();
const portfolio = usePortfolioStore();

onMounted(async () => {
  // store.fetchPortfolioData();
  await fetchCoinList();
  // console.log("in App vue: " + coinsList);
});

function handleError() {
  store.fetchPortfolioData();
}

function closeAddForm() {
  showAddTransaction.value = false;
}
</script>

<template>
  <section class="p-2 flex flex-col gap-2 min-h-screen h-[2000px]">
    <Modal v-if="coinListError" @close="">
      <!-- <Error
        @retry="handleError"
        :message="coinListError.message"
        button-txt="Try again"
      /> -->
    </Modal>
    <Modal v-if="showAddTransaction" @close="closeAddForm">
      <TransactionForm mode="add" @close="closeAddForm" />
    </Modal>
    <header>
      <h1>Crypto Trucker</h1>
    </header>

    <!-- <section class="flex gap-2 xs:gap-4">
      <DataBlock>
        <p class="font-bold xs:mb-2">Active Investment</p>
        <Sceleton v-if="store.loading">asd</Sceleton>
        <p v-else>{{ store.portfolio?.activeInvestment }}$</p>
      </DataBlock>
      <DataBlock>
        <p class="font-bold xs:mb-2">All time profit</p>
        <Sceleton v-if="store.loading">asd</Sceleton>
        <p v-else>{{ store.portfolio?.totalProfit }}$</p>
      </DataBlock>
    </section> -->

    <section class="flex">
      <div class="flex-1">
        <div v-if="coinListLoading" class="flex gap-2">
          <!-- <div v-if="true" class="flex gap-1 xs:gap-2"> -->
          <Sceleton
            class="container-border max-w-[2.25rem] sm:max-w-[3rem]"
            v-for="scelet in 3"
            :key="scelet"
            >asd</Sceleton
          >
        </div>

        <div v-else class="flex gap-1 xs:gap-2">
          <CoinBlock
            v-for="coin in portfolio.coinsList"
            :key="coin"
            :coin="coin"
          />
        </div>
      </div>

      <button
        class="card-border container-border select-none text-center min-w-[2.25rem] sm:min-w-[3rem]"
        @click="showAddTransaction = true"
      >
        Add Transaction
      </button>
    </section>
    <TransactionList />
  </section>
</template>

<style scoped></style>
