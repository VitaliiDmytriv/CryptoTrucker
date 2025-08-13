import { defineStore } from "pinia";
import { ref } from "vue";

export const useCoinsStore = defineStore("coins", () => {
  const coinsList = ref<string[]>([]);
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

  return {
    coinsList,
    loading,
    error,
    fetchCoinsList,
  };
});
