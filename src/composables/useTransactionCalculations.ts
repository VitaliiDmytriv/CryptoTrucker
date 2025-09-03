import { computed, ref, watch, toRaw } from "vue";
import type { Transaction, TransactionFormProps } from "../types/index";
import { getTodayDate } from "@/helpers/helpFunctions";
import { nanoid } from "nanoid";

export function useTransactionCalculations(props: TransactionFormProps) {
  const defaultTransaction = {
    symbol: "",
    name: "",
    id: nanoid(10).toString(),
    image: "",
    quantity: null,
    pricePerCoinBought: null,
    fees: null,
    totalSpent: null,
    pricePerCoinSold: null,
    profit: null,
    isActive: false,
    date: getTodayDate(),
  };
  // перевірка на тип моду, якщо add то дефолтний обєкт для нової транзакціїї, якщо ні, то транзакція з пропсу для змін
  const source = props.mode === "add" ? defaultTransaction : props.transaction;

  // створення локального реф обєкту для роботи з формою
  const localTransaction = ref<Transaction>(structuredClone(toRaw(source)));

  // Convert all user inputs to numbers for consistent calculations
  const quantity = computed(() => Number(localTransaction.value.quantity));
  const priceBought = computed(() =>
    Number(localTransaction.value.pricePerCoinBought)
  );
  const priceSold = computed(() =>
    Number(localTransaction.value.pricePerCoinSold)
  );
  const fees = computed(() => Number(localTransaction.value.fees));

  // Обчислюємо totalSpent. Залежить від quantity та priceBought, повинно бути > 0
  const totalSpent = computed(() => {
    if (quantity.value > 0 && priceBought.value > 0) {
      return Number((quantity.value * priceBought.value).toFixed(2));
    }
    return null;
  });

  // Обчислюємо profit. Залежить від totalSpent !== null та priceSold, повинно бути > 0
  const profit = computed(() => {
    const convertedFee = Math.max(0, fees.value);

    if (totalSpent.value !== null && priceSold.value > 0) {
      const profitValue =
        priceSold.value * quantity.value - totalSpent.value - convertedFee;
      return Number(profitValue.toFixed(2));
    }
    return null;
  });

  // оновлюємо поля localTransaction
  watch([totalSpent, profit], ([newTotalSpent, newProfit]) => {
    localTransaction.value.totalSpent = newTotalSpent;
    localTransaction.value.profit = newProfit;
  });

  return { localTransaction };
}
