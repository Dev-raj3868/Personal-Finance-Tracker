
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Transaction } from '@/types/transaction';
import { Budget } from '@/types/budget';
import { PREDEFINED_CATEGORIES } from '@/types/category';
import { BarChart3 } from 'lucide-react';

interface BudgetChartProps {
  transactions: Transaction[];
  budgets: Record<string, Budget>;
}

export const BudgetChart = ({ transactions, budgets }: BudgetChartProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getBudgetData = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    // Get current month spending by category
    const monthlySpending: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
      .forEach(t => {
        const category = t.category || 'other';
        monthlySpending[category] = (monthlySpending[category] || 0) + t.amount;
      });

    // Get current month budgets
    const currentBudgets = Object.values(budgets).filter(budget => budget.month === currentMonth);
    
    return currentBudgets.map(budget => {
      const category = PREDEFINED_CATEGORIES.find(cat => cat.id === budget.categoryId);
      const spent = monthlySpending[budget.categoryId] || 0;
      
      return {
        category: category?.name || 'Other',
        budgeted: budget.amount,
        actual: spent,
        remaining: Math.max(0, budget.amount - spent),
      };
    });
  };

  const budgetData = getBudgetData();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <BarChart3 className="h-6 w-6 text-emerald-600" />
          Budget vs Actual Spending
        </CardTitle>
      </CardHeader>
      <CardContent>
        {budgetData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No budgets set for this month. Go to Categories to set your budgets!</p>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="category" 
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={formatCurrency}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    formatCurrency(value), 
                    name === 'budgeted' ? 'Budget' : 'Actual'
                  ]}
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="budgeted" 
                  fill="#10b981" 
                  name="Budget"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="actual" 
                  fill="#ef4444" 
                  name="Actual"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
