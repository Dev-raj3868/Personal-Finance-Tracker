
export interface Budget {
  categoryId: string;
  amount: number;
  month: string; // YYYY-MM format
}

export interface BudgetData {
  category: string;
  budgeted: number;
  actual: number;
  remaining: number;
  color: string;
}
