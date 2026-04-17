import React, { useState, useEffect } from 'react';
import MenuItem from './MenuItem';
import Logo from './Logo';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { onPendingPayoutsCount } from '../../services/payoutService';
import { db } from '../../utils/firebase';

interface MenuItemType {
  id: string;
  label: string;
  icon: string;
  path: string;
  isActive: boolean;
  badge?: number;
}

const Sidebar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unverifiedCount, setUnverifiedCount] = useState(0);
  const [pendingPayoutsCount, setPendingPayoutsCount] = useState(0);

  useEffect(() => {
    const q = query(
      collection(db, 'users'),
      where('gender', '==', 'female'),
      where('isVerified', '==', false)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Exclude rejected users AND users without an uploaded verification photo
      const pendingCount = snapshot.docs.filter(d => {
        const data = d.data();
        if (data.verificationStatus === 'rejected') return false;
        const photo = data.verificationPhoto;
        return typeof photo === 'string' && (photo.startsWith('http://') || photo.startsWith('https://'));
      }).length;
      setUnverifiedCount(pendingCount);
    }, (err) => {
      console.error('Error listening to unverified count:', err);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onPendingPayoutsCount(setPendingPayoutsCount);
    return () => unsubscribe();
  }, []);

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
      label: 'Revenue',
      icon: '💰',
      path: '/revenue',
      isActive: window.location.pathname === '/revenue'
    },
    {
      id: '3',
      label: 'Payouts',
      icon: '💸',
      path: '/payouts',
      isActive: window.location.pathname === '/payouts',
      badge: pendingPayoutsCount > 0 ? pendingPayoutsCount : undefined
    },
    {
      id: '4',
      label: 'Verification',
      icon: '🛡️',
      path: '/verification',
      isActive: window.location.pathname === '/verification',
      badge: unverifiedCount > 0 ? unverifiedCount : undefined
    },
    {
      id: '5',
      label: 'Users',
      icon: '👥',
      path: '/users',
      isActive: window.location.pathname.startsWith('/users')
    },
    {
      id: '6',
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
