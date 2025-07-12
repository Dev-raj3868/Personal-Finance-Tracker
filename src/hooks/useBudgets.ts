
import { useState, useEffect } from 'react';
import { Budget } from '@/types/budget';

export const useBudgets = () => {
  const [budgets, setBudgets] = useState<Record<string, Budget>>({});

  // Load budgets from localStorage on mount
  useEffect(() => {
    const savedBudgets = localStorage.getItem('budgets');
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets));
    }
  }, []);

  // Save budgets to localStorage whenever budgets change
  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  const setBudget = (categoryId: string, amount: number) => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const budgetKey = `${categoryId}-${currentMonth}`;
    
    setBudgets(prev => ({
      ...prev,
      [budgetKey]: {
        categoryId,
        amount,
        month: currentMonth,
      },
    }));
  };

  const getBudget = (categoryId: string, month?: string) => {
    const targetMonth = month || new Date().toISOString().slice(0, 7);
    const budgetKey = `${categoryId}-${targetMonth}`;
    return budgets[budgetKey];
  };

  const getCurrentMonthBudgets = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    return Object.values(budgets).filter(budget => budget.month === currentMonth);
  };

  return {
    budgets,
    setBudget,
    getBudget,
    getCurrentMonthBudgets,
  };
};
