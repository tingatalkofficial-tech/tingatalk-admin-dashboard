import React from 'react';

const PromoCard: React.FC = () => {
  return (
    <div className="flex w-full pt-[20px] pr-[16px] pb-[20px] pl-[16px] flex-col gap-[20px] justify-end items-start bg-[#1e4841] rounded-[16px] relative overflow-hidden">
      <span className="font-['Urbanist'] text-[12px] font-normal leading-[15.6px] text-[#ecf4e9]">
        Gain full access to your finances with detailed analytics and graphs
      </span>
      <button className="flex pt-[10px] pr-[14px] pb-[10px] pl-[14px] justify-center items-center bg-[#bbf49c] rounded-[8px] hover:bg-[#a8e085] transition-colors">
        <span className="font-['Urbanist'] text-[14px] font-medium leading-[14px] text-[#232d2c]">
          Get Pro
        </span>
      </button>
      <div className="w-[32px] h-[32px] bg-[#ecf4e9] rounded-[8px] absolute top-[16px] left-[17px] flex items-center justify-center">
        <span className="text-[18px]">⭐</span>
      </div>
    </div>
  );
};

export default PromoCard;
