import { defineStore } from "pinia";
import { ref } from "vue";
import type { CoinsRecord, Coin, Transaction, GlobalStats } from "../types/index";

// Мутаціїї на рівні pinia стору
export const usePortfolioStore = defineStore("portfolio", () => {
  const stats = ref<GlobalStats | {}>({}); // {"totalProfit": number, "activeInvestment": number}
  const coins = ref<CoinsRecord>({}); // {'UNI': {transactions: [],...}, 'ETH': {transactions: [],...}}=
  const isPortfolioLoaded = ref(false);

  function setCoinList(coinList: CoinsRecord) {
    Object.assign(coins.value, coinList);
  }

  function setStats(updStats: GlobalStats) {
    stats.value = updStats;
  }

  function addCoin(coin: Coin) {
    const symbol = coin.symbol;
    if (coins.value[symbol]) {
      Object.assign(coins.value[symbol], coin);
    } else {
      coins.value[symbol] = coin;
    }
  }

  function getCoin(symbol: string): Coin | undefined {
    return coins.value[symbol];
  }

  function removeCoin(symbol: string) {
    console.log("before delete", coins.value);

    delete coins.value[symbol];
    nextTick(() => console.log("after delete", coins.value));
  }

  // Transactions ======

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
    coins.value[transaction.symbol].transactions.push(transaction);
  }

  function removeTransaction(symbol: string, id: string) {
    const coin = coins.value[symbol];
    if (!coin) return;
    const index = coin.transactions.findIndex((t) => t.id === id);
    if (index !== -1) {
      coin.transactions.splice(index, 1); // реактивно
    }
  }

  function splitTransaction(updTransaction: Transaction, splitedTransaction: Transaction) {
    const symbol = updTransaction.symbol;
    const index = coins.value[symbol].transactions.findIndex((t) => t.id === updTransaction.id);
    if (index !== -1) {
      coins.value[symbol].transactions.splice(index, 1, updTransaction, splitedTransaction);
    }
  }

  return {
    removeTransaction,
    setCoinList,
    isPortfolioLoaded,
    coins,
    stats,
    getCoin,
    addCoin,
    addTransaction,
    updateTransaction,
    splitTransaction,
    setStats,
    removeCoin,
  };
});
