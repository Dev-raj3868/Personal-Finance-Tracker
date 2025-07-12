
import { MonthlyChart } from '@/components/MonthlyChart';
import { CategoryPieChart } from '@/components/CategoryPieChart';
import { BudgetChart } from '@/components/BudgetChart';
import { SpendingInsights } from '@/components/SpendingInsights';
import { useTransactions } from '@/hooks/useTransactions';
import { useBudgets } from '@/hooks/useBudgets';

const Analytics = () => {
  const { transactions } = useTransactions();
  const { budgets } = useBudgets();

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics & Insights</h1>
      </div>

      {/* Spending Insights */}
      <SpendingInsights transactions={transactions} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <MonthlyChart transactions={transactions} />
        <CategoryPieChart transactions={transactions} />
      </div>

      {/* Budget vs Actual Chart */}
      <BudgetChart transactions={transactions} budgets={budgets} />
    </div>
  );
};

export default Analytics;
