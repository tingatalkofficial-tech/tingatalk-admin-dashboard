import React from 'react';

const NotificationButtons: React.FC = () => {
  return (
    <div className="flex gap-[10px] items-start">
      <button className="flex w-[38px] h-[38px] items-center justify-center bg-[#ecf4e9] rounded-[20px] hover:bg-[#d4e8c8] transition-colors">
        <span className="text-[18px]">🔔</span>
      </button>
      <button className="flex w-[38px] h-[38px] items-center justify-center bg-[#ecf4e9] rounded-[20px] hover:bg-[#d4e8c8] transition-colors relative">
        <span className="text-[18px]">💬</span>
        <div className="flex w-[14px] h-[14px] items-center justify-center absolute top-[6px] right-[6px]">
          <div className="w-[8px] h-[8px] bg-[#f63440] rounded-[10px]" />
        </div>
      </button>
    </div>
  );
};

export default NotificationButtons;
