import React from 'react';
import { useAuth } from '../../context/AuthContext';

const UserProfile: React.FC = () => {
  const { logout } = useAuth();

  return (
    <div className="flex gap-[14px] items-center">
      <span className="font-['Urbanist'] text-[16px] font-bold leading-[19px] text-[#1e4841] hidden sm:block">
        Admin
      </span>
      <div className="w-[38px] h-[38px] rounded-[56px] overflow-hidden bg-[#bbf49c] flex items-center justify-center">
        <span className="text-[20px]">👤</span>
      </div>
      <button
        onClick={logout}
        className="ml-2 px-3 py-1.5 rounded-lg text-[13px] font-medium text-[#1e4841] bg-[#f0fde8] hover:bg-[#bbf49c] transition-colors duration-200"
        title="Sign out"
      >
        Logout
      </button>
    </div>
  );
};

export default UserProfile;
