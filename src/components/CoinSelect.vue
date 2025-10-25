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

async function handleSearch(query: string, cb: (results: CoinGecko[]) => void) {
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
          <CoinItem :bold="true" :image="item.image" :name="item.name" :symbol="item.symbol" />
        </template>
      </el-autocomplete>
    </div>

    <!-- Absolute element on input -->
    <div
      v-if="transaction.name && !inputRef?.activated"
      @click="inputRef?.focus()"
      class="absolute left-0 top-0 right-0 bottom-0 flex p-1"
    >
      <CoinItem :image="transaction.image" :name="transaction.name" :symbol="transaction.symbol" />
    </div>
  </section>
</template>
