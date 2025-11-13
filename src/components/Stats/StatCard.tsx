import React from 'react';
import { FinancialStat } from '../../types';

interface StatCardProps {
  stat: FinancialStat;
}

const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  const isPositive = stat.change > 0;
  const changeColor = isPositive ? 'bg-[#bbf49c] text-[#1e4841]' : 'bg-[#fcced1] text-[#f63440]';
  
  const getIcon = (icon: string): string => {
    const icons: Record<string, string> = {
      income: '💵',
      expense: '💸',
      savings: '💰',
    };
    return icons[icon] || '💰';
  };

  return (
    <div className="flex pt-[16px] pr-[16px] pb-[16px] pl-[16px] flex-col gap-[28px] rounded-[16px] border-solid border border-[#e4e6e5]
      /* Mobile: Full width */
      w-full
      /* Tablet: Half width minus gap */
      sm:w-[calc(50%-9px)]
      /* Desktop: Flexible with minimum width */
      md:flex-1 md:min-w-[160px]
    ">
      <div className="flex justify-between items-start">
        <div className="flex w-[36px] h-[36px] items-center justify-center bg-[#ecf4e9] rounded-[8px]">
          <span className="text-[20px]">{getIcon(stat.icon)}</span>
        </div>
        <button className="w-[18px] h-[18px] flex items-center justify-center hover:opacity-70 transition-opacity">
          <span className="text-[16px]">⋯</span>
        </button>
      </div>
      
      <div className="flex flex-col gap-[12px]">
        <div className={`flex w-fit px-[4px] py-[1px] gap-[4px] items-center rounded-[15px] ${changeColor}`}>
          <span className="text-[10px]">{isPositive ? '↗' : '↘'}</span>
          <span className="font-['Urbanist'] text-[8px] font-medium leading-[10px]">
            {isPositive ? '+' : ''} {stat.change} %
          </span>
        </div>
        
        <span className="font-['Urbanist'] text-[22px] sm:text-[24px] font-bold leading-[26px] text-[#232d2c]">
          ${stat.amount.toLocaleString()}
        </span>
        
        <span className="font-['Urbanist'] text-[12px] font-normal leading-[15.6px] text-[#232d2c]">
          {stat.label}
        </span>
      </div>
    </div>
  );
};

export default StatCard;
