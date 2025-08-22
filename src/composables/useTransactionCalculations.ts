import { computed, ref, watch, toRaw } from "vue";
import type { Transaction } from "../types/index";

export function useTransactionCalculations(transaction: Transaction) {
  const localTransaction = ref<Transaction>(
    structuredClone(toRaw(transaction))
  );
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

  // Watch для побічного ефекту: оновлюємо поля localTransaction
  // Computed-властивості лише для читання, тому використовуємо watch для запису
  watch([totalSpent, profit], ([newTotalSpent, newProfit]) => {
    localTransaction.value.totalSpent = newTotalSpent;
    localTransaction.value.profit = newProfit;
  });

  return { localTransaction };
}
