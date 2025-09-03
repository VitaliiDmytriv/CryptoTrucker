import { defineStore } from "pinia";
import { ref } from "vue";
import type { CoinsRecord, CoinData, Transaction } from "../types/index";
import { useEventBus } from "@vueuse/core";

// Мутаціїї на рівні pinia стору
export const usePortfolioStore = defineStore("portfolio", () => {
  const coins = ref<CoinsRecord>({});
  const coinAddedBus = useEventBus<string>("new-coin");

  function addCoin(symbol: string, coin: CoinData) {
    coins.value[symbol] = coin;
  }

  function getCoin(symbol: string): CoinData | undefined {
    return coins.value[symbol];
  }

  function updateTransaction(updTransaction: Transaction) {
    const transactions = coins.value[updTransaction.symbol].transactions;
    const transaction = transactions.find((t) => t.id === updTransaction.id);
    if (!transaction) {
      // тут потрібно зробити fetch запит знову, бо стор не має цієї транзакції
      return;
    }
    Object.assign(transaction, updTransaction);
  }

  function addTransaction(transaction: Transaction) {
    const coin = coins.value[transaction.symbol];
    if (coin) {
      coin.transactions.push(transaction);
    } else {
      coins.value[transaction.symbol] = {
        coinFullName: transaction.name,
        transactions: [transaction],
      };

      coinAddedBus.emit(transaction.symbol);
    }
  }
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
