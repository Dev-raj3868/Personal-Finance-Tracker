
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { PREDEFINED_CATEGORIES } from '@/types/category';
import { useBudgets } from '@/hooks/useBudgets';
import { useTransactions } from '@/hooks/useTransactions';
import { Wallet, Plus } from 'lucide-react';

export const BudgetManager = () => {
  const { setBudget, getCurrentMonthBudgets } = useBudgets();
  const { transactions } = useTransactions();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleSetBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategory && budgetAmount) {
      setBudget(selectedCategory, parseFloat(budgetAmount));
      setSelectedCategory('');
      setBudgetAmount('');
    }
  };

  // Get current month spending by category
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlySpending: Record<string, number> = {};
  
  transactions
    .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
    .forEach(t => {
      const category = t.category || 'other';
      monthlySpending[category] = (monthlySpending[category] || 0) + t.amount;
    });

  const currentBudgets = getCurrentMonthBudgets();

  return (
    <div className="space-y-6">
      {/* Set Budget Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Set Monthly Budget
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSetBudget} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select Category</option>
                  {PREDEFINED_CATEGORIES.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Budget Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button type="submit" className="w-full">
                  Set Budget
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Current Budgets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Current Month Budgets
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentBudgets.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No budgets set for this month. Set your first budget above!
            </p>
          ) : (
            <div className="space-y-4">
              {currentBudgets.map((budget) => {
                const category = PREDEFINED_CATEGORIES.find(cat => cat.id === budget.categoryId);
                const spent = monthlySpending[budget.categoryId] || 0;
                const remaining = budget.amount - spent;
                const percentage = (spent / budget.amount) * 100;
                
                return (
                  <div key={`${budget.categoryId}-${budget.month}`} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{category?.icon}</span>
                        <span className="font-medium">{category?.name}</span>
                      </div>
                      <Badge variant={remaining >= 0 ? 'default' : 'destructive'}>
                        {remaining >= 0 ? 'On Track' : 'Over Budget'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Budgeted: {formatCurrency(budget.amount)}</span>
                        <span>Spent: {formatCurrency(spent)}</span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            percentage <= 100 ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className={remaining >= 0 ? 'text-green-600' : 'text-red-600'}>
                          Remaining: {formatCurrency(remaining)}
                        </span>
                        <span className="text-muted-foreground">
                          {percentage.toFixed(1)}% used
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
