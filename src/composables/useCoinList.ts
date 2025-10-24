import { getCoinsList, updateCoinsList } from "@/api/coinsGeckoApi";
import { mapError } from "@/helpers/mapError";
import { CoinGecko, ErrorResponse } from "@/types";
import { ref } from "vue";

export function useCoinList() {
  const loading = ref(false);
  const error = ref<null | ErrorResponse>(null);
  const defaultCoinList = ref<CoinGecko[]>([]);
  const coinList = ref<CoinGecko[]>([]);

  async function fetchCoinList(search: string) {
    try {
      error.value = null;
      loading.value = true;
      if (search === "" && defaultCoinList.value.length) {
        coinList.value = defaultCoinList.value;
        return;
      }
      const { data } = await getCoinsList(search);

      if (search === "" && !defaultCoinList.value.length) {
        console.log("defaultCoinList resigned");

        defaultCoinList.value = data.coins;
      }
      coinList.value = data.coins;
    } catch (err) {
      error.value = mapError(err);
    } finally {
      loading.value = false;
    }
  }

  fetchCoinList("");

  return {
    loading,
    error,
    coinList,
    fetchCoinList,
  };
}
