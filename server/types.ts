export interface Session {
  sessionId: string;
  userId: string;
  createdAt: string; // ISO date string
  expiresAt: string; // ISO date string
}

export interface SessionsData {
  sessions: Session[];
}

export interface UsersData {
  users: User[];
}

export interface User {
  id: string;
  userName: string;
  email: string;
  password: string;
  totalProfit: number;
  activeInvestment: number;
  coins: Record<string, Coin>;
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

export interface CoinStats {
  totalProfit: number;
  activeInvestment: number;
  holdings: number;
  avgPrice: number;
}

export interface GlobalStats {
  totalProfit: number;
  activeInvestment: number;
}

export interface Transaction {
  symbol: string;
  name: string;
  id: string;
  image: string;
  quantity: number;
  pricePerCoinBought: number;
  fees: number | null;
  totalSpent: number;
  pricePerCoinSold: null | number;
  profit: null | number;
  date: string;
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
