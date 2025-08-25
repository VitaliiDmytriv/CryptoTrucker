import { defineStore } from "pinia";
import { ref } from "vue";
import type { CoinsRecord, CoinData, Transaction } from "../types/index";

// Мутаціїї на рівні pinia стору
export const usePortfolioStore = defineStore("portfolio", () => {
  const coins = ref<CoinsRecord>({});

  function addCoin(symbol: string, coin: CoinData) {
    coins.value[symbol] = coin;
  }

  function getCoin(symbol: string): CoinData | undefined {
    return coins.value[symbol];
  }

  function updateTransaction(
    symbol: string,
    id: string,
    updTransaction: Transaction
  ) {
    const transactions = coins.value[symbol].transactions;
    const transaction = transactions.find((t) => t.id === id);
    if (!transaction) {
      // тут потрібно зробити fetch запит знову, бо стор не має цієї транзакції
      return;
    }
    Object.assign(transaction, updTransaction);
  }

  function addTransaction() {}
  function removeTransaction() {}

  return {
    getCoin,
    addCoin,
    coins,
    addTransaction,
    removeTransaction,
    updateTransaction,
  };
});
