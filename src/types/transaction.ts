
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: 'income' | 'expense';
  category?: string;
}

export interface MonthlyData {
  month: string;
  expenses: number;
}

export interface CategoryData {
  category: string;
  amount: number;
  color: string;
}
