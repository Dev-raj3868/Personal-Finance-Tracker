
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { MonthlyChart } from '@/components/MonthlyChart';
import { CategoryPieChart } from '@/components/CategoryPieChart';
import { DashboardSummary } from '@/components/DashboardSummary';
import { useTransactions } from '@/hooks/useTransactions';

const Index = () => {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions();

  return (
    <div className="space-y-8 p-6">
      {/* Dashboard Summary */}
      <DashboardSummary transactions={transactions} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <MonthlyChart transactions={transactions} />
        <CategoryPieChart transactions={transactions} />
      </div>

      {/* Form and Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TransactionForm onSubmit={addTransaction} />
        <TransactionList
          transactions={transactions}
          onUpdate={updateTransaction}
          onDelete={deleteTransaction}
        />
      </div>
    </div>
  );
};

export default Index;
