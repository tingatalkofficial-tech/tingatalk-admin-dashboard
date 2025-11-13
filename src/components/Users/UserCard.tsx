import React from 'react';
import { User } from '../../types/users';

interface UserCardProps {
  user: User;
  onClick: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onClick }) => {
  const genderIcon = user.gender === 'male' ? '👨' : '👩';
  const genderColor = user.gender === 'male' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600';

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-[12px] p-[16px] rounded-[12px] border border-[#e4e6e5] bg-white hover:shadow-md transition-all cursor-pointer"
    >
      {user.profileImage ? (
        <img
          src={user.profileImage}
          alt={user.displayName}
          className="w-[48px] h-[48px] rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div className={`flex w-[48px] h-[48px] items-center justify-center rounded-full ${genderColor} flex-shrink-0`}>
          <span className="text-[24px]">{genderIcon}</span>
        </div>
      )}

      <div className="flex flex-col flex-1 min-w-0">
        <span className="font-['Urbanist'] text-[16px] font-semibold text-[#232d2c] truncate">
          {user.displayName}
        </span>
        <div className="flex items-center gap-[8px] text-[12px] text-[#6b7270]">
          {user.age && <span>Age: {user.age}</span>}
          {user.age && <span>•</span>}
          <span className="capitalize">{user.gender}</span>
        </div>
      </div>

      <div className="flex items-center justify-center w-[32px] h-[32px] rounded-full bg-[#ecf4e9] flex-shrink-0">
        <span className="text-[16px]">→</span>
      </div>
    </div>
  );
};

export default UserCard;
