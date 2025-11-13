import React from 'react';
import { useDashboard } from '../../context/DashboardContext';

const QuickActions: React.FC = () => {
  const { quickActions } = useDashboard();

  const getIcon = (icon: string): string => {
    const icons: Record<string, string> = {
      topup: '⬆️',
      transfer: '↔️',
      request: '⬇️',
      history: '📜',
    };
    return icons[icon] || '•';
  };

  return (
    <div className="flex w-full pt-[12px] pr-[8px] pb-[12px] pl-[8px] gap-[8px] bg-[#ecf4e9] rounded-[16px]">
      {quickActions.map((action, index) => (
        <React.Fragment key={action.id}>
          <button className="flex pt-[4px] pr-0 pb-[4px] pl-0 flex-col gap-[6px] items-center grow hover:opacity-80 transition-opacity">
            <span className="text-[24px]">{getIcon(action.icon)}</span>
            <span className="font-['Urbanist'] text-[10px] font-semibold leading-[10px] text-[#1e4841]">
              {action.label}
            </span>
          </button>
          {index < quickActions.length - 1 && (
            <div className="w-px self-stretch bg-[#d4e8c8]" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default QuickActions;
