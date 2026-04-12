import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import { fetchUserDetail } from '../services/usersService';
import { UserDetail } from '../types/users';

const UserDetailPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadUserDetail(userId);
    }
  }, [userId]);

  const loadUserDetail = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchUserDetail(id);
      setUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user details');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col lg:flex-row w-full min-h-screen bg-[#ecf4e9]">
        <Sidebar />
        <main className="flex-1 bg-[#fbfbfc] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e4841]"></div>
            <p className="mt-4 font-['Urbanist'] text-[14px] text-[#6b7270]">Loading user details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col lg:flex-row w-full min-h-screen bg-[#ecf4e9]">
        <Sidebar />
        <main className="flex-1 bg-[#fbfbfc] flex items-center justify-center">
          <div className="text-center">
            <span className="text-[48px]">⚠️</span>
            <p className="mt-4 font-['Urbanist'] text-[16px] font-semibold text-[#f63440]">
              {error || 'User not found'}
            </p>
            <button
              onClick={() => navigate('/users')}
              className="mt-4 px-[16px] py-[10px] bg-[#1e4841] text-white rounded-[8px] hover:bg-[#2d5f56] transition-colors font-['Urbanist'] text-[14px] font-medium"
            >
              Back to Users
            </button>
          </div>
        </main>
      </div>
    );
  }

  const genderIcon = user.gender === 'male' ? '👨' : '👩';
  const genderColor = user.gender === 'male' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600';

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

          {/* Back Button */}
          <button
            onClick={() => navigate('/users')}
            className="flex items-center gap-[8px] w-fit px-[12px] py-[8px] text-[#1e4841] hover:bg-[#ecf4e9] rounded-[8px] transition-colors font-['Urbanist'] text-[14px] font-medium"
          >
            <span>←</span>
            <span>Back to Users</span>
          </button>

          {/* User Profile Card */}
          <div className="flex flex-col md:flex-row gap-[20px] p-[24px] rounded-[16px] border border-[#e4e6e5] bg-white">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.displayName}
                className="w-[120px] h-[120px] rounded-full object-cover"
              />
            ) : (
              <div className={`flex w-[120px] h-[120px] items-center justify-center rounded-full ${genderColor}`}>
                <span className="text-[60px]">{genderIcon}</span>
              </div>
            )}

            <div className="flex-1 flex flex-col gap-[12px]">
              <h1 className="font-['Urbanist'] text-[28px] font-bold text-[#232d2c]">
                {user.displayName}
              </h1>
              <div className="flex flex-wrap gap-[12px]">
                <div className="flex items-center gap-[6px] px-[12px] py-[6px] bg-[#ecf4e9] rounded-[6px]">
                  <span className="font-['Urbanist'] text-[14px] text-[#6b7270]">Gender:</span>
                  <span className="font-['Urbanist'] text-[14px] font-semibold text-[#232d2c] capitalize">
                    {user.gender}
                  </span>
                </div>
                {user.age && (
                  <div className="flex items-center gap-[6px] px-[12px] py-[6px] bg-[#ecf4e9] rounded-[6px]">
                    <span className="font-['Urbanist'] text-[14px] text-[#6b7270]">Age:</span>
                    <span className="font-['Urbanist'] text-[14px] font-semibold text-[#232d2c]">
                      {user.age}
                    </span>
                  </div>
                )}
                {user.dailyRewardCount !== undefined && (
                  <div className="flex items-center gap-[6px] px-[12px] py-[6px] bg-[#ecf4e9] rounded-[6px]">
                    <span className="font-['Urbanist'] text-[14px] text-[#6b7270]">Daily Rewards:</span>
                    <span className="font-['Urbanist'] text-[14px] font-semibold text-[#232d2c]">
                      {user.dailyRewardCount}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-[6px] text-[12px] text-[#6b7270]">
                <span>User ID:</span>
                <span className="font-mono">{user.id}</span>
              </div>
            </div>
          </div>

          {/* Male-specific data */}
          {user.gender === 'male' && user.maleAdminData && (
            <>
              {/* Financial Overview */}
              <div className="flex flex-col gap-[12px]">
                <h2 className="font-['Urbanist'] text-[18px] font-bold text-[#232d2c]">
                  💰 Financial Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px]">
                  <div className="flex flex-col gap-[8px] p-[16px] rounded-[12px] border border-[#e4e6e5] bg-white">
                    <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Current Balance</span>
                    <span className="font-['Urbanist'] text-[24px] font-bold text-[#1e4841]">
                      🪙 {user.maleAdminData.currentBalance}
                    </span>
                  </div>
                  <div className="flex flex-col gap-[8px] p-[16px] rounded-[12px] border border-[#e4e6e5] bg-white">
                    <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Total Coins Purchased</span>
                    <span className="font-['Urbanist'] text-[24px] font-bold text-[#232d2c]">
                      {user.maleAdminData.totalCoinsPurchased}
                    </span>
                  </div>
                  <div className="flex flex-col gap-[8px] p-[16px] rounded-[12px] border border-[#e4e6e5] bg-white">
                    <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Total Coins Spent</span>
                    <span className="font-['Urbanist'] text-[24px] font-bold text-[#f63440]">
                      {user.maleAdminData.totalCoinsSpent}
                    </span>
                  </div>
                  <div className="flex flex-col gap-[8px] p-[16px] rounded-[12px] border border-[#e4e6e5] bg-white">
                    <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Total Spent (INR)</span>
                    <span className="font-['Urbanist'] text-[24px] font-bold text-[#232d2c]">
                      ₹{user.maleAdminData.totalSpentINR}
                    </span>
                  </div>
                </div>
              </div>

              {/* Purchase Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                <div className="flex flex-col gap-[8px] p-[16px] rounded-[12px] border border-[#e4e6e5] bg-white">
                  <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Total Purchases</span>
                  <span className="font-['Urbanist'] text-[24px] font-bold text-[#232d2c]">
                    🛒 {user.maleAdminData.totalPurchaseCount}
                  </span>
                </div>
                <div className="flex flex-col gap-[8px] p-[16px] rounded-[12px] border border-[#e4e6e5] bg-white">
                  <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Favorites</span>
                  <span className="font-['Urbanist'] text-[24px] font-bold text-[#232d2c]">
                    ❤️ {user.maleAdminData.favoritesCount}
                  </span>
                </div>
              </div>

              {/* Call Statistics */}
              <div className="flex flex-col gap-[12px]">
                <h2 className="font-['Urbanist'] text-[18px] font-bold text-[#232d2c]">
                  📞 Call Statistics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px]">
                  <div className="flex flex-col gap-[8px] p-[16px] rounded-[12px] border border-[#e4e6e5] bg-white">
                    <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Total Calls Made</span>
                    <span className="font-['Urbanist'] text-[24px] font-bold text-[#232d2c]">
                      {user.maleAdminData.totalCallsMade}
                    </span>
                  </div>
                  <div className="flex flex-col gap-[8px] p-[16px] rounded-[12px] border border-[#e4e6e5] bg-white">
                    <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Audio Calls</span>
                    <span className="font-['Urbanist'] text-[24px] font-bold text-[#232d2c]">
                      🎧 {user.maleAdminData.totalAudioCallsMade}
                    </span>
                  </div>
                  <div className="flex flex-col gap-[8px] p-[16px] rounded-[12px] border border-[#e4e6e5] bg-white">
                    <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Video Calls</span>
                    <span className="font-['Urbanist'] text-[24px] font-bold text-[#232d2c]">
                      🎥 {user.maleAdminData.totalVideoCallsMade}
                    </span>
                  </div>
                  <div className="flex flex-col gap-[8px] p-[16px] rounded-[12px] border border-[#e4e6e5] bg-white">
                    <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Total Duration</span>
                    <span className="font-['Urbanist'] text-[24px] font-bold text-[#232d2c]">
                      {user.maleAdminData.totalCallDurationMinutes.toFixed(1)} min
                    </span>
                  </div>
                </div>
              </div>

              {/* Daily Rewards */}
              <div className="flex flex-col gap-[12px]">
                <h2 className="font-['Urbanist'] text-[18px] font-bold text-[#232d2c]">
                  🎁 Daily Rewards
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
                  <div className="flex flex-col gap-[8px] p-[16px] rounded-[12px] border border-[#e4e6e5] bg-white">
                    <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Current Streak</span>
                    <span className="font-['Urbanist'] text-[24px] font-bold text-[#1e4841]">
                      🔥 {user.maleAdminData.currentStreak} days
                    </span>
                  </div>
                  <div className="flex flex-col gap-[8px] p-[16px] rounded-[12px] border border-[#e4e6e5] bg-white">
                    <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Highest Streak</span>
                    <span className="font-['Urbanist'] text-[24px] font-bold text-[#232d2c]">
                      🏆 {user.maleAdminData.highestStreak} days
                    </span>
                  </div>
                  <div className="flex flex-col gap-[8px] p-[16px] rounded-[12px] border border-[#e4e6e5] bg-white">
                    <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Total Rewards Collected</span>
                    <span className="font-['Urbanist'] text-[24px] font-bold text-[#232d2c]">
                      ⭐ {user.maleAdminData.totalDailyRewardsCollected}
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="flex flex-col gap-[12px]">
                <h2 className="font-['Urbanist'] text-[18px] font-bold text-[#232d2c]">
                  📋 Account Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                  <div className="flex flex-col gap-[8px] p-[16px] rounded-[12px] border border-[#e4e6e5] bg-white">
                    <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Phone Number</span>
                    <span className="font-['Urbanist'] text-[16px] font-semibold text-[#232d2c]">
                      📱 {user.maleAdminData.phoneNumber}
                    </span>
                  </div>
                  <div className="flex flex-col gap-[8px] p-[16px] rounded-[12px] border border-[#e4e6e5] bg-white">
                    <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Age</span>
                    <span className="font-['Urbanist'] text-[16px] font-semibold text-[#232d2c]">
                      🎂 {user.maleAdminData.age} years
                    </span>
                  </div>
                  <div className="flex flex-col gap-[8px] p-[16px] rounded-[12px] border border-[#e4e6e5] bg-white">
                    <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Joined At</span>
                    <span className="font-['Urbanist'] text-[14px] font-semibold text-[#232d2c]">
                      {user.maleAdminData.joinedAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-[8px] p-[16px] rounded-[12px] border border-[#e4e6e5] bg-white">
                    <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Last Active</span>
                    <span className="font-['Urbanist'] text-[14px] font-semibold text-[#232d2c]">
                      {user.maleAdminData.lastActiveAt?.toDate?.()?.toLocaleString() || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Female-specific data */}
          {user.gender === 'female' && user.femaleAdminData && (
            <>
              {/* Earnings Overview */}
              <div className="flex flex-col gap-[12px]">
                <h2 className="font-['Urbanist'] text-[18px] font-bold text-[#232d2c]">
                  💰 Earnings Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
                  <div className="flex flex-col gap-[8px] p-[16px] rounded-[12px] border border-[#e4e6e5] bg-white">
                    <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Total Earnings (INR)</span>
                    <span className="font-['Urbanist'] text-[24px] font-bold text-[#232d2c]">
                      ₹{user.femaleAdminData.totalEarningsINR.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-[8px] p-[16px] rounded-[12px] border border-[#e4e6e5] bg-white">
                    <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Available Balance (INR)</span>
                    <span className="font-['Urbanist'] text-[24px] font-bold text-[#1e4841]">
                      ₹{user.femaleAdminData.availableBalanceINR.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-[8px] p-[16px] rounded-[12px] border border-orange-200 bg-orange-50">
                    <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Pending Payout (INR)</span>
                    <span className="font-['Urbanist'] text-[24px] font-bold text-orange-600">
                      ₹{user.femaleAdminData.pendingAmountINR.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-[8px] p-[16px] rounded-[12px] border border-[#e4e6e5] bg-white">
                    <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Claimed Amount (INR)</span>
                    <span className="font-['Urbanist'] text-[24px] font-bold text-[#232d2c]">
                      ₹{user.femaleAdminData.claimedAmountINR.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-[8px] p-[16px] rounded-[12px] border border-[#e4e6e5] bg-white">
                    <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Today Earnings (INR)</span>
                    <span className="font-['Urbanist'] text-[24px] font-bold text-[#1e4841]">
                      ₹{user.femaleAdminData.todayEarningsINR.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rating & Likes */}
              <div className="flex flex-col gap-[12px]">
                <h2 className="font-['Urbanist'] text-[18px] font-bold text-[#232d2c]">
                  ⭐ Rating & Feedback
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px]">
                  <div className="flex flex-col gap-[8px] p-[16px] rounded-[12px] border border-[#e4e6e5] bg-white">
                    <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Rating</span>
                    <span className="font-['Urbanist'] text-[24px] font-bold text-[#232d2c]">
                      ⭐ {user.femaleAdminData.rating}
                    </span>
                  </div>
                  <div className="flex flex-col gap-[8px] p-[16px] rounded-[12px] border border-[#e4e6e5] bg-white">
                    <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Total Likes</span>
                    <span className="font-['Urbanist'] text-[24px] font-bold text-[#1e4841]">
                      👍 {user.femaleAdminData.totalLikes}
                    </span>
                  </div>
                  <div className="flex flex-col gap-[8px] p-[16px] rounded-[12px] border border-[#e4e6e5] bg-white">
                    <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Total Dislikes</span>
                    <span className="font-['Urbanist'] text-[24px] font-bold text-[#f63440]">
                      👎 {user.femaleAdminData.totalDislikes}
                    </span>
                  </div>
                  <div className="flex flex-col gap-[8px] p-[16px] rounded-[12px] border border-[#e4e6e5] bg-white">
                    <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Favorited By</span>
                    <span className="font-['Urbanist'] text-[24px] font-bold text-[#232d2c]">
                      ❤️ {user.femaleAdminData.favoritedByCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Call Statistics */}
              <div className="flex flex-col gap-[12px]">
                <h2 className="font-['Urbanist'] text-[18px] font-bold text-[#232d2c]">
                  📞 Call Statistics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px]">
                  <div className="flex flex-col gap-[8px] p-[16px] rounded-[12px] border border-[#e4e6e5] bg-white">
                    <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Total Calls Received</span>
                    <span className="font-['Urbanist'] text-[24px] font-bold text-[#232d2c]">
                      {user.femaleAdminData.totalCallsReceived}
                    </span>
                  </div>
                  <div className="flex flex-col gap-[8px] p-[16px] rounded-[12px] border border-[#e4e6e5] bg-white">
                    <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Audio Calls Received</span>
                    <span className="font-['Urbanist'] text-[24px] font-bold text-[#232d2c]">
                      🎧 {user.femaleAdminData.totalAudioCallsReceived}
                    </span>
                  </div>
                  <div className="flex flex-col gap-[8px] p-[16px] rounded-[12px] border border-[#e4e6e5] bg-white">
                    <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Video Calls Received</span>
                    <span className="font-['Urbanist'] text-[24px] font-bold text-[#232d2c]">
                      🎥 {user.femaleAdminData.totalVideoCallsReceived}
                    </span>
                  </div>
                  <div className="flex flex-col gap-[8px] p-[16px] rounded-[12px] border border-[#e4e6e5] bg-white">
                    <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Total Duration</span>
                    <span className="font-['Urbanist'] text-[24px] font-bold text-[#232d2c]">
                      {user.femaleAdminData.totalCallDurationMinutes.toFixed(1)} min
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="flex flex-col gap-[12px]">
                <h2 className="font-['Urbanist'] text-[18px] font-bold text-[#232d2c]">
                  📋 Account Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                  <div className="flex flex-col gap-[8px] p-[16px] rounded-[12px] border border-[#e4e6e5] bg-white">
                    <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Phone Number</span>
                    <span className="font-['Urbanist'] text-[16px] font-semibold text-[#232d2c]">
                      📱 {user.femaleAdminData.phoneNumber}
                    </span>
                  </div>
                  <div className="flex flex-col gap-[8px] p-[16px] rounded-[12px] border border-[#e4e6e5] bg-white">
                    <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Age</span>
                    <span className="font-['Urbanist'] text-[16px] font-semibold text-[#232d2c]">
                      🎂 {user.femaleAdminData.age} years
                    </span>
                  </div>
                  <div className="flex flex-col gap-[8px] p-[16px] rounded-[12px] border border-[#e4e6e5] bg-white">
                    <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Joined At</span>
                    <span className="font-['Urbanist'] text-[14px] font-semibold text-[#232d2c]">
                      {user.femaleAdminData.joinedAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-[8px] p-[16px] rounded-[12px] border border-[#e4e6e5] bg-white">
                    <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">Last Active</span>
                    <span className="font-['Urbanist'] text-[14px] font-semibold text-[#232d2c]">
                      {user.femaleAdminData.lastActiveAt?.toDate?.()?.toLocaleString() || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserDetailPage;
