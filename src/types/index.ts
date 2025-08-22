export interface Transaction {
  name: string;
  id: string;
  quantity: number;
  pricePerCoinBought: number;
  fees: number;
  totalSpent: number | null;
  pricePerCoinSold: null | number;
  profit: null | number;
  isActive: boolean;
  date: string;
}

export interface CoinData {
  coinFullName: string;
  transactions: Transaction[];
}

export interface CoinsRecord {
  [coinSymbol: string]: CoinData;
}

export type FormMode = "add" | "edit";

export interface ErrorResponse {
  message: string;
  code?: "not-found" | "server-error" | "network";
  status?: number;
}

export interface Portfolio {
  totalProfit: number;
  activeInvestment: number;
  coins: string[];
}

export interface CoinsCacheStore {
  coinsCache: CoinsRecord;
  loading: boolean;
  error: ErrorResponse | null;
  fetchCoinData(symbol: string): Promise<any | null>;
  resetError(): void;
  updateTransaction(coin: string, updatedTransaction: Transaction): void;
}
