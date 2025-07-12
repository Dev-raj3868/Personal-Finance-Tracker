
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Transaction, CategoryData } from '@/types/transaction';
import { PREDEFINED_CATEGORIES } from '@/types/category';
import { PieChart as PieChartIcon } from 'lucide-react';

interface CategoryPieChartProps {
  transactions: Transaction[];
}

export const CategoryPieChart = ({ transactions }: CategoryPieChartProps) => {
  const getCategoryData = (): CategoryData[] => {
    const categoryTotals: Record<string, number> = {};

    // Filter only expenses and group by category
    transactions
      .filter(transaction => transaction.type === 'expense')
      .forEach(transaction => {
        const category = transaction.category || 'other';
        categoryTotals[category] = (categoryTotals[category] || 0) + transaction.amount;
      });

    // Convert to array with category details
    return Object.entries(categoryTotals)
      .map(([categoryId, amount]) => {
        const category = PREDEFINED_CATEGORIES.find(cat => cat.id === categoryId) || 
                        PREDEFINED_CATEGORIES.find(cat => cat.id === 'other')!;
        return {
          category: category.name,
          amount: Math.round(amount * 100) / 100,
          color: category.color,
        };
      })
      .sort((a, b) => b.amount - a.amount);
  };

  const categoryData = getCategoryData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }: any) => {
    if (percent < 0.05) return null; // Don't show labels for slices less than 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <PieChartIcon className="h-6 w-6 text-emerald-600" />
          Expenses by Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        {categoryData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No expense data available. Start adding some expenses to see your category breakdown!</p>
          </div>
        ) : (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Amount']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-sm">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
