
export type Category = 'Grains' | 'Spices' | 'Vegetables' | 'Dairy' | 'Meat' | 'Oil & Ghee' | 'Fruits' | 'Miscellaneous';
export type TransactionType = 'ADD' | 'WITHDRAW';

export interface StockItem {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  unit: string;
  minThreshold: number;
  lastUpdated: string;
  pricePerUnit?: number;
  seasonalTrend?: string;
}

export interface Transaction {
  id: string;
  itemId: string;
  itemName: string;
  type: TransactionType;
  amount: number;
  timestamp: string;
  reason?: string;
}

export interface IntelligenceTip {
  title: string;
  description: string;
  type: 'WARNING' | 'INFO' | 'SUCCESS';
  items?: string[];
}
