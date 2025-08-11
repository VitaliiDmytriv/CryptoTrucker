<script setup lang="ts">
import { ref, provide, computed, onMounted } from "vue";
import DataBlock from "./components/DataBlock.vue";
import CoinBlock from "./components/CoinBlock.vue";
import TransactionList from "./components/TransactionList.vue";
import { useCoinsStore } from "./stores/coinsStore";

const store = useCoinsStore();

onMounted(() => {
  store.fetchCoinsList();
});
</script>

<template>
  <section class="p-2 flex flex-col gap-2 min-h-screen h-[2000px]">
    <header>
      <h1>Crypto Trucker</h1>
    </header>

    <section class="flex gap-4">
      <DataBlock> </DataBlock>
      <DataBlock> </DataBlock>
    </section>

    <section>
      <div v-if="store.loading">Loading...</div>
      <div v-if="store.error">Error:{{ store.error }}</div>
      <div v-else class="flex gap-2">
        <CoinBlock v-for="coin in store.coinsList" :key="coin" :coin="coin" />
      </div>
    </section>
    <TransactionList />
  </section>
</template>

<style scoped></style>
