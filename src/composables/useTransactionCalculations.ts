import { computed, ref, watch, toRaw } from "vue";
import type { Transaction, TransactionFormProps } from "../types/index";
import { getDefaultTransaction } from "@/helpers/helpFunctions";
import { toNumber, calcTotalSpent, calcProfit } from "@/helpers/transactionCalculations";

export function useTransactionCalculations(props: TransactionFormProps) {
  const defaultTransaction = getDefaultTransaction();
  // перевірка на тип моду, якщо add то дефолтний обєкт для нової транзакціїї, якщо ні, то транзакція з пропсу для змін
  const source = props.mode === "add" ? defaultTransaction : props.transaction;

  // створення локального реф обєкту для роботи з формою
  const localTransaction = ref<Transaction>(structuredClone(toRaw(source)));

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
