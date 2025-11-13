import React from 'react';
import SearchBar from './SearchBar';
import NotificationButtons from './NotificationButtons';
import UserProfile from './UserProfile';

const Header: React.FC = () => {
  return (
    <header className="flex w-full justify-between items-center gap-4
      /* Mobile: Stack on small screens */
      flex-col sm:flex-row
    ">
      <h1 className="font-['Urbanist'] text-[22px] font-bold leading-[26px] text-[#1e4841]
        /* Mobile: Full width centered */
        w-full sm:w-auto text-center sm:text-left
      ">
        Dashboard
      </h1>
      <div className="flex gap-[12px] md:gap-[20px] items-center
        /* Mobile: Full width with adjusted spacing */
        w-full sm:w-auto justify-between sm:justify-end
        flex-wrap sm:flex-nowrap
      ">
        <SearchBar />
        <div className="flex gap-[12px] items-center">
          <NotificationButtons />
          <UserProfile />
        </div>
      </div>
    </header>
  );
};

export default Header;
