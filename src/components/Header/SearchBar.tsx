import React, { useState } from 'react';

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex pt-[10px] pr-[16px] pb-[10px] pl-[16px] gap-[6px] items-center bg-[#eff0ef] rounded-[20px] border-solid border border-[#eff0ef]
      /* Mobile: Flexible width */
      w-full min-w-[200px]
      /* Tablet & Desktop: Fixed width */
      sm:w-[240px] md:w-[283px]
    ">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search placeholder"
        className="grow bg-transparent font-['Urbanist'] text-[12px] font-normal leading-[15.6px] text-[#6b7270] placeholder:text-[#6b7270] border-none outline-none"
      />
      <div className="w-[18px] h-[18px] flex items-center justify-center flex-shrink-0">
        <span className="text-[16px]">🔍</span>
      </div>
    </div>
  );
};

export default SearchBar;
