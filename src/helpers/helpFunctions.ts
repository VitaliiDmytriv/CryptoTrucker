import { Transaction } from "@/types";
import { nanoid } from "nanoid";

export function getTodayDate() {
  const date = new Date();

  const year = date.getFullYear().toString();
  const month = date.getMonth().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getDefaultTransaction(symbol: string = "") {
  return {
    symbol,
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
}

export const formatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0, // мінімум знаків після коми
  maximumFractionDigits: 5, // максимум 4 знаки
});

function calculateTotalSpent(quantity: number, pricePerCoin: number) {
  return Number((quantity * pricePerCoin).toFixed(2));
}

function recalculateTransactionProfit(
  transaction: Transaction,
  curentQuantity: number
): Transaction {
  const totalSpent = calculateTotalSpent(
    curentQuantity,
    transaction.pricePerCoinBought as number
  );

  let profit = null;

  if (transaction.pricePerCoinSold) {
    const brutoProfit = curentQuantity * transaction.pricePerCoinSold;
    profit = brutoProfit - totalSpent - (transaction.fees || 0);
  }

  return {
    ...transaction,
    profit,
    totalSpent,
    quantity: curentQuantity,
  };
}

export function createSplitTransactions(
  transaction: Transaction,
  curentQuantity: number,
  splitQuantity: number
) {
  const currentTransaction = recalculateTransactionProfit(
    transaction,
    curentQuantity
  );

  const splitedTransaction = {
    ...currentTransaction,
    id: nanoid(10).toString(),
    quantity: splitQuantity,
    fees: null,
    pricePerCoinSold: null,
    profit: null,
    totalSpent: calculateTotalSpent(
      splitQuantity,
      currentTransaction.pricePerCoinBought as number
    ),
  };

  return [currentTransaction, splitedTransaction];
}
