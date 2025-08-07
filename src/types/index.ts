export interface Transaction {
  name: string;
  id: number;
  quantity: number;
  pricePerCoinBought: number;
  fees: number;
  totalSpent: number;
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

export type FormMode = 'add'|'edit'