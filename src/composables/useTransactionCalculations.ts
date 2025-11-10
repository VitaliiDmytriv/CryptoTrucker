import type { Transaction, TransactionCalculations } from "../types/index";

export function useTransactionCalculations(props: TransactionCalculations) {
  const defaultTx = getDefaultTransaction();
  // перевірка на тип моду, якщо add то дефолтний обєкт для нової транзакціїї, якщо ні, то транзакція з пропсу для змін
  const initialTx = props.mode === "add" ? defaultTx : props.transaction ?? defaultTx;

  // створення локального реф обєкту для роботи з формою
  const localTransaction = ref<Transaction>(structuredClone(toRaw(initialTx)));

  const quantity = computed(() => toNumber(localTransaction.value.quantity));
  const priceBought = computed(() => toNumber(localTransaction.value.pricePerCoinBought));
  const priceSold = computed(() => toNumber(localTransaction.value.pricePerCoinSold));
  const fees = computed(() => toNumber(localTransaction.value.fees));

  const totalSpent = computed(() => calcTotalSpent(quantity.value, priceBought.value));
  const profit = computed(() =>
    calcProfit(quantity.value, totalSpent.value, priceSold.value, fees.value)
  );

  // оновлюємо поля localTransaction
  watch([totalSpent, profit], ([newTotalSpent, newProfit]) => {
    localTransaction.value.totalSpent = newTotalSpent;
    localTransaction.value.profit = newProfit;
  });

  return { localTransaction };
}
