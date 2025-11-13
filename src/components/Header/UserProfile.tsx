import React from 'react';

const UserProfile: React.FC = () => {
  return (
    <div className="flex gap-[14px] items-center">
      <span className="font-['Urbanist'] text-[16px] font-bold leading-[19px] text-[#1e4841] hidden sm:block">
        Admin
      </span>
      <div className="w-[38px] h-[38px] rounded-[56px] overflow-hidden bg-[#bbf49c] flex items-center justify-center">
        <span className="text-[20px]">👤</span>
      </div>
    </div>
  );
};

export default UserProfile;
