import React from 'react';
import logoImg from '../../Assets/logo.png';

const Logo: React.FC = () => {
  return (
    <div className="flex w-full pt-0 pr-[8px] pb-0 pl-[8px] flex-col gap-[10px] items-start">
      <div className="w-[125px] h-[38px] flex items-center bg-[#1e4841] rounded-[8px] px-[12px]">
        <img src={logoImg} alt="TingaTalk" className="h-full w-auto object-contain" />
      </div>
    </div>
  );
};

export default Logo;
