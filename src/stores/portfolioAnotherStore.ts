import { defineStore } from "pinia";
import { ref } from "vue";
import type { Portfolio } from "../types/index";
import { useEventBus } from "@vueuse/core";

export const usePortfolioAnoteheStore = defineStore("portfolioAnother", () => {
  const portfolio = ref<Portfolio | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const coinAddedBus = useEventBus<string>("new-coin");

  async function fetchPortfolioData() {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch(`/api/`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      portfolio.value = data;
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

  function addNewCoin(symbol: string) {
    portfolio.value?.coins.push(symbol);
  }

  coinAddedBus.on((symbol) => {
    console.log("bus worked");

    addNewCoin(symbol);
  });

  return {
    portfolio,
    loading,
    error,
    fetchPortfolioData,
  };
});
