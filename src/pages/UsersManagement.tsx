import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import UserCard from '../components/Users/UserCard';
import { fetchAllUsers } from '../services/usersService';
import { User } from '../types/users';

const UsersManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const initialGender = (searchParams.get('gender') || 'all') as 'all' | 'male' | 'female';
  const [selectedGender, setSelectedGender] = useState<'all' | 'male' | 'female'>(initialGender);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [dateFilter, setDateFilter] = useState(searchParams.get('date') || '');
  const [minAge, setMinAge] = useState(searchParams.get('minAge') || '');
  const [maxAge, setMaxAge] = useState(searchParams.get('maxAge') || '');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, selectedGender, searchQuery, dateFilter, minAge, maxAge]);

  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const toDateString = (timestamp: any): string => {
    if (!timestamp) return '';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (selectedGender !== 'all') {
      filtered = filtered.filter(u => u.gender === selectedGender);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(u =>
        u.displayName.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q) ||
        (u.phoneNumber && u.phoneNumber.includes(q))
      );
    }

    if (dateFilter) {
      filtered = filtered.filter(u => toDateString(u.createdAt) === dateFilter);
    }

    if (minAge) {
      const min = parseInt(minAge, 10);
      if (!isNaN(min)) filtered = filtered.filter(u => (u.age || 0) >= min);
    }

    if (maxAge) {
      const max = parseInt(maxAge, 10);
      if (!isNaN(max)) filtered = filtered.filter(u => (u.age || 0) <= max);
    }

    setFilteredUsers(filtered);
  };

  const syncParams = (overrides: Record<string, string> = {}) => {
    const vals: Record<string, string> = {
      ...(selectedGender !== 'all' ? { gender: selectedGender } : {}),
      ...(searchQuery ? { q: searchQuery } : {}),
      ...(dateFilter ? { date: dateFilter } : {}),
      ...(minAge ? { minAge } : {}),
      ...(maxAge ? { maxAge } : {}),
      ...overrides,
    };
    // Remove empty keys
    Object.keys(vals).forEach(k => { if (!vals[k]) delete vals[k]; });
    setSearchParams(vals, { replace: true });
  };

  const handleGenderChange = (gender: 'all' | 'male' | 'female') => {
    setSelectedGender(gender);
    syncParams({ gender: gender === 'all' ? '' : gender });
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    syncParams({ q });
  };

  const handleDateChange = (date: string) => {
    setDateFilter(date);
    syncParams({ date });
  };

  const handleMinAgeChange = (val: string) => {
    setMinAge(val);
    syncParams({ minAge: val });
  };

  const handleMaxAgeChange = (val: string) => {
    setMaxAge(val);
    syncParams({ maxAge: val });
  };

  const clearFilters = () => {
    setDateFilter('');
    setMinAge('');
    setMaxAge('');
    setSearchQuery('');
    setSelectedGender('all');
    setSearchParams({}, { replace: true });
  };

  const hasActiveFilters = dateFilter || minAge || maxAge || searchQuery;

  const handleUserClick = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  const maleCount = users.filter(u => u.gender === 'male').length;
  const femaleCount = users.filter(u => u.gender === 'female').length;

  if (isLoading) {
    return (
      <div className="flex flex-col lg:flex-row w-full min-h-screen bg-[#ecf4e9]">
        <Sidebar />
        <main className="flex-1 bg-[#fbfbfc] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e4841]"></div>
            <p className="mt-4 font-['Urbanist'] text-[14px] text-[#6b7270]">Loading users...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-[#ecf4e9]">
      <Sidebar />

      <main className="flex-1 bg-[#fbfbfc] overflow-auto
        pt-[70px] px-[16px] pb-[22px]
        md:pt-[22px] md:px-[20px]
        lg:pt-[22px] lg:pr-[28px] lg:pb-[22px] lg:pl-[28px]
        lg:rounded-tl-[24px] lg:rounded-bl-[24px]
      ">
        <div className="flex flex-col gap-[20px] max-w-[1400px] mx-auto">
          <Header />

          {/* Page Title & Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[12px]">
            <div className="flex flex-col gap-[8px]">
              <h1 className="font-['Urbanist'] text-[24px] md:text-[28px] font-bold text-[#232d2c]">
                Users Management
              </h1>
              <p className="font-['Urbanist'] text-[14px] text-[#6b7270]">
                Total: {users.length} users ({maleCount} male, {femaleCount} female)
              </p>
            </div>
            <button
              onClick={loadUsers}
              className="flex items-center gap-[8px] px-[16px] py-[10px] bg-[#1e4841] text-white rounded-[8px] hover:bg-[#2d5f56] transition-colors font-['Urbanist'] text-[14px] font-medium"
            >
              <span>🔄</span>
              <span>Refresh</span>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-[12px] p-[16px] bg-[#fcced1] border border-[#f63440] rounded-[12px]">
              <span className="text-[20px]">⚠️</span>
              <div className="flex-1">
                <p className="font-['Urbanist'] text-[14px] font-semibold text-[#f63440]">Error loading users</p>
                <p className="font-['Urbanist'] text-[12px] text-[#232d2c]">{error}</p>
              </div>
              <button
                onClick={loadUsers}
                className="px-[12px] py-[6px] bg-white text-[#f63440] rounded-[6px] hover:bg-gray-50 transition-colors font-['Urbanist'] text-[12px] font-medium"
              >
                Retry
              </button>
            </div>
          )}

          {/* Gender Filter Toggle */}
          <div className="flex gap-[8px] p-[4px] bg-[#ecf4e9] rounded-[8px] w-fit">
            <button
              onClick={() => handleGenderChange('all')}
              className={`px-[20px] py-[8px] rounded-[6px] font-['Urbanist'] text-[14px] font-medium transition-colors ${
                selectedGender === 'all'
                  ? 'bg-[#1e4841] text-white'
                  : 'bg-transparent text-[#232d2c] hover:bg-white'
              }`}
            >
              All ({users.length})
            </button>
            <button
              onClick={() => handleGenderChange('male')}
              className={`px-[20px] py-[8px] rounded-[6px] font-['Urbanist'] text-[14px] font-medium transition-colors ${
                selectedGender === 'male'
                  ? 'bg-[#1e4841] text-white'
                  : 'bg-transparent text-[#232d2c] hover:bg-white'
              }`}
            >
              Male ({maleCount})
            </button>
            <button
              onClick={() => handleGenderChange('female')}
              className={`px-[20px] py-[8px] rounded-[6px] font-['Urbanist'] text-[14px] font-medium transition-colors ${
                selectedGender === 'female'
                  ? 'bg-[#1e4841] text-white'
                  : 'bg-transparent text-[#232d2c] hover:bg-white'
              }`}
            >
              Female ({femaleCount})
            </button>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-end gap-[12px] p-[16px] bg-white rounded-[12px] border border-[#e4e6e5]">
            {/* Search */}
            <div className="flex flex-col gap-[4px] flex-1 min-w-[200px]">
              <label className="font-['Urbanist'] text-[12px] font-medium text-[#6b7270] uppercase tracking-wider">
                Search
              </label>
              <input
                type="text"
                placeholder="Name, ID, or phone..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="px-[12px] py-[10px] rounded-[8px] border border-[#e4e6e5] font-['Urbanist'] text-[14px] focus:outline-none focus:border-[#1e4841]"
              />
            </div>

            {/* Date Filter */}
            <div className="flex flex-col gap-[4px] min-w-[160px]">
              <label className="font-['Urbanist'] text-[12px] font-medium text-[#6b7270] uppercase tracking-wider">
                Joined Date
              </label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => handleDateChange(e.target.value)}
                className="px-[12px] py-[10px] rounded-[8px] border border-[#e4e6e5] font-['Urbanist'] text-[14px] focus:outline-none focus:border-[#1e4841]"
              />
            </div>

            {/* Age Range */}
            <div className="flex flex-col gap-[4px]">
              <label className="font-['Urbanist'] text-[12px] font-medium text-[#6b7270] uppercase tracking-wider">
                Age Range
              </label>
              <div className="flex items-center gap-[6px]">
                <input
                  type="number"
                  placeholder="Min"
                  value={minAge}
                  onChange={(e) => handleMinAgeChange(e.target.value)}
                  min="0"
                  max="100"
                  className="w-[70px] px-[10px] py-[10px] rounded-[8px] border border-[#e4e6e5] font-['Urbanist'] text-[14px] focus:outline-none focus:border-[#1e4841]"
                />
                <span className="font-['Urbanist'] text-[14px] text-[#6b7270]">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxAge}
                  onChange={(e) => handleMaxAgeChange(e.target.value)}
                  min="0"
                  max="100"
                  className="w-[70px] px-[10px] py-[10px] rounded-[8px] border border-[#e4e6e5] font-['Urbanist'] text-[14px] focus:outline-none focus:border-[#1e4841]"
                />
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-[14px] py-[10px] rounded-[8px] border border-[#e4e6e5] font-['Urbanist'] text-[13px] font-medium text-[#6b7270] hover:bg-[#ecf4e9] transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Results Count */}
          <p className="font-['Urbanist'] text-[13px] text-[#6b7270]">
            Showing {filteredUsers.length} of {users.length} users
            {dateFilter && (
              <span className="ml-[4px] px-[8px] py-[2px] bg-[#ecf4e9] rounded-[4px] text-[#1e4841] font-medium">
                joined {new Date(dateFilter + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            )}
            {(minAge || maxAge) && (
              <span className="ml-[4px] px-[8px] py-[2px] bg-[#ecf4e9] rounded-[4px] text-[#1e4841] font-medium">
                age {minAge || '0'}-{maxAge || '100'}
              </span>
            )}
          </p>

          {/* Users Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onClick={() => handleUserClick(user.id)}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-[60px] text-center">
                <span className="text-[48px] mb-[16px]">👤</span>
                <p className="font-['Urbanist'] text-[16px] font-semibold text-[#232d2c]">
                  No users found
                </p>
                <p className="font-['Urbanist'] text-[14px] text-[#6b7270] mt-[8px]">
                  {hasActiveFilters ? 'Try adjusting your filters' : 'No users available'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UsersManagement;
