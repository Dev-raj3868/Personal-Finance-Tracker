
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactions } from '@/hooks/useTransactions';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { PREDEFINED_CATEGORIES } from '@/types/category';

const Reports = () => {
  const { transactions } = useTransactions();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Monthly summary
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyTransactions = transactions.filter(t => 
    t.date.startsWith(currentMonth)
  );
  
  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Top categories this month
  const categoryTotals: Record<string, number> = {};
  monthlyTransactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      const category = t.category || 'other';
      categoryTotals[category] = (categoryTotals[category] || 0) + t.amount;
    });

  const topCategories = Object.entries(categoryTotals)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reports</h1>
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(monthlyIncome)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(monthlyExpenses)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              monthlyIncome - monthlyExpenses >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(monthlyIncome - monthlyExpenses)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Top Spending Categories This Month</CardTitle>
        </CardHeader>
        <CardContent>
          {topCategories.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No expenses this month</p>
          ) : (
            <div className="space-y-4">
              {topCategories.map(([categoryId, amount]) => {
                const category = PREDEFINED_CATEGORIES.find(cat => cat.id === categoryId);
                return (
                  <div key={categoryId} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{category?.icon || '📝'}</span>
                      <span className="font-medium">{category?.name || 'Other'}</span>
                    </div>
                    <span className="font-semibold text-red-600">
                      {formatCurrency(amount)}
                    </span>
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

export default Reports;
