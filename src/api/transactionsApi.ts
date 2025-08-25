import type { Transaction } from "../types/index";

//  api запити
export async function editTransaction(
  symbol: string,
  id: string,
  transaction: Transaction
) {
  const response = await fetch(`api/${symbol}/transactions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction),
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: data.message ?? "Unknown server error",
      code: data.code ?? "server-error",
    };
  }

  return data;
}

export async function createTransaction() {}

export async function deleteTransaction() {}
