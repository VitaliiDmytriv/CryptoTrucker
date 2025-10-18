<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import type { Transaction, CoinGecko } from "@/types/index";
import { useCoinList } from "@/composables/useCoinList";
import type { ElAutocomplete } from "element-plus";
import { Search, ChevronDown } from "lucide-vue-next";

const emit = defineEmits<{
  (e: "handleSelect", coin: CoinGecko): void;
}>();

const props = defineProps<{
  transaction: Transaction;
}>();

const searchQuery = ref("");
const inputRef = ref<InstanceType<typeof ElAutocomplete> | null>(null);
const { coinList, fetchCoinList, error: coinListErro, loading: coinListLoading } = useCoinList();
const placeholderText = computed(() => (props.transaction.name ? "" : "Select Coin"));

async function handleSearch(query: string, cb: (results: any[]) => void) {
  await fetchCoinList(query);
  cb(coinList.value.map((coin) => ({ ...coin, value: coin.name })));
}

function selectCoin(coin: CoinGecko) {
  searchQuery.value = "";
  emit("handleSelect", coin);

  nextTick(() => {
    inputRef.value?.blur();
    inputRef.value?.close();
  });
}
</script>

<template>
  <section class="relative flex-1">
    <div>
      <el-autocomplete
        ref="inputRef"
        v-model="searchQuery"
        :fetch-suggestions="handleSearch"
        :placeholder="placeholderText"
        :debounce="400"
        @select="selectCoin"
        popper-class="coin-select"
        :teleported="false"
        :fit-input-width="true"
      >
        <template #suffix>
          <div v-if="inputRef?.activated">
            <Search :size="16" :stroke-width="1.5" />
          </div>
          <div v-else>
            <ChevronDown :size="16" :stroke-width="1.5" />
          </div>
        </template>
        <template #default="{ item }">
          <div class="flex gap-1 sm:gap-2 items-center cursor-pointer">
            <div class="crypto_icon">
              <img :src="item.image" alt="" />
            </div>
            <div class="flex-1">
              <p class="mr-2 truncate coin-select_item-name">
                <b>{{ item.name }}</b>
              </p>
            </div>
            <p class="coin-select_item-symbol uppercase truncate text-[#808a9d] shrink-0 mr-3">
              {{ item.symbol }}
            </p>
          </div>
        </template>
      </el-autocomplete>
    </div>

    <!-- Absolute element on input -->
    <div
      v-if="transaction.name && !inputRef?.activated"
      @click="inputRef?.focus()"
      class="absolute left-0 top-0 right-0 bottom-0 flex p-1"
    >
      <div class="flex gap-2 items-center">
        <div class="crypto_icon">
          <img class="" :src="transaction.image" alt="" />
        </div>
        <p class="coin-select_item-name flex-1 truncate md:flex-initial">
          {{ transaction.name }}
        </p>
        <p class="text-[#808a9d]">{{ transaction.symbol.toUpperCase() }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.coin-select {
  position: relative;
}

.crypto_icon {
  @apply w-3 xs:w-4;
  @apply sm:w-5;
}

p {
  @apply text-xs sm:text-sm;
}

.coin-select_item-name {
  @apply max-w-[5.625rem] xs:max-w-[9.375rem] sm:max-w-[13rem] md:max-w-[18rem];
}

.coin-select_item-symbol {
  @apply max-w-[3.125rem] md:max-w-[6.25rem];
}
</style>
