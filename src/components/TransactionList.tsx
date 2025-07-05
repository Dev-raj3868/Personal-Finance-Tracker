
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Transaction } from '@/types/transaction';
import { TransactionForm } from './TransactionForm';
import { Pencil, Trash2, DollarSign } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onUpdate: (id: string, transaction: Omit<Transaction, 'id'>) => void;
  onDelete: (id: string) => void;
}

export const TransactionList = ({ transactions, onUpdate, onDelete }: TransactionListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
  };

  const handleUpdate = (transaction: Omit<Transaction, 'id'>) => {
    if (editingId) {
      onUpdate(editingId, transaction);
      setEditingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (editingId) {
    const editingTransaction = transactions.find(t => t.id === editingId);
    if (editingTransaction) {
      return (
        <TransactionForm
          onSubmit={handleUpdate}
          editingTransaction={editingTransaction}
          onCancel={handleCancelEdit}
        />
      );
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <DollarSign className="h-6 w-6 text-emerald-600" />
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No transactions yet. Add your first transaction above!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{transaction.description}</h3>
                    <Badge 
                      variant={transaction.type === 'income' ? 'default' : 'secondary'}
                      className={transaction.type === 'income' 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }
                    >
                      {transaction.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(transaction.date)}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <span 
                    className={`font-bold text-lg ${
                      transaction.type === 'income' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </span>
                  
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(transaction)}
                      className="h-8 w-8 p-0 hover:bg-emerald-50 hover:text-emerald-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(transaction.id)}
                      className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
