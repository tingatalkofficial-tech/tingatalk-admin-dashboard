import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import UserCard from '../components/Users/UserCard';
import { fetchAllUsers } from '../services/usersService';
import { User } from '../types/users';

const UsersManagement: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedGender, setSelectedGender] = useState<'all' | 'male' | 'female'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, selectedGender, searchQuery]);

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

  const filterUsers = () => {
    let filtered = users;

    // Filter by gender
    if (selectedGender !== 'all') {
      filtered = filtered.filter(u => u.gender === selectedGender);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(u =>
        u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

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

          {/* Search Bar */}
          <div className="flex w-full">
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-[16px] py-[12px] rounded-[8px] border border-[#e4e6e5] font-['Urbanist'] text-[14px] focus:outline-none focus:border-[#1e4841]"
            />
          </div>

          {/* Gender Filter Toggle */}
          <div className="flex gap-[8px] p-[4px] bg-[#ecf4e9] rounded-[8px] w-fit">
            <button
              onClick={() => setSelectedGender('all')}
              className={`px-[20px] py-[8px] rounded-[6px] font-['Urbanist'] text-[14px] font-medium transition-colors ${
                selectedGender === 'all'
                  ? 'bg-[#1e4841] text-white'
                  : 'bg-transparent text-[#232d2c] hover:bg-white'
              }`}
            >
              All ({users.length})
            </button>
            <button
              onClick={() => setSelectedGender('male')}
              className={`px-[20px] py-[8px] rounded-[6px] font-['Urbanist'] text-[14px] font-medium transition-colors ${
                selectedGender === 'male'
                  ? 'bg-[#1e4841] text-white'
                  : 'bg-transparent text-[#232d2c] hover:bg-white'
              }`}
            >
              👨 Male ({maleCount})
            </button>
            <button
              onClick={() => setSelectedGender('female')}
              className={`px-[20px] py-[8px] rounded-[6px] font-['Urbanist'] text-[14px] font-medium transition-colors ${
                selectedGender === 'female'
                  ? 'bg-[#1e4841] text-white'
                  : 'bg-transparent text-[#232d2c] hover:bg-white'
              }`}
            >
              👩 Female ({femaleCount})
            </button>
          </div>

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
                  {searchQuery ? 'Try a different search term' : 'No users available'}
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
