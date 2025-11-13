import React from 'react';
import { TopFemaleUser } from '../../types/analytics';

interface TopUserCardProps {
  user: TopFemaleUser;
  type: 'earnings' | 'rating' | 'calls';
}

const TopUserCard: React.FC<TopUserCardProps> = ({ user, type }) => {
  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-[#ffd700] text-[#232d2c]';
    if (rank === 2) return 'bg-[#c0c0c0] text-[#232d2c]';
    if (rank === 3) return 'bg-[#cd7f32] text-white';
    return 'bg-[#e4e6e5] text-[#232d2c]';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getDisplayValue = () => {
    if (type === 'earnings' && user.earnings !== undefined) {
      return `₹${user.earnings.toLocaleString()}`;
    }
    if (type === 'rating' && user.rating !== undefined) {
      return `⭐ ${user.rating.toFixed(1)}`;
    }
    if (type === 'calls' && user.totalCalls !== undefined) {
      return `${user.totalCalls.toLocaleString()} calls`;
    }
    return '';
  };

  return (
    <div className="flex items-center gap-[12px] p-[12px] rounded-[12px] border border-[#e4e6e5] bg-white hover:shadow-md transition-shadow">
      <div className={`flex w-[32px] h-[32px] items-center justify-center rounded-full ${getRankColor(user.rank)} flex-shrink-0`}>
        <span className="text-[14px] font-bold">{getRankIcon(user.rank)}</span>
      </div>
      
      <div className="flex items-center gap-[8px] flex-1 min-w-0">
        {user.avatar ? (
          <img 
            src={user.avatar} 
            alt={user.name}
            className="w-[36px] h-[36px] rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="flex w-[36px] h-[36px] items-center justify-center bg-[#ecf4e9] rounded-full flex-shrink-0">
            <span className="text-[16px]">👤</span>
          </div>
        )}
        
        <div className="flex flex-col flex-1 min-w-0">
          <span className="font-['Urbanist'] text-[14px] font-semibold text-[#232d2c] truncate">
            {user.name}
          </span>
          <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">
            {getDisplayValue()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopUserCard;
