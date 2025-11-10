import { ApiResponse, ApiSuccess, Transaction } from "@/types";
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
    pricePerCoinBought: null,
    fees: null,
    totalSpent: null,
    pricePerCoinSold: null,
    profit: null,
    isActive: false,
    date: getTodayDate(),
  };
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

export function handleApiError<T>(data: ApiResponse<T>): asserts data is ApiSuccess<T> {
  if (!data.success) {
    console.log("EError");
    throw {
      message: data.message ?? "Unknown server error",
      code: data.code ?? "server-error",
    };
  }
}

export function runAfterSuccess(condition: Ref<boolean>, callback: () => void) {
  if (condition.value) {
    setTimeout(() => callback(), 1300);
  }
}
