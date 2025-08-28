<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { getCoinsList, updateCoinsList } from "@/api/coinsGeckoApi";
import ChevronDownIcon from "@/assets/icons/chevron-down-svgrepo-com.svg";
import SearchIcon from "@/assets/icons/search-svgrepo-com.svg";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
}

const selected = ref<null | Coin>(null);
const inputSearch = ref("");
const showList = ref(false);
const coins = ref<Coin[]>([]);

const placeholder = computed(() => {
  return selected ? selected.value?.name : "";
});

watch(
  () => inputSearch.value,
  (newValue) => {
    handleFetch(newValue);
  }
);
watch(
  () => selected.value,
  (newValue) => {
    console.log(selected);
  }
);

async function handleFetch(search: string) {
  try {
    const data = await getCoinsList(search);
    coins.value = data;
    // console.log(data);
  } catch (error) {
    console.log(error);
  }
}

function handleMouseDown(coin: Coin) {
  selected.value = { ...coin };
  showList.value = false;
  inputSearch.value = "";
}

handleFetch("");
</script>

<template>
  <!-- <button @click.prevent="updateCoinsList">UpdateCoins</button> -->
  <div class="relative">
    <div class="relative">
      <!-- input -->
      <input
        maxlength="20"
        @focus="showList = true"
        @blur="showList = false"
        type="text"
        class="input-primary border"
        v-model="inputSearch"
        :placeholder="placeholder"
      />
      <span class="absolute w-5 right-1 top-1/2 -translate-y-1/2">
        <span v-if="showList">
          <svg
            v-if="showList"
            viewBox="0 0 21 21"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <g
                fill="none"
                fill-rule="evenodd"
                stroke="#000000"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="8.5" cy="8.5" r="5"></circle>
                <path d="m17.571 17.5-5.571-5.5"></path>
              </g>
            </g>
          </svg>
        </span>
        <span v-else>
          <svg
            viewBox="0 0 21 21"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="m8.5.5-4 4-4-4"
                fill="none"
                stroke="#000000"
                stroke-linecap="round"
                stroke-linejoin="round"
                transform="translate(6 8)"
              ></path>
            </g>
          </svg>
        </span>
      </span>

      <!-- dropdown -->

      <ul
        v-if="showList"
        class="absolute mt-1 max-h-48 bg-[var(--bodyColor)] shadow-md w-full rounded-md p-1 overflow-y-auto"
      >
        <li
          class="p-2 flex items-center cursor-pointer hover:bg-[var(--transactionHover)]"
          v-for="coin in coins"
          :key="coin.id"
          @mousedown="handleMouseDown(coin)"
        >
          <span class="mr-2 w-5">
            <img :src="coin.image" alt="" />
          </span>
          <span class="mr-2 font-semibold">{{ coin.name }}</span>
          <span class="uppercase">{{ coin.symbol }}</span>
        </li>
        <li v-if="!coins.length" class="p-2 flex items-center">No data</li>
      </ul>
    </div>
  </div>
</template>
