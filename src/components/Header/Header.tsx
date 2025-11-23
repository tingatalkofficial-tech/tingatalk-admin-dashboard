import React from 'react';
import UserProfile from './UserProfile';

const Header: React.FC = () => {
  return (
    <header className="flex w-full justify-between items-center gap-4">
      <h1 className="font-['Urbanist'] text-[22px] font-bold leading-[26px] text-[#1e4841]">
        Dashboard
      </h1>
      <UserProfile />
    </header>
  );
};

export default Header;
