import { defineStore } from "pinia";
import { ref } from "vue";
import type { CoinsRecord, CoinData, Transaction, GlobalStats } from "../types/index";

// Мутаціїї на рівні pinia стору
export const usePortfolioStore = defineStore("portfolio", () => {
  const coinsList = ref<string[]>([]); // ['UNI','ETH'...]
  const stats = ref<GlobalStats | {}>({}); // {"totalProfit": number, "activeInvestment": number}
  const coins = ref<CoinsRecord>({}); // {'UNI': {transactions: [],...}, 'ETH': {transactions: [],...}}=

  function setCoinList(coins: string[]) {
    coinsList.value = coins;
  }

  function setStats(updStats: GlobalStats) {
    stats.value = updStats;
  }

  function addCoin(symbol: string, coin: CoinData) {
    if (coins.value[symbol]) {
      Object.assign(coins.value[symbol], coin);
    } else {
      coins.value[symbol] = coin;
    }
  }

  function getCoin(symbol: string): CoinData | undefined {
    return coins.value[symbol];
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
    console.log(coins.value);

    // якщо монета є у коінлисті, то дивимось ми вже загружали її, якщо так то додаємо транзакцію
    if (coinsList.value.includes(transaction.symbol)) {
      const coin = coins.value[transaction.symbol];
      if (coin) {
        coin.transactions.push(transaction);
      }
    } else {
      coins.value[transaction.symbol] = {
        coinFullName: transaction.name,
        transactions: [transaction],
      };
      coinsList.value.push(transaction.symbol);
    }
  }

  function removeTransaction(symbol: string) {
    delete coins.value[symbol];
    console.log(coins.value);
  }

  function setNewTransactions(symbol: string, transactions: Transaction[]) {
    coins.value[symbol].transactions = transactions;
  }

  return {
    removeTransaction,
    setCoinList,
    coinsList,
    coins,
    stats,
    getCoin,
    addCoin,
    addTransaction,
    updateTransaction,
    setNewTransactions,
    setStats,
  };
});
