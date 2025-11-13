import React from 'react';

const PromoCard: React.FC = () => {
  return (
    <div className="flex w-full p-[20px] flex-col gap-[16px] bg-gradient-to-br from-[#1e4841] to-[#2d5f56] rounded-[12px] relative overflow-hidden shadow-md">
      <div className="w-[36px] h-[36px] bg-[#bbf49c] rounded-[10px] flex items-center justify-center mb-[4px]">
        <span className="text-[20px]">⭐</span>
      </div>
      <span className="font-['Urbanist'] text-[13px] font-normal leading-[18px] text-white">
        Upgrade to Pro for advanced analytics and insights
      </span>
      <button className="flex py-[10px] px-[16px] justify-center items-center bg-[#bbf49c] rounded-[8px] hover:bg-[#a8e085] transition-all duration-200 shadow-sm hover:shadow-md">
        <span className="font-['Urbanist'] text-[14px] font-semibold text-[#1e4841]">
          Upgrade Now
        </span>
      </button>
    </div>
  );
};

export default PromoCard;
