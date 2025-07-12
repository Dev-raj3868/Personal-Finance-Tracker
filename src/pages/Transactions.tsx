
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { useTransactions } from '@/hooks/useTransactions';

const Transactions = () => {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions();

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Transactions</h1>
      </div>
      
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

export default Transactions;
