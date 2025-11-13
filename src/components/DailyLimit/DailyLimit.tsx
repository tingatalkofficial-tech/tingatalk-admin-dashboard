import React from 'react';
import { useDashboard } from '../../context/DashboardContext';

const DailyLimit: React.FC = () => {
  const { dailyLimit } = useDashboard();

  return (
    <div className="flex w-full pt-[16px] pr-[16px] pb-[16px] pl-[16px] flex-col gap-[20px] rounded-[16px] border-solid border border-[#e4e6e5]">
      <div className="flex justify-between items-center">
        <span className="font-['Urbanist'] text-[16px] font-bold leading-[19px] text-[#232d2c]">
          Daily Limit
        </span>
        <button className="w-[18px] h-[18px] flex items-center justify-center hover:opacity-70 transition-opacity">
          <span className="text-[16px]">⚙️</span>
        </button>
      </div>
      
      <div className="flex flex-col gap-[12px]">
        <div className="flex justify-between items-center">
          <div className="flex gap-[4px] items-baseline">
            <span className="font-['Urbanist'] text-[12px] font-semibold leading-[15.6px] text-[#232d2c]">
              ${dailyLimit.spent.toLocaleString()}
            </span>
            <span className="font-['Urbanist'] text-[10px] font-normal leading-[13px] text-[#232d2c]">
              spent of ${dailyLimit.total.toLocaleString()}
            </span>
          </div>
          <span className="font-['Urbanist'] text-[12px] font-semibold leading-[15.6px] text-[#232d2c]">
            {dailyLimit.percentage}%
          </span>
        </div>
        
        <div className="w-full h-[8px] bg-[#bbf49c] rounded-[8px] overflow-hidden">
          <div 
            className="h-full bg-[#1e4841] rounded-[8px] transition-all duration-300"
            style={{ width: `${dailyLimit.percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default DailyLimit;
