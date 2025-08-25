import { defineStore } from "pinia";
import { ref } from "vue";
import type { Portfolio } from "../types/index";

export const usePortfolioAnoteheStore = defineStore("portfolioAnother", () => {
  const portfolio = ref<Portfolio | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

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

  return {
    portfolio,
    loading,
    error,
    fetchPortfolioData,
  };
});
