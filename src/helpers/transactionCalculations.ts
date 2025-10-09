import { Transaction } from "@/types";
import { nanoid } from "nanoid";
import { toRaw } from "vue";

export function toNumber(value: number | null) {
  return Number(value);
}

// Обчислюємо totalSpent. Залежить від quantity та priceBought, повинно бути > 0
export function calcTotalSpent(quantity: number, priceBought: number) {
  if (quantity > 0 && priceBought > 0) {
    return +(quantity * priceBought).toFixed(2);
  }
  return null;
}

// Обчислюємо profit. Залежить від totalSpent !== null та priceSold, повинно бути > 0
export function calcProfit(
  quantity: number,
  totalSpent: number | null,
  priceSold: number,
  fee: number = 0
) {
  if (totalSpent !== null && priceSold > 0) {
    const profit = priceSold * quantity - totalSpent - fee;
    return +profit.toFixed(2);
  }
  return null;
}

function recalculateTransaction(transaction: Transaction, quantity: number): Transaction {
  const { pricePerCoinBought, pricePerCoinSold } = transaction;
  const totalSpent = calcTotalSpent(quantity, pricePerCoinBought || 0);
  const profit = calcProfit(quantity, totalSpent, pricePerCoinSold || 0);

  return { ...transaction, profit, totalSpent, quantity };
}

export function cloneTransaction(transaction: Transaction, isSameId: boolean = false) {
  const id = isSameId ? transaction.id : nanoid(10).toString();
  return { ...structuredClone(toRaw(transaction)), id };
}

export function cloneTransactionWithDefaults(transaction: Transaction, quantity: number = 0) {
  const base = cloneTransaction(transaction);
  const totalSpent = calcTotalSpent(quantity, base.pricePerCoinBought || 0);

  return {
    ...base,
    quantity,
    totalSpent,
    fees: null,
    pricePerCoinSold: null,
    profit: null,
  };
}
