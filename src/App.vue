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

console.log(nanoid(10));

const store = usePortfolioAnoteheStore();

onMounted(() => {
  store.fetchPortfolioData();
});

function handleError() {
  store.fetchPortfolioData();
}
</script>

<template>
  <section class="p-2 flex flex-col gap-2 min-h-screen h-[2000px]">
    <Modal v-if="store.error" @close="">
      <Error
        @retry="handleError"
        :message="store.error"
        button-txt="Try again"
      />
    </Modal>
    <header>
      <h1>Crypto Trucker</h1>
    </header>

    <section class="flex gap-2 xs:gap-4">
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
    </section>

    <section>
      <div v-if="store.loading" class="flex gap-2">
        <!-- <div v-if="true" class="flex gap-1 xs:gap-2"> -->
        <Sceleton
          class="container-border max-w-[2.25rem] sm:max-w-[3rem]"
          v-for="scelet in 3"
          :key="scelet"
          >asd</Sceleton
        >
      </div>

      <div v-if="store.error">Error:{{ store.error }}</div>
      <div v-else class="flex gap-1 xs:gap-2">
        <CoinBlock
          v-for="coin in store.portfolio?.coins"
          :key="coin"
          :coin="coin"
        />
      </div>
    </section>
    <TransactionList />
  </section>
</template>

<style scoped></style>
