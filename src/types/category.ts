
export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const PREDEFINED_CATEGORIES: Category[] = [
  { id: 'food', name: 'Food & Dining', icon: '🍽️', color: 'hsl(15, 80%, 60%)' },
  { id: 'transport', name: 'Transportation', icon: '🚗', color: 'hsl(200, 80%, 60%)' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: 'hsl(280, 80%, 60%)' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: 'hsl(320, 80%, 60%)' },
  { id: 'health', name: 'Health & Fitness', icon: '⚕️', color: 'hsl(120, 80%, 60%)' },
  { id: 'bills', name: 'Bills & Utilities', icon: '💡', color: 'hsl(45, 80%, 60%)' },
  { id: 'education', name: 'Education', icon: '📚', color: 'hsl(240, 80%, 60%)' },
  { id: 'travel', name: 'Travel', icon: '✈️', color: 'hsl(180, 80%, 60%)' },
  { id: 'other', name: 'Other', icon: '📝', color: 'hsl(0, 0%, 60%)' },
];
