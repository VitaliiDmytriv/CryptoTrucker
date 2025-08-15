<script setup lang="ts">
import { ref, provide, computed, onMounted } from "vue";
import DataBlock from "./components/DataBlock.vue";
import CoinBlock from "./components/CoinBlock.vue";
import TransactionList from "./components/TransactionList.vue";
import { useCoinsStore } from "./stores/coinsListStore";
import Modal from "./components/Modal.vue";
import Error from "./components/Error.vue";
import Sceleton from "./components/Sceleton.vue";

const store = useCoinsStore();

onMounted(() => {
  store.fetchCoinsList();
});

function handleError() {
  store.fetchCoinsList();
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

    <section class="flex gap-4">
      <DataBlock> </DataBlock>
      <DataBlock> </DataBlock>
    </section>

    <section>
      <div v-if="store.loading" class="flex gap-2">
        <!-- <div v-if="true" class="flex gap-2"> -->
        <Sceleton
          v-for="scelet in 4"
          :key="scelet"
          class="borderRadius"
          width="3.5rem"
          height="2.4rem"
        />
      </div>
      <div v-if="store.error">Error:{{ store.error }}</div>
      <div v-else class="flex gap-2">
        <CoinBlock v-for="coin in store.coinsList" :key="coin" :coin="coin" />
      </div>
    </section>
    <TransactionList />
  </section>
</template>

<style scoped></style>
