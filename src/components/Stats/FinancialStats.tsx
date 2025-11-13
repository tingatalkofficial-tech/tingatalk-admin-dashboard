import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import StatCard from './StatCard';

const FinancialStats: React.FC = () => {
  const { financialStats } = useDashboard();

  return (
    <div className="flex w-full gap-[18px] flex-wrap
      /* Mobile: Single column */
      flex-col
      /* Tablet: Two columns */
      sm:flex-row
      /* Desktop: Three columns */
      md:flex-row
    ">
      {financialStats.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
};

export default FinancialStats;
