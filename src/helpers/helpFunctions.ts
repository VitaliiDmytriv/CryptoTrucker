import { Transaction } from "@/types";
import { ElMessageBox } from "element-plus";
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
