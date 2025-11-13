import React from 'react';
import logoImg from '../../Assets/logo.png';

const Logo: React.FC = () => {
  return (
    <div className="flex w-full -mx-[16px] -mt-[22px] mb-[10px]">
      <div className="w-full bg-[#1e4841] rounded-[12px] py-[16px] px-[16px] flex items-center justify-center">
        <img src={logoImg} alt="TingaTalk" className="h-[32px] w-auto object-contain" />
      </div>
    </div>
  );
};

export default Logo;
