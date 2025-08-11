import { defineStore } from "pinia";
import { ref } from "vue";
import type { CoinsRecord } from "../types/index";

export const useCoinsStore = defineStore("coins", () => {
  const coinsList = ref<string[]>([]);
  const coinsCache = ref<CoinsRecord>({});
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchCoinsList() {
    if (coinsList.value.length) return;
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch(`/api/`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      coinsList.value = data;
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = "We couldn't load coins list";
      }
    } finally {
      loading.value = false;
    }
  }

  async function fetchCoinData(symbol: string) {
    if (coinsCache.value[symbol]) return coinsCache.value[symbol];

    // loading.value = true;
    // error.value = null;
    try {
      const res = await fetch(`api/${symbol}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      coinsCache.value[symbol] = data;
      return data;
    } catch (err) {
      // if (err instanceof Error) {
      //   error.value = err.message;
      // } else {
      //   error.value = `Не вдалося завантажити дані для ${symbol}`;
      // }
      return null;
    } finally {
      // loading.value = false;
    }
  }

  return {
    coinsCache,
    coinsList,
    loading,
    error,
    fetchCoinsList,
    fetchCoinData,
  };
});
