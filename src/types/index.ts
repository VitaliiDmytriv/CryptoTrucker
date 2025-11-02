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

export interface Coin {
  name: string;
  symbol: string;
  image: string;
  totalProfit: number;
  activeInvestment: number;
  holdings: number;
  avgPrice: number;
  transactions: Transaction[];
}

export type CoinsRecord = Record<string, Coin>;

export type FormMode = "add" | "edit" | "merge";

export interface ErrorResponse {
  message: string;
  code: "not-found" | "server-error" | "network" | "unexpected" | "unknown";
  status?: number;
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
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_percentage_24h: number;
  price_change_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: null;
  last_updated: string;
}

export interface CoinListData {
  coins: CoinGecko[];
}

export interface UserPortfolio extends GlobalStats {
  coins: Record<string, Coin>;
}

export interface GlobalStats {
  totalProfit: number;
  activeInvestment: number;
}

export type CoinStats = Partial<Coin>;

// ServerSide ======================

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

export type createTransaction =
  | {
      isNewCoin: true;
      coin: Coin;
      globalStats: GlobalStats;
    }
  | {
      globalStats: GlobalStats;
      isNewCoin: false;
      transaction: Transaction;
      coinStats: CoinStats;
    };

export interface SplitTransaction {
  updatedTransaction: Transaction;
  splitedTransaction: Transaction;
  globalStats: GlobalStats;
  coinStats: CoinStats;
}

export type RemoveTransaction =
  | {
      isCoinRemoved: true;
      globalStats: GlobalStats;
    }
  | {
      isCoinRemoved: false;
      globalStats: GlobalStats;
      coinStats: CoinStats;
    };

export type EditTransaction =
  | {
      shoudlRecalc: true;
      transaction: Transaction;
      globalStats: GlobalStats;
      coinStats: CoinStats;
    }
  | {
      shoudlRecalc: false;
      transaction: Transaction;
    };
