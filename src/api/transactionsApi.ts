import type {
  CreateTransaction,
  ApiResponse,
  Transaction,
  SplitTransaction,
  RemoveTransaction,
  EditTransaction,
} from "../types/index";
import type { AxiosResponse } from "axios";
import api from "@/api/api";

//  api запити
export async function editTransaction(transaction: Transaction) {
  const { symbol, id } = transaction;
  const { data }: AxiosResponse<ApiResponse<EditTransaction>> = await api.put(
    `/${symbol}/transactions/${id}`,
    transaction
  );

  handleApiError(data);

  return data;
}

export async function createTransaction(transaction: Transaction) {
  const { symbol } = transaction;
  const { data }: AxiosResponse<ApiResponse<CreateTransaction>> = await api.post(
    `/${symbol}/transactions`,
    transaction
  );

  handleApiError(data);

  return data;
}

export async function deleteTransaction(id: string, symbol: string) {
  const { data }: AxiosResponse<ApiResponse<RemoveTransaction>> = await api.delete(
    `/${symbol}/transactions/${id}`
  );
  handleApiError(data);
  return data;
}

export async function mergeTransactions(transaction: Transaction, mergeSet: Set<string>) {
  // const body = { add: transaction, delete: Array.from(mergeSet) };
  // const response = await fetch(`api/${transaction.symbol}/transactions/merge`, {
  //   method: "PATCH",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(body),
  // });
  // const data = await response.json();
  // if (!response.ok) {
  //   throw {
  //     message: data.message ?? "Unknown server error",
  //     code: data.code ?? "server-error",
  //   };
  // }
  // return data;
}

export async function splitTransaction(
  updatedTransaction: Transaction,
  splitedTransaction: Transaction
) {
  const { symbol } = updatedTransaction;
  const body = { updatedTransaction, splitedTransaction };

  const { data }: AxiosResponse<ApiResponse<SplitTransaction>> = await api.patch(
    `/${symbol}/transactions/split`,
    body
  );

  handleApiError(data);

  return data;
}
