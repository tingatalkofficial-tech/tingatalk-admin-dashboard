import React from 'react';
import { SavingPlan } from '../../types';

interface SavingPlanItemProps {
  plan: SavingPlan;
}

const SavingPlanItem: React.FC<SavingPlanItemProps> = ({ plan }) => {
  const getIcon = (icon: string): string => {
    const icons: Record<string, string> = {
      shield: '🛡️',
      plane: '✈️',
      home: '🏠',
    };
    return icons[icon] || '💰';
  };

  return (
    <div className="flex pt-[14px] pr-[14px] pb-[14px] pl-[14px] flex-col gap-[16px] rounded-[12px] border-solid border border-[#e4e6e5]">
      <div className="flex justify-between items-start">
        <div className="flex gap-[8px] items-center">
          <div className="flex w-[28px] h-[28px] items-center justify-center bg-[#ecf4e9] rounded-[8px]">
            <span className="text-[16px]">{getIcon(plan.icon)}</span>
          </div>
          <span className="font-['Urbanist'] text-[12px] font-medium leading-[15.6px] text-[#232d2c]">
            {plan.name}
          </span>
        </div>
        <button className="w-[18px] h-[18px] flex items-center justify-center hover:opacity-70 transition-opacity">
          <span className="text-[16px]">⋯</span>
        </button>
      </div>
      
      <div className="flex flex-col gap-[10px]">
        <div className="w-full h-[8px] bg-[#bbf49c] rounded-[8px] overflow-hidden">
          <div 
            className="h-full bg-[#1e4841] rounded-[8px] transition-all duration-300"
            style={{ width: `${plan.percentage}%` }}
          />
        </div>
        
        <div className="flex justify-between items-start">
          <div className="flex gap-[4px] items-start">
            <span className="font-['Urbanist'] text-[10px] font-semibold leading-[13px] text-[#232d2c]">
              ${plan.current.toLocaleString()}
            </span>
            <span className="font-['Urbanist'] text-[10px] font-semibold leading-[13px] text-[#6b7270]">
              {plan.percentage}%
            </span>
          </div>
          <div className="flex gap-[4px] items-start">
            <span className="font-['Urbanist'] text-[10px] font-normal leading-[13px] text-[#6b7270]">
              Target:
            </span>
            <span className="font-['Urbanist'] text-[10px] font-normal leading-[13px] text-[#232d2c]">
              ${plan.target.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingPlanItem;
