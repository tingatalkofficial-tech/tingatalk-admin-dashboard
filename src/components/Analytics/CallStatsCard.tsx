import React from 'react';
import { CallStat } from '../../types/analytics';

interface CallStatsCardProps {
  stat: CallStat;
}

const CallStatsCard: React.FC<CallStatsCardProps> = ({ stat }) => {
  const hasChange = stat.change !== undefined;
  const isPositive = stat.change && stat.change > 0;
  const changeColor = isPositive ? 'bg-[#bbf49c] text-[#1e4841]' : 'bg-[#fcced1] text-[#f63440]';

  return (
    <div className="flex pt-[16px] pr-[16px] pb-[16px] pl-[16px] flex-col gap-[28px] rounded-[16px] border-solid border border-[#e4e6e5] bg-white
      w-full
      sm:w-[calc(50%-9px)]
      md:flex-1 md:min-w-[160px]
    ">
      <div className="flex justify-between items-start">
        <div className="flex w-[36px] h-[36px] items-center justify-center bg-[#ecf4e9] rounded-[8px]">
          <span className="text-[20px]">{stat.icon}</span>
        </div>
        {hasChange && (
          <div className={`flex w-fit px-[4px] py-[1px] gap-[4px] items-center rounded-[15px] ${changeColor}`}>
            <span className="text-[10px]">{isPositive ? '↗' : '↘'}</span>
            <span className="font-['Urbanist'] text-[8px] font-medium leading-[10px]">
              {isPositive ? '+' : ''} {stat.change} %
            </span>
          </div>
        )}
      </div>
      
      <div className="flex flex-col gap-[12px]">
        <span className="font-['Urbanist'] text-[22px] sm:text-[24px] font-bold leading-[26px] text-[#232d2c]">
          {stat.count.toLocaleString()}
        </span>
        
        <span className="font-['Urbanist'] text-[12px] font-normal leading-[15.6px] text-[#232d2c]">
          {stat.label}
        </span>
      </div>
    </div>
  );
};

export default CallStatsCard;
