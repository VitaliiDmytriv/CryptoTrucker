import { Transaction } from "@/types";
import { ElMessageBox } from "element-plus";
import { nanoid } from "nanoid";

export function getTodayDate() {
  const date = new Date();

  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
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
    pricePerCoinBought: 100,
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

export function isTransactionValid(transaction: Transaction): boolean {
  const { quantity, pricePerCoinBought, pricePerCoinSold, fees } = transaction;
  if (!quantity) return false;
  if (quantity < 0) return false;
  if (!pricePerCoinBought) return false;
  if (pricePerCoinBought < 0) return false;
  if (Number(fees) < 0) return false;
  if (Number(pricePerCoinSold) < 0) return false;

  return true;
}

export function handleDeleteTransaction(callback: Function) {
  ElMessageBox.confirm("Are you sure you want to remove this transaction?", "Warning", {
    confirmButtonText: "Remove",
    cancelButtonText: "Cancel",
    center: true,
  }).then(() => {
    callback();
  });
}

export function formatCryptoValue(
  value: any,
  type: "currency" | "quantity" | "money" = "currency"
): string {
  const num = Number(value);
  if (isNaN(num) || num === 0) return "-";

  if (type === "currency") {
    if (num < 0.01) return num.toFixed(6); // дуже дрібні ціни, типу DOGE
    if (num < 1) return num.toFixed(4); // дрібні ціни
    return num.toFixed(2); // звичайні ціни
  }

  if (type === "quantity") {
    if (num < 0.01) return num.toFixed(6); // дуже дрібні кількості
    if (num < 1) return num.toFixed(4); // дрібні кількості
    return num.toFixed(2); // великі кількості
  }

  if (type === "money") {
    return num.toFixed(2); // профіт, totalSpent тощо — завжди 2 знаки після коми
  }

  return num.toString();
}
