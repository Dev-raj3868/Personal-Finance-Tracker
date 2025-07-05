
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { MonthlyChart } from '@/components/MonthlyChart';
import { useTransactions } from '@/hooks/useTransactions';

const Index = () => {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions();

  const totalBalance = transactions.reduce((sum, transaction) => {
    return transaction.type === 'income' 
      ? sum + transaction.amount 
      : sum - transaction.amount;
  }, 0);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Personal Finance Tracker
          </h1>
          <p className="text-muted-foreground text-lg">
            Track your income and expenses with beautiful visualizations
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-emerald-100">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Balance</h3>
            <p className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalBalance)}
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-green-100">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Income</h3>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(totalIncome)}
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-red-100">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Expenses</h3>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(totalExpenses)}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <TransactionForm onSubmit={addTransaction} />
            <MonthlyChart transactions={transactions} />
          </div>

          {/* Right Column */}
          <div>
            <TransactionList
              transactions={transactions}
              onUpdate={updateTransaction}
              onDelete={deleteTransaction}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
