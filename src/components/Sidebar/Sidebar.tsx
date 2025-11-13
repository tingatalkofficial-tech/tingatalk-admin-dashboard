import React, { useState } from 'react';
import MenuItem from './MenuItem';
import PromoCard from './PromoCard';
import Logo from './Logo';

interface MenuItemType {
  id: string;
  label: string;
  icon: string;
  path: string;
  isActive: boolean;
}

const Sidebar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const menuItems: MenuItemType[] = [
    {
      id: '1',
      label: 'Analytics',
      icon: '📊',
      path: '/analytics',
      isActive: window.location.pathname === '/analytics'
    },
    {
      id: '2',
      label: 'Users',
      icon: '👥',
      path: '/users',
      isActive: window.location.pathname.startsWith('/users')
    },
    {
      id: '3',
      label: 'Calls',
      icon: '📞',
      path: '/calls',
      isActive: window.location.pathname === '/calls'
    }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#1e4841] rounded-lg"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <aside className={`
        flex flex-col bg-white shadow-lg
        
        /* Mobile: Fixed overlay */
        fixed lg:relative inset-0 z-40 lg:z-auto
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        
        /* Tablet & Desktop: Static sidebar */
        w-[260px] md:w-[260px] lg:w-[260px]
        lg:min-h-screen
      `}>
        <Logo />
        
        <nav className="flex w-full flex-col px-[16px] py-[20px] gap-[4px] flex-1">
          {menuItems.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </nav>

        <div className="px-[16px] pb-[20px]">
          <PromoCard />
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
