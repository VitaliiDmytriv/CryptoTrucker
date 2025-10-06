<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import type { Transaction, CoinGecko } from "@/types/index";
import { useCoinList } from "@/composables/useCoinList";
import { onClickOutside, useDebounceFn } from "@vueuse/core";
import { Search, ChevronDown } from "lucide-vue-next";

const emit = defineEmits<{
  (e: "handleSelect", coin: CoinGecko): void;
}>();

const props = defineProps<{
  transaction: Transaction;
}>();

const searchQuery = ref("");
const isDropdownOpen = ref(true);
const dropdown = ref<null | HTMLElement>(null);
const inputRef = ref<HTMLInputElement | null>(null);

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

onMounted(() => {
  inputRef.value?.focus();
});

onClickOutside(dropdown, () => {
  if (props.transaction.name) {
    isDropdownOpen.value = false;
    searchQuery.value = "";
    inputRef.value?.blur();
  }
});

function selectCoin(coin: CoinGecko) {
  isDropdownOpen.value = false;
  searchQuery.value = "";
  emit("handleSelect", coin);
}

function openDropDown() {
  isDropdownOpen.value = true;
  inputRef.value?.focus();
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
          @focus="openDropDown"
          type="text"
          class="input-primary border"
          v-model.trim="searchQuery"
          ref="inputRef"
        />

        <div
          @click="openDropDown"
          v-if="!isDropdownOpen"
          class="absolute top-1/2 -translate-y-1/2 left-1 right-7"
        >
          <div v-if="transaction.name" class="flex gap-2 items-center">
            <div class="crypto_icon">
              <img class="" :src="transaction.image" alt="" />
            </div>
            <p class="flex-1 truncate md:flex-initial">
              {{ transaction.name }}
            </p>
            <p class="text-[#808a9d]">{{ transaction.symbol.toUpperCase() }}</p>
          </div>
          <div v-else>Select Coin</div>
        </div>
      </div>

      <div class="absolute w-5 right-1 top-1/2 -translate-y-1/2">
        <div v-if="isDropdownOpen">
          <Search :size="16" :stroke-width="1.5" />
        </div>
        <div v-else>
          <ChevronDown @click="openDropDown" :size="16" :stroke-width="1.5" />
        </div>
      </div>

      <!-- dropdown -->

      <ul
        ref="dropdown"
        v-if="isDropdownOpen"
        class="absolute mt-1 max-h-48 bg-[var(--bodyColor)] shadow-lg w-full rounded-md p-1 overflow-y-auto"
      >
        <li v-if="coinListLoading">Searching...</li>
        <li v-else-if="!coinList.length" class="p-2 flex items-center">
          No data
        </li>
        <li
          v-else
          class="p-1 sm:p-2 flex gap-1 sm:gap-2 items-center cursor-pointer hover:bg-[var(--transactionHover)]"
          v-for="coin in coinList"
          :key="coin.id"
          @click="selectCoin(coin)"
        >
          <div class="crypto_icon">
            <img :src="coin.image" alt="" />
          </div>
          <p class="mr-2 truncate flex-1">
            <b>{{ coin.name }}</b>
          </p>
          <p class="uppercase text-[#808a9d] shrink-0">
            {{ coin.symbol }}
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* max-w-[5rem] xs:max-w-[7rem] sm:max-w-none */
.crypto_icon {
  @apply w-3 xs:w-4;
  @apply sm:w-5;
}

p {
  @apply text-xs sm:text-sm;
}
</style>
