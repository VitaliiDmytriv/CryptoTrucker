import { ErrorResponse, Transaction } from "@/types/index";
import { mapError } from "../helpers/mapError";
import { ref } from "vue";
import * as coinsApi from "../api/coinsApi";
import * as transactionApi from "../api/transactionsApi";
import { usePortfolioStore } from "../stores/portfolioStore";
import router from "@/router/router";
import { createSplitTransactions } from "@/helpers/helpFunctions";

// клей між стором, api запитами, обробокю помилок, loading, відправкою даних на UI
export function useTransaction() {
  const portfolio = usePortfolioStore();

  const loading = ref(false);
  const error = ref<null | ErrorResponse>(null);
  const success = ref(false);

  async function fetchCoinList() {
    loading.value = true;
    resetError();
    try {
      const res = await coinsApi.getCoinList();
      portfolio.setCoinList(res.coins);
    } catch (err) {
      error.value = mapError(err);
    } finally {
      loading.value = false;
    }
  }

  async function fetchCoin(symbol: string, refetch = false) {
    if (!refetch) {
      const inCacheCoin = portfolio.getCoin(symbol);
      if (inCacheCoin) return inCacheCoin;
    }

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

  async function updateTransaction(updTransaction: Transaction) {
    try {
      loading.value = true;
      error.value = null;
      success.value = false;

      const data = await transactionApi.editTransaction(updTransaction);

      if (data.success) {
        portfolio.updateTransaction(updTransaction);
        success.value = true;
      }
    } catch (err) {
      error.value = mapError(err);
    } finally {
      loading.value = false;
    }
  }

  async function addTransaction(transaction: Transaction) {
    try {
      loading.value = true;
      error.value = null;
      success.value = false;

      const data = await transactionApi.createTransaction(transaction);

      if (data.success) {
        portfolio.addTransaction(data.transaction);
        success.value = true;
        router.push(`/${transaction.symbol}`);
      }
    } catch (err) {
      error.value = mapError(err);
    } finally {
      loading.value = false;
    }
  }

  async function removeTransaction(id: string, symbol: string) {
    try {
      loading.value = true;
      error.value = null;
      success.value = false;

      const data = await transactionApi.deleteTransaction(id, symbol);

      console.log(data);

      if (data.success) {
        // якщо coinList без змін, то рефетчимо дані по цій монеі, якщо зі змінами, то оновлюємо coinList, без нової монети
        if (data.coins.length !== portfolio.coinsList.length) {
          portfolio.setCoinList(data.coins);
          portfolio.removeTransaction(symbol);
          router.push("/");
        } else {
          fetchCoin(symbol, true);
        }
        success.value = true;
        console.log(data.coins);

        return { success: true };
      }
    } catch (err) {
      error.value = mapError(err);
    } finally {
      loading.value = false;
    }
  }

  async function mergeTransactions(
    transaction: Transaction,
    mergeSet: Set<string>
  ) {
    try {
      loading.value = true;
      error.value = null;
      success.value = false;

      const data = await transactionApi.mergeTransactions(
        transaction,
        mergeSet
      );

      console.log(data);

      if (data.success) {
        portfolio.setNewTransactions(transaction.symbol, data.transactions);
        success.value = true;
      }
    } catch (err) {
      error.value = mapError(err);
    } finally {
      loading.value = false;
    }
  }

  async function splitTransaction(
    transaction: Transaction,
    curentQuantity: number,
    splitQuantity: number
  ) {
    const [updatedTransaction, splitedTransaction] = createSplitTransactions(
      transaction,
      curentQuantity,
      splitQuantity
    );

    try {
      loading.value = true;
      error.value = null;
      success.value = false;

      const data = await transactionApi.splitTransaction(
        updatedTransaction,
        splitedTransaction
      );

      if (data.success) {
        portfolio.setNewTransactions(
          updatedTransaction.symbol,
          data.transactions
        );
        success.value = true;
      }
    } catch (err) {
      error.value = mapError(err);
    } finally {
      loading.value = false;
    }
  }

  function resetSuccess() {
    success.value = false;
  }

  function resetError() {
    console.log("in resetError");

    error.value = null;
  }

  return {
    fetchCoin,
    resetError,
    error,
    loading,
    resetSuccess,
    success,
    updateTransaction,
    removeTransaction,
    addTransaction,
    fetchCoinList,
    mergeTransactions,
    splitTransaction,
  };
}
