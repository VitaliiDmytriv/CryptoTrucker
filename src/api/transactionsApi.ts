import type {
  CreateTransaction,
  ApiResponse,
  Transaction,
  SplitTransaction,
  RemoveTransaction,
  EditTransaction,
  MergeTransactions,
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
  const { symbol } = transaction;
  const body = { add: transaction, delete: Array.from(mergeSet) };

  const { data }: AxiosResponse<ApiResponse<MergeTransactions>> = await api.patch(
    `/${symbol}/transactions/merge`,
    body
  );

  handleApiError(data);
  return data;
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
