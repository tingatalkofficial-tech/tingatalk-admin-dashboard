// Type definitions for the dashboard application

export interface User {
  name: string;
  avatar: string;
}

export interface Card {
  id: string;
  holderName: string;
  balance: number;
  expiryDate: string;
  cvv: string;
  type: 'primary' | 'secondary';
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
}

export interface DailyLimit {
  spent: number;
  total: number;
  percentage: number;
}

export interface SavingPlan {
  id: string;
  name: string;
  icon: string;
  current: number;
  target: number;
  percentage: number;
}

export interface FinancialStat {
  id: string;
  label: string;
  amount: number;
  change: number;
  icon: string;
  type: 'income' | 'expense' | 'savings';
}

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  badge?: number;
  active?: boolean;
  path?: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense';
}
