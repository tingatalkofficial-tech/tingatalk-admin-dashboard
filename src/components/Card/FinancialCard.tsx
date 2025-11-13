import React from 'react';
import { useDashboard } from '../../context/DashboardContext';

const FinancialCard: React.FC = () => {
  const { card } = useDashboard();

  return (
    <div className="flex w-full pt-[16px] pr-[16px] pb-[16px] pl-[16px] flex-col gap-[27px] bg-[#1e4841] rounded-[16px]
      /* Ensure minimum height for better appearance */
      min-h-[180px]
    ">
      <div className="flex justify-between items-center">
        <span className="text-[20px]">💳</span>
        <span className="text-[20px]">📶</span>
      </div>
      
      <span className="font-['Urbanist'] text-[18px] sm:text-[20px] font-bold leading-[24px] text-[#ecf4e9]">
        {card.holderName}
      </span>
      
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-[2px]">
          <span className="font-['Urbanist'] text-[10px] font-normal leading-[13px] text-[#ecf4e9]">
            Balance Amount
          </span>
          <span className="font-['Urbanist'] text-[20px] sm:text-[22px] font-bold leading-[26px] text-[#fbfbfc]">
            ${card.balance.toLocaleString()}
          </span>
        </div>
        <div className="flex gap-[14px] sm:gap-[18px]">
          <div className="flex flex-col gap-[2px]">
            <span className="font-['Urbanist'] text-[10px] font-normal leading-[13px] text-[#ecf4e9]">
              EXP
            </span>
            <span className="font-['Urbanist'] text-[12px] font-semibold leading-[15.6px] text-[#fbfbfc]">
              {card.expiryDate}
            </span>
          </div>
          <div className="flex flex-col gap-[2px]">
            <span className="font-['Urbanist'] text-[10px] font-normal leading-[13px] text-[#ecf4e9]">
              CVV
            </span>
            <span className="font-['Urbanist'] text-[12px] font-semibold leading-[15.6px] text-[#fbfbfc]">
              {card.cvv}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialCard;
