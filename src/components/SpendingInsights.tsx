
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction } from '@/types/transaction';
import { PREDEFINED_CATEGORIES } from '@/types/category';
import { TrendingUp, TrendingDown, AlertTriangle, Lightbulb } from 'lucide-react';

interface SpendingInsightsProps {
  transactions: Transaction[];
}

export const SpendingInsights = ({ transactions }: SpendingInsightsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getInsights = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7);
    
    // Current and last month expenses
    const currentMonthExpenses = transactions
      .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
      .reduce((sum, t) => sum + t.amount, 0);
      
    const lastMonthExpenses = transactions
      .filter(t => t.type === 'expense' && t.date.startsWith(lastMonth))
      .reduce((sum, t) => sum + t.amount, 0);

    // Category analysis for current month
    const categoryTotals: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
      .forEach(t => {
        const category = t.category || 'other';
        categoryTotals[category] = (categoryTotals[category] || 0) + t.amount;
      });

    const topCategory = Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b - a)[0];

    // Calculate trend
    const trend = lastMonthExpenses > 0 
      ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 
      : 0;

    // Average daily spending
    const daysInMonth = new Date().getDate();
    const dailyAverage = currentMonthExpenses / daysInMonth;

    return {
      currentMonthExpenses,
      lastMonthExpenses,
      trend,
      topCategory,
      dailyAverage,
    };
  };

  const insights = getInsights();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Spending Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Monthly Trend */}
          <div className="flex items-center gap-3 p-4 border rounded-lg">
            {insights.trend >= 0 ? (
              <TrendingUp className="h-8 w-8 text-red-500" />
            ) : (
              <TrendingDown className="h-8 w-8 text-green-500" />
            )}
            <div>
              <p className="text-sm text-muted-foreground">Monthly Change</p>
              <p className={`font-semibold ${
                insights.trend >= 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                {insights.trend >= 0 ? '+' : ''}{insights.trend.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Top Category */}
          <div className="flex items-center gap-3 p-4 border rounded-lg">
            <AlertTriangle className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-sm text-muted-foreground">Top Category</p>
              <p className="font-semibold">
                {insights.topCategory 
                  ? PREDEFINED_CATEGORIES.find(cat => cat.id === insights.topCategory[0])?.name || 'Other'
                  : 'None'
                }
              </p>
              <p className="text-sm text-muted-foreground">
                {insights.topCategory ? formatCurrency(insights.topCategory[1]) : formatCurrency(0)}
              </p>
            </div>
          </div>

          {/* Daily Average */}
          <div className="flex items-center gap-3 p-4 border rounded-lg">
            <TrendingUp className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Daily Average</p>
              <p className="font-semibold">{formatCurrency(insights.dailyAverage)}</p>
            </div>
          </div>

          {/* Month Progress */}
          <div className="flex items-center gap-3 p-4 border rounded-lg">
            <Lightbulb className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="font-semibold">{formatCurrency(insights.currentMonthExpenses)}</p>
            </div>
          </div>
        </div>

        {/* Insights Text */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">Key Insights:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {insights.trend > 10 && (
              <li>• Your spending increased by {insights.trend.toFixed(1)}% compared to last month</li>
            )}
            {insights.trend < -10 && (
              <li>• Great job! You reduced spending by {Math.abs(insights.trend).toFixed(1)}% this month</li>
            )}
            {insights.topCategory && (
              <li>• Most of your spending goes to {PREDEFINED_CATEGORIES.find(cat => cat.id === insights.topCategory[0])?.name}</li>
            )}
            <li>• You're spending an average of {formatCurrency(insights.dailyAverage)} per day</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
