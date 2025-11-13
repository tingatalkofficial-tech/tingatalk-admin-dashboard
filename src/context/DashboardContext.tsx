import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  User,
  Card,
  DailyLimit,
  SavingPlan,
  FinancialStat,
  MenuItem,
  QuickAction,
} from '../types';

interface DashboardContextType {
  user: User;
  card: Card;
  dailyLimit: DailyLimit;
  savingPlans: SavingPlan[];
  financialStats: FinancialStat[];
  menuItems: MenuItem[];
  quickActions: QuickAction[];
  updateDailyLimit: (spent: number) => void;
  updateSavingPlan: (id: string, current: number) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const [user] = useState<User>({
    name: 'Andrew Forbist',
    avatar: '/assets/avatar.png',
  });

  const [card] = useState<Card>({
    id: '1',
    holderName: 'Andrew Forbist',
    balance: 562000,
    expiryDate: '11/29',
    cvv: '323',
    type: 'primary',
  });

  const [dailyLimit, setDailyLimit] = useState<DailyLimit>({
    spent: 2500,
    total: 20000,
    percentage: 12.5,
  });

  const [savingPlans, setSavingPlans] = useState<SavingPlan[]>([
    {
      id: '1',
      name: 'Emergency Fund',
      icon: 'shield',
      current: 5000,
      target: 10000,
      percentage: 50,
    },
    {
      id: '2',
      name: 'Vacation Fund',
      icon: 'plane',
      current: 3000,
      target: 5000,
      percentage: 60,
    },
    {
      id: '3',
      name: 'Home Down Payment',
      icon: 'home',
      current: 7250,
      target: 20000,
      percentage: 36.25,
    },
  ]);

  const [financialStats] = useState<FinancialStat[]>([
    {
      id: '1',
      label: 'Total Income',
      amount: 78000,
      change: 1.78,
      icon: 'income',
      type: 'income',
    },
    {
      id: '2',
      label: 'Total Expense',
      amount: 43000,
      change: -1.78,
      icon: 'expense',
      type: 'expense',
    },
    {
      id: '3',
      label: 'Total Savings',
      amount: 35000,
      change: 2.5,
      icon: 'savings',
      type: 'savings',
    },
  ]);

  const [menuItems] = useState<MenuItem[]>([
    { id: '1', label: 'Analytics', icon: 'dashboard', path: '/analytics' },
    { id: '2', label: 'Users', icon: 'payments', path: '/users' },
    { id: '3', label: 'Calls', icon: 'transactions', path: '/calls' },
    { id: '4', label: 'Earnings', icon: 'invoices' },
    { id: '5', label: 'Reports', icon: 'insights' },
    { id: '6', label: 'Settings', icon: 'cards' },
  ]);

  const [quickActions] = useState<QuickAction[]>([
    { id: '1', label: 'Top Up', icon: 'topup' },
    { id: '2', label: 'Transfer', icon: 'transfer' },
    { id: '3', label: 'Request', icon: 'request' },
    { id: '4', label: 'History', icon: 'history' },
  ]);

  const updateDailyLimit = (spent: number) => {
    const percentage = (spent / dailyLimit.total) * 100;
    setDailyLimit({ ...dailyLimit, spent, percentage });
  };

  const updateSavingPlan = (id: string, current: number) => {
    setSavingPlans((plans) =>
      plans.map((plan) =>
        plan.id === id
          ? { ...plan, current, percentage: (current / plan.target) * 100 }
          : plan
      )
    );
  };

  return (
    <DashboardContext.Provider
      value={{
        user,
        card,
        dailyLimit,
        savingPlans,
        financialStats,
        menuItems,
        quickActions,
        updateDailyLimit,
        updateSavingPlan,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
