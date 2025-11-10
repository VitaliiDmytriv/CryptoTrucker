import { Transaction } from "@/types";

const EDITABLE_KEYS: (keyof Transaction)[] = [
  "fees",
  "date",
  "pricePerCoinBought",
  "pricePerCoinSold",
  "quantity",
];

export function areTransactionsEqual(a: Transaction, b: Transaction) {
  // console.log(a);
  // console.log(b);

  const result = EDITABLE_KEYS.every((key) => a[key] === b[key]);
  return result;
}
