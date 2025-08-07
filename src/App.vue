<script setup lang="ts">
import { ref, provide, computed } from "vue";
import DataBlock from "./components/DataBlock.vue";
import CoinBlock from "./components/CoinBlock.vue";
import TransactionList from "./components/TransactionList.vue";
import { CoinsRecord } from "./types/index";

const coins = ref<CoinsRecord[]>([]);
provide("coins", coins);

fetch("api/user")
  .then((res) => res.json())
  .then((data) => {
    coins.value = data.coins;
  });
</script>

<template>
  <section class="p-2 flex flex-col gap-2 min-h-screen h-[2000px]">
    <header>
      <h1>Crypto Trucker</h1>
    </header>

    <section class="flex gap-4">
      <DataBlock>
        <template #header>
          <div>Invested</div>
        </template>
        <template #stats>
          <div><span>100</span> $</div>
        </template>
      </DataBlock>
      <DataBlock>
        <template #header>
          <div>Profit</div>
        </template>
        <template #stats>
          <div><span>4</span> $</div>
        </template>
      </DataBlock>
    </section>

    <div class="flex gap-2">
      <CoinBlock v-for="coin in Object.keys(coins)" :key="coin" :coin="coin" />
    </div>
    <TransactionList />
  </section>
</template>

<style scoped></style>
