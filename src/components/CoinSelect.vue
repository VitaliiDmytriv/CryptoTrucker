<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import type { Transaction, CoinGecko } from "@/types/index";
import { useCoinList } from "@/composables/useCoinList";
import { onClickOutside, useDebounceFn } from "@vueuse/core";
import { Search, ChevronDown } from "lucide-vue-next";

// 1. не змінювати props - а емітити ✅,
// 2.debounce з fetchCoinList, ✅
// 3.onClickOutside замість blur + mousedown, ✅
// 4.винести svg у компоненти, ✅

const emit = defineEmits<{
  (e: "handleSelect", coin: CoinGecko): void;
}>();

const props = defineProps<{
  transaction: Transaction;
}>();

const searchQuery = ref("");
const isDropdownOpen = ref(true);
const dropdown = ref<null | HTMLElement>(null);

const {
  coinList,
  fetchCoinList,
  error: coinListErro,
  loading: coinListLoading,
} = useCoinList();

const debouncedFetchCoinList = useDebounceFn(fetchCoinList, 400);

watch(
  () => searchQuery.value,
  (newValue) => {
    debouncedFetchCoinList(newValue);
  }
);

onClickOutside(dropdown, () => {
  if (props.transaction.name) {
    isDropdownOpen.value = false;
    searchQuery.value = "";
  }
});

function selectCoin(coin: CoinGecko) {
  isDropdownOpen.value = false;
  searchQuery.value = "";
  emit("handleSelect", coin);
}
</script>

<template>
  <!-- <button @click.prevent="updateCoinsList">UpdateCoins</button> -->
  <div class="relative">
    <div class="relative">
      <!-- input -->
      <div class="relative">
        <input
          maxlength="20"
          @focus="isDropdownOpen = true"
          type="text"
          class="input-primary border"
          v-model.trim="searchQuery"
        />

        <div
          v-if="!isDropdownOpen"
          class="absolute top-1/2 -translate-y-1/2 left-1"
        >
          <div v-if="transaction.name" class="flex justify-center gap-2">
            <span class="w-5 inline-block">
              <img class="w-full" :src="transaction.image" alt="" />
            </span>
            <span>{{ transaction.name }}</span>
            <span class="text-[#808a9d]">{{
              transaction.symbol.toUpperCase()
            }}</span>
          </div>
          <div v-else>Select Coin</div>
        </div>
      </div>

      <span class="absolute w-5 right-1 top-1/2 -translate-y-1/2">
        <span v-if="isDropdownOpen">
          <Search :size="16" :stroke-width="1.5" />
        </span>
        <span v-else>
          <ChevronDown :size="16" :stroke-width="1.5" />
        </span>
      </span>

      <!-- dropdown -->

      <ul
        ref="dropdown"
        v-if="isDropdownOpen"
        class="absolute mt-1 max-h-48 bg-[var(--bodyColor)] shadow-md w-full rounded-md p-1 overflow-y-auto"
      >
        <li v-if="coinListLoading">Searching...</li>
        <li v-else-if="!coinList.length" class="p-2 flex items-center">
          No data
        </li>
        <li
          v-else
          class="p-2 flex items-center cursor-pointer hover:bg-[var(--transactionHover)]"
          v-for="coin in coinList"
          :key="coin.id"
          @click="selectCoin(coin)"
        >
          <span class="mr-2 w-5">
            <img :src="coin.image" alt="" />
          </span>
          <span class="mr-2 font-semibold">{{ coin.name }}</span>
          <span class="uppercase">{{ coin.symbol }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
