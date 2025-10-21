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

export type CoinsRecord = Record<string, CoinData>;

export type FormMode = "add" | "edit" | "merge";

export interface ErrorResponse {
  message: string;
  code: "not-found" | "server-error" | "network" | "unexpected" | "unknown";
  status?: number;
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
  mergeSet?: Set<string>;
  dialogVisible: boolean;
}

export interface EditProps {
  mode: "edit";
  transaction: Transaction;
  mergeSet?: Set<string>;
  dialogVisible: boolean;
}
export interface MergeProps {
  mode: "merge";
  transaction: Transaction;
  mergeSet: Set<string>;
  dialogVisible: boolean;
}

export type TransactionFormProps = AddProps | EditProps | MergeProps;

export interface TransactionCalculations {
  mode: FormMode;
  transaction?: Transaction;
}

export interface CoinGecko {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
}

export interface GlobalStats {
  totalProfit: number;
  activeInvestment: number;
}

export interface PortfolioData {
  coins: string[];
  stats: GlobalStats;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  code?: number;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
