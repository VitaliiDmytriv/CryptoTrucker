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
