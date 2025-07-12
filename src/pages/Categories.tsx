
import { BudgetManager } from '@/components/BudgetManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PREDEFINED_CATEGORIES } from '@/types/category';
import { PieChart } from 'lucide-react';

const Categories = () => {
  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categories & Budgets</h1>
      </div>

      {/* Budget Management */}
      <BudgetManager />

      {/* Available Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Available Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {PREDEFINED_CATEGORIES.map((category) => (
              <div
                key={category.id}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <span className="text-2xl">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Categories;
