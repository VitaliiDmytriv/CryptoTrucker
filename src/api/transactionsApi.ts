import type { Transaction } from "../types/index";

//  api запити
export async function editTransaction(transaction: Transaction) {
  const response = await fetch(
    `api/${transaction.symbol}/transactions/${transaction.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: data.message ?? "Unknown server error",
      code: data.code ?? "server-error",
    };
  }

  return data;
}

export async function createTransaction(transaction: Transaction) {
  const response = await fetch(
    `api/${transaction.symbol.toUpperCase()}/transactions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: data.message ?? "Unknown server error",
      code: data.code ?? "server-error",
    };
  }

  return data;
}

export async function deleteTransaction() {}
