import { ErrorResponse, Transaction } from "@/types/index";
import { mapError } from "../helpers/mapError";
import { ref } from "vue";
import * as coinsApi from "../api/coinsApi";
import * as transactionApi from "../api/transactionsApi";
import { usePortfolioStore } from "../stores/portfolioStore";

// клей між стором, api запитами, обробокю помилок, loading, відправкою даних на UI
export function useTransactions() {
  const portfolio = usePortfolioStore();

  const loading = ref(false);
  const error = ref<null | ErrorResponse>(null);
  const success = ref(false);

  async function fetchCoin(symbol: string) {
    const inCacheCoin = portfolio.getCoin(symbol);
    if (inCacheCoin) return inCacheCoin;

    loading.value = true;
    error.value = null;

    try {
      const coinData = await coinsApi.getCoin(symbol);
      portfolio.addCoin(symbol, coinData);
      return coinData;
    } catch (err) {
      error.value = mapError(err);
    } finally {
      loading.value = false;
    }
  }

  async function updateTransaction(
    symbol: string,
    id: string,
    updTransaction: Transaction
  ) {
    try {
      loading.value = true;
      error.value = null;
      success.value = false;

      const data = await transactionApi.editTransaction(
        symbol,
        id,
        updTransaction
      );

      if (data.success) {
        portfolio.updateTransaction(symbol, id, updTransaction);
        success.value = true;
      }
    } catch (err) {
      error.value = mapError(err);
    } finally {
      loading.value = false;
    }
  }
  async function removeTransaction() {}
  async function addTransaction() {}

  function resetSuccess() {
    success.value = false;
  }
  return {
    fetchCoin,
    error,
    loading,
    resetSuccess,
    success,
    updateTransaction,
    removeTransaction,
    addTransaction,
  };
}
