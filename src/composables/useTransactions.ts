import { ErrorResponse, Transaction } from "@/types/index";
import * as coinsApi from "../api/coinsApi";
import * as transactionApi from "../api/transactionsApi";

// клей між стором, api запитами, обробокю помилок, loading, відправкою даних на UI
export function useTransaction() {
  const portfolio = usePortfolioStore();
  const router = useRouter();

  const loading = ref(false);
  const error = ref<null | ErrorResponse>(null);
  const success = ref(false);

  async function fetchUserPortfolio() {
    loading.value = true;
    resetError();
    try {
      const { data } = await coinsApi.getUserPortfolio();
      const { coins, ...stats } = data;

      portfolio.setCoinList(coins);
      portfolio.updateStats(stats);
      portfolio.isPortfolioLoaded = true;
    } catch (err) {
      error.value = mapError(err);
    } finally {
      loading.value = false;
    }
  }

  async function fetchCoin(symbol: string, refetch = false) {
    const length = portfolio.coins[symbol]?.transactions?.length;
    if (!refetch && length) {
      const inCacheCoin = portfolio.getCoin(symbol);
      if (inCacheCoin) return inCacheCoin;
    }

    loading.value = true;
    error.value = null;

    try {
      const { data } = await coinsApi.getCoin(symbol);
      portfolio.addCoin(data);
      return data;
    } catch (err) {
      error.value = mapError(err);
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function updateTransaction(updTransaction: Transaction) {
    try {
      loading.value = true;
      error.value = null;
      success.value = false;

      const { data } = await transactionApi.editTransaction(updTransaction);
      const symbol = data.transaction.symbol;
      if (data.shoudlRecalc) {
        portfolio.updateCoinStats(symbol, data.coinStats);
        portfolio.updateStats(data.globalStats);
      }
      portfolio.updateTransaction(data.transaction);
      success.value = true;
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

      const { data } = await transactionApi.createTransaction(transaction);
      let symbol: string;

      // якщо нова монета, то додаю повністю, якщо не нова то тоді треба
      // перевіряти чи загружав вже транзакції, тому перевірка на length
      // якщо не 0 то додаю транзакцію, а ні то просто переходжу на монету
      // і там вже fetchCoin підтягне транзакції

      console.log(data);

      if (data.isNewCoin) {
        portfolio.addCoin(data.coin);
        symbol = data.coin.symbol;
      } else {
        symbol = data.transaction.symbol;

        const length = portfolio.coins[symbol].transactions.length;

        if (!length) {
          router.push({ name: "coin", params: { coin: symbol } });
          success.value = true;
          return;
        }
        portfolio.updateCoinStats(symbol, data.coinStats);
        portfolio.addTransaction(data.transaction);
      }

      portfolio.updateStats(data.globalStats);
      success.value = true;
      router.push({ name: "coin", params: { coin: symbol } });
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

      const { data } = await transactionApi.deleteTransaction(id, symbol);

      // якщо coinList без змін, то рефетчимо дані по цій монеі, якщо зі змінами, то оновлюємо coinList, без нової монети
      if (data.isCoinRemoved) {
        portfolio.removeCoin(symbol);
        setTimeout(() => router.push("/"), 1300);
      } else {
        portfolio.updateCoinStats(symbol, data.coinStats);
        portfolio.removeTransaction(symbol, id);
      }

      portfolio.updateStats(data.globalStats);
      success.value = true;

      return { success: true };
    } catch (err) {
      error.value = mapError(err);
    } finally {
      loading.value = false;
    }
  }

  async function mergeTransactions(transaction: Transaction, mergeSet: Set<string>) {
    // try {
    //   loading.value = true;
    //   error.value = null;
    //   success.value = false;
    //   const data = await transactionApi.mergeTransactions(transaction, mergeSet);
    //   console.log(data);
    //   if (data.success) {
    //     portfolio.setNewTransactions(transaction.symbol, data.transactions);
    //     success.value = true;
    //   }
    // } catch (err) {
    //   error.value = mapError(err);
    // } finally {
    //   loading.value = false;
    // }
  }

  async function splitTransaction(soureTransaction: Transaction, targetTransaction: Transaction) {
    try {
      loading.value = true;
      error.value = null;
      success.value = false;

      const { data } = await transactionApi.splitTransaction(soureTransaction, targetTransaction);
      const symbol = data.updatedTransaction.symbol;
      portfolio.splitTransaction(data.updatedTransaction, data.splitedTransaction);
      portfolio.updateCoinStats(symbol, data.coinStats);
      portfolio.updateStats(data.globalStats);

      success.value = true;
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
    fetchUserPortfolio,
    mergeTransactions,
    splitTransaction,
  };
}
