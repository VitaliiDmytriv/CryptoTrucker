export interface Transaction {
  symbol: string;
  name: string;
  id: string;
  image: string;
  quantity: number | null;
  pricePerCoinBought: number | null;
  fees: number | null;
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
  code: "not-found" | "server-error" | "network" | "unexpected" | "unknown";
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

export interface AddProps {
  mode: "add";
  transaction?: never;
}

export interface EditProps {
  mode: "edit";
  transaction: Transaction;
}

export type TransactionFormProps = AddProps | EditProps;

export interface CoinGecko {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
}
