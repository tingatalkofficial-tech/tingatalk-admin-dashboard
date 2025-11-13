import React from 'react';
import { TopFemaleUser } from '../../types/analytics';
import TopUserCard from './TopUserCard';

interface TopUsersSectionProps {
  title: string;
  users: TopFemaleUser[];
  type: 'earnings' | 'rating' | 'calls';
  icon: string;
}

const TopUsersSection: React.FC<TopUsersSectionProps> = ({ title, users, type, icon }) => {
  return (
    <div className="flex flex-col gap-[16px] p-[16px] rounded-[16px] border border-[#e4e6e5] bg-white
      w-full
      md:w-[calc(50%-10px)]
      lg:w-[calc(33.333%-14px)]
    ">
      <div className="flex items-center gap-[8px]">
        <div className="flex w-[32px] h-[32px] items-center justify-center bg-[#ecf4e9] rounded-[8px]">
          <span className="text-[18px]">{icon}</span>
        </div>
        <h3 className="font-['Urbanist'] text-[16px] font-bold text-[#232d2c]">
          {title}
        </h3>
      </div>
      
      <div className="flex flex-col gap-[8px]">
        {users.length > 0 ? (
          users.map((user) => (
            <TopUserCard key={user.id} user={user} type={type} />
          ))
        ) : (
          <div className="flex items-center justify-center py-[24px] text-[#6b7270]">
            <span className="font-['Urbanist'] text-[14px]">No data available</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopUsersSection;
