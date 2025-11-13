import React from 'react';
import logoImg from '../../Assets/logo.png';

const Logo: React.FC = () => {
  return (
    <div className="flex w-full px-[20px] py-[24px] items-center justify-center border-b border-[#1e4841]/10">
      <div className="bg-[#1e4841] rounded-[10px] py-[12px] px-[20px] shadow-sm">
        <img src={logoImg} alt="TingaTalk" className="h-[28px] w-auto object-contain" />
      </div>
    </div>
  );
};

export default Logo;
