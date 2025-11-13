import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MenuItem as MenuItemType } from '../../types';

interface MenuItemProps {
  item: MenuItemType;
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
  
  const baseClasses = "flex pt-[8px] pr-[12px] pb-[8px] pl-[16px] gap-[12px] items-center w-full rounded-[24px] cursor-pointer transition-colors";
  const activeClasses = isActive ? "bg-[#bbf49c]" : "hover:bg-[#d4e8c8]";

  return (
    <div onClick={handleClick} className={`${baseClasses} ${activeClasses}`}>
      <div className="w-[24px] h-[24px] shrink-0 flex items-center justify-center">
        <span className="text-[20px]">
          {getIcon(item.icon)}
        </span>
      </div>
      <div className="flex pt-[5px] pr-[2px] pb-[5px] pl-0 gap-[10px] items-center grow">
        <span className={`font-['Urbanist'] text-[14px] font-semibold leading-[14px] ${
          isActive ? 'text-[#232d2c]' : 'text-[#6b7270]'
        }`}>
          {item.label}
        </span>
      </div>
      {item.badge && (
        <div className="flex w-[20px] h-[20px] items-center justify-center bg-[#f63440] rounded-[10px]">
          <span className="font-['Urbanist'] text-[11px] font-normal text-[#fbfbfc]">
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
  return icons[iconName] || '•';
};

export default MenuItem;
