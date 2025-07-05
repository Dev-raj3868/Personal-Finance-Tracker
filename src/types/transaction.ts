
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: 'income' | 'expense';
}

export interface MonthlyData {
  month: string;
  expenses: number;
}
