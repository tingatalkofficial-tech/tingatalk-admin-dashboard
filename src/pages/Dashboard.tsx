import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import FinancialCard from '../components/Card/FinancialCard';
import QuickActions from '../components/Card/QuickActions';
import DailyLimit from '../components/DailyLimit/DailyLimit';
import SavingPlans from '../components/SavingPlans/SavingPlans';
import FinancialStats from '../components/Stats/FinancialStats';

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-[#ecf4e9]">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 bg-[#fbfbfc] overflow-auto
        /* Mobile: Full width with padding for menu button */
        pt-[70px] px-[16px] pb-[22px]
        /* Tablet: Adjusted padding */
        md:pt-[22px] md:px-[20px]
        /* Desktop: Original padding with rounded corners */
        lg:pt-[22px] lg:pr-[28px] lg:pb-[22px] lg:pl-[28px]
        lg:rounded-tl-[24px] lg:rounded-bl-[24px]
      ">
        <div className="flex flex-col gap-[20px] max-w-[1400px] mx-auto">
          {/* Header */}
          <Header />
          
          {/* Content Grid */}
          <div className="flex flex-col gap-[20px]
            /* Mobile: Single column */
            /* Tablet: Two columns with adjusted widths */
            md:flex-row md:flex-wrap
            /* Desktop: Two columns with fixed left width */
            lg:flex-row lg:flex-nowrap
          ">
            {/* Left Column - Card & Limits */}
            <div className="flex flex-col gap-[20px]
              /* Mobile: Full width */
              w-full
              /* Tablet: Half width */
              md:w-[calc(50%-10px)]
              /* Desktop: Fixed width */
              lg:w-[283px] lg:flex-shrink-0
            ">
              <FinancialCard />
              <QuickActions />
              <DailyLimit />
              <SavingPlans />
            </div>
            
            {/* Right Column - Stats & More */}
            <div className="flex flex-col gap-[20px]
              /* Mobile: Full width */
              w-full
              /* Tablet: Half width */
              md:w-[calc(50%-10px)]
              /* Desktop: Flexible width */
              lg:flex-1
            ">
              <FinancialStats />
              
              {/* Placeholder for additional content */}
              <div className="flex w-full min-h-[300px] md:min-h-[400px] items-center justify-center rounded-[16px] border-2 border-dashed border-[#e4e6e5]">
                <span className="font-['Urbanist'] text-[14px] text-[#6b7270] text-center px-4">
                  Additional content area (charts, transactions, etc.)
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
