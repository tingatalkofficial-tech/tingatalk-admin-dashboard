import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface MenuItemProps {
  item: {
    id: string;
    label: string;
    icon: string;
    path?: string;
    active?: boolean;
    isActive?: boolean;
    badge?: number;
  };
}

const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = item.path ? location.pathname === item.path : item.active;
  
  const handleClick = () => {
    if (item.path) {
      navigate(item.path);
    }
  };
  
  const baseClasses = "flex py-[12px] px-[16px] gap-[12px] items-center w-full rounded-[10px] cursor-pointer transition-all duration-200";
  const activeClasses = isActive 
    ? "bg-[#1e4841] text-white shadow-md" 
    : "hover:bg-[#f5f5f5] text-[#6b7270]";

  return (
    <div onClick={handleClick} className={`${baseClasses} ${activeClasses}`}>
      <div className="w-[20px] h-[20px] shrink-0 flex items-center justify-center">
        <span className="text-[18px]">
          {getIcon(item.icon)}
        </span>
      </div>
      <div className="flex items-center grow">
        <span className={`font-['Urbanist'] text-[15px] font-medium ${
          isActive ? 'text-white' : 'text-[#232d2c]'
        }`}>
          {item.label}
        </span>
      </div>
      {item.badge && (
        <div className="flex w-[20px] h-[20px] items-center justify-center bg-[#f63440] rounded-full">
          <span className="font-['Urbanist'] text-[11px] font-semibold text-white">
            {item.badge > 99 ? '99' : item.badge}
          </span>
        </div>
      )}
    </div>
  );
};

const getIcon = (iconName: string): string => {
  const icons: Record<string, string> = {
    dashboard: '📊',
    payments: '💳',
    transactions: '🔄',
    invoices: '📄',
    cards: '💳',
    savings: '💰',
    investments: '📈',
    inbox: '📥',
    promos: '🎁',
    insights: '💡',
  };
  // If the icon is already an emoji (not a named key), return it directly
  return icons[iconName] || iconName;
};

export default MenuItem;
