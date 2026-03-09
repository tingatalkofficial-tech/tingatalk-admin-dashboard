import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import { fetchUnverifiedFemales, verifyUser, rejectUser, UnverifiedUser } from '../services/verificationService';

const VerificationPage: React.FC = () => {
  const [users, setUsers] = useState<UnverifiedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [photoModal, setPhotoModal] = useState<string | null>(null);

  useEffect(() => {
    loadUnverifiedUsers();
  }, []);

  const loadUnverifiedUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchUnverifiedFemales();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load unverified users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (userId: string) => {
    setActionLoading(userId);
    try {
      await verifyUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      alert('Failed to verify user. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userId: string) => {
    setActionLoading(userId);
    try {
      await rejectUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      alert('Failed to reject user. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col lg:flex-row w-full min-h-screen bg-[#ecf4e9]">
        <Sidebar />
        <main className="flex-1 bg-[#fbfbfc] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e4841]"></div>
            <p className="mt-4 font-['Urbanist'] text-[14px] text-[#6b7270]">Loading unverified users...</p>
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

          {/* Page Title */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[12px]">
            <div className="flex flex-col gap-[8px]">
              <h1 className="font-['Urbanist'] text-[24px] md:text-[28px] font-bold text-[#232d2c]">
                Verification
              </h1>
              <p className="font-['Urbanist'] text-[14px] text-[#6b7270]">
                {users.length} female user{users.length !== 1 ? 's' : ''} pending verification
              </p>
            </div>
            <button
              onClick={loadUnverifiedUsers}
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
                onClick={loadUnverifiedUsers}
                className="px-[12px] py-[6px] bg-white text-[#f63440] rounded-[6px] hover:bg-gray-50 transition-colors font-['Urbanist'] text-[12px] font-medium"
              >
                Retry
              </button>
            </div>
          )}

          {/* Users Grid */}
          {users.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-[16px] border border-[#e4e6e5] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Verification Photo */}
                  <div className="w-full h-[200px] bg-[#ecf4e9] flex items-center justify-center">
                    {user.verificationPhoto ? (
                      <img
                        src={user.verificationPhoto}
                        alt={`${user.displayName}'s verification photo`}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setPhotoModal(user.verificationPhoto!)}
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-[8px]">
                        <span className="text-[48px]">📷</span>
                        <span className="font-['Urbanist'] text-[12px] text-[#6b7270]">No photo uploaded</span>
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="p-[16px] flex flex-col gap-[12px]">
                    <div className="flex flex-col gap-[4px]">
                      <h3 className="font-['Urbanist'] text-[18px] font-bold text-[#232d2c]">
                        {user.displayName}
                      </h3>
                      {user.age && (
                        <span className="font-['Urbanist'] text-[13px] text-[#6b7270]">
                          Age: {user.age}
                        </span>
                      )}
                    </div>

                    {/* Phone Number - prominent display */}
                    <div className="flex items-center gap-[8px] bg-[#ecf4e9] rounded-[8px] px-[12px] py-[10px]">
                      <span className="text-[16px]">📞</span>
                      <span className="font-['Urbanist'] text-[15px] font-semibold text-[#1e4841]">
                        {user.phoneNumber}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-[6px]">
                      <span className={`inline-flex items-center px-[10px] py-[4px] rounded-full text-[12px] font-['Urbanist'] font-medium ${
                        user.verificationStatus === 'pending'
                          ? 'bg-[#fff3cd] text-[#856404]'
                          : 'bg-[#e4e6e5] text-[#6b7270]'
                      }`}>
                        {user.verificationStatus === 'pending' ? '⏳ Pending' : '🆕 New'}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-[8px] mt-[4px]">
                      <button
                        onClick={() => handleVerify(user.id)}
                        disabled={actionLoading === user.id}
                        className="flex-1 flex items-center justify-center gap-[6px] px-[16px] py-[10px] bg-[#1e4841] text-white rounded-[8px] hover:bg-[#2d5f56] transition-colors font-['Urbanist'] text-[14px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === user.id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <span>✅</span>
                            <span>Verify</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleReject(user.id)}
                        disabled={actionLoading === user.id}
                        className="flex-1 flex items-center justify-center gap-[6px] px-[16px] py-[10px] bg-white text-[#f63440] border border-[#f63440] rounded-[8px] hover:bg-[#fcced1] transition-colors font-['Urbanist'] text-[14px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>❌</span>
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-[80px] text-center">
              <span className="text-[64px] mb-[16px]">✅</span>
              <p className="font-['Urbanist'] text-[18px] font-semibold text-[#232d2c]">
                All caught up!
              </p>
              <p className="font-['Urbanist'] text-[14px] text-[#6b7270] mt-[8px]">
                No pending verifications at the moment.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Photo Modal */}
      {photoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setPhotoModal(null)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <img
              src={photoModal}
              alt="Verification photo"
              className="max-w-full max-h-[90vh] rounded-[12px] object-contain"
            />
            <button
              onClick={() => setPhotoModal(null)}
              className="absolute top-[8px] right-[8px] w-[36px] h-[36px] bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-[18px]">✕</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationPage;
