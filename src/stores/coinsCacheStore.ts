import { defineStore } from "pinia";
import { ref } from "vue";
import type { CoinsRecord, ErrorResponse } from "../types/index";

export const useCoinsCacheStore = defineStore("coinsCache", () => {
  const coinsCache = ref<CoinsRecord>({});
  const loading = ref(false);
  const error = ref<ErrorResponse | null>(null);

  async function fetchCoinData(symbol: string) {
    if (coinsCache.value[symbol]) return coinsCache.value[symbol];

    loading.value = true;
    resetError();
    try {
      const res = await fetch(`api/${symbol}`);
      const data = await res.json();

      if (!res.ok) {
        error.value = {
          message: data.error,
          code: data.code,
        };
        return null;
      }

      coinsCache.value[symbol] = data;
      return data;
    } catch (err) {
      error.value = {
        message:
          err instanceof Error
            ? err.message
            : `Failed to load data for ${symbol}`,
        code: "network", // Для мережевих помилок
      };
      return null;
    } finally {
      loading.value = false;
    }
  }

  function resetError() {
    error.value = null;
  }

  return {
    resetError,
    fetchCoinData,
    coinsCache,
    loading,
    error,
  };
});
