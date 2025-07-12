
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Transaction } from '@/types/transaction';
import { PREDEFINED_CATEGORIES } from '@/types/category';
import { List, Pencil, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface TransactionListProps {
  transactions: Transaction[];
  onUpdate: (id: string, transaction: Omit<Transaction, 'id'>) => void;
  onDelete: (id: string) => void;
}

export const TransactionList = ({ transactions, onDelete }: TransactionListProps) => {
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return b.amount - a.amount;
  });

  const getCategoryInfo = (categoryId?: string) => {
    if (!categoryId) return null;
    return PREDEFINED_CATEGORIES.find(cat => cat.id === categoryId);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-2xl font-bold">
            <List className="h-6 w-6 text-emerald-600" />
            Recent Transactions
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'date' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('date')}
            >
              Date
            </Button>
            <Button
              variant={sortBy === 'amount' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('amount')}
            >
              Amount
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No transactions yet. Add your first transaction above!</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {sortedTransactions.map((transaction) => {
              const category = getCategoryInfo(transaction.category);
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {category && (
                      <span className="text-xl">{category.icon}</span>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{transaction.description}</p>
                        <Badge
                          variant={transaction.type === 'income' ? 'default' : 'secondary'}
                          className={
                            transaction.type === 'income'
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }
                        >
                          {transaction.type}
                        </Badge>
                        {category && (
                          <Badge variant="outline" className="text-xs">
                            {category.name}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-semibold ${
                          transaction.type === 'income'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this transaction? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(transaction.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
