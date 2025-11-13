import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import SavingPlanItem from './SavingPlanItem';

const SavingPlans: React.FC = () => {
  const { savingPlans } = useDashboard();
  
  const totalSavings = savingPlans.reduce((sum, plan) => sum + plan.current, 0);

  return (
    <div className="flex w-full pt-[16px] pr-[16px] pb-[16px] pl-[16px] flex-col gap-[20px] rounded-[16px] border-solid border border-[#e4e6e5]">
      <div className="flex justify-between items-center">
        <span className="font-['Urbanist'] text-[16px] font-bold leading-[19px] text-[#232d2c]">
          Saving Plans
        </span>
        <button className="flex items-center gap-[4px] hover:opacity-70 transition-opacity">
          <span className="text-[12px]">➕</span>
          <span className="font-['Urbanist'] text-[10px] font-medium leading-[10px] text-[#1e4841]">
            Add Plan
          </span>
        </button>
      </div>
      
      <div className="flex flex-col gap-[4px]">
        <span className="font-['Urbanist'] text-[10px] font-normal leading-[13px] text-[#232d2c]">
          Total Savings
        </span>
        <span className="font-['Urbanist'] text-[24px] font-bold leading-[26px] text-[#1e4841]">
          ${totalSavings.toLocaleString()}
        </span>
      </div>
      
      <div className="flex flex-col gap-[16px]">
        {savingPlans.map((plan) => (
          <SavingPlanItem key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
};

export default SavingPlans;
