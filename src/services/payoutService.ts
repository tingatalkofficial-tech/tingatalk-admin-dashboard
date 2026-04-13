import { collection, getDocs, doc, getDoc, updateDoc, query, orderBy, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { PayoutRequest, PayoutStatus, FemalePaymentAccount, PayoutStats } from '../types/payouts';

export const fetchAllPayoutRequests = async (): Promise<PayoutRequest[]> => {
  try {
    const q = query(
      collection(db, 'payout_requests'),
      orderBy('requestedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    const payouts: PayoutRequest[] = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    } as PayoutRequest));

    console.log(`Fetched ${payouts.length} payout requests`);
    return payouts;
  } catch (error) {
    console.error('Error fetching payout requests:', error);
    throw error;
  }
};

export const fetchPayoutsByStatus = async (status: PayoutStatus): Promise<PayoutRequest[]> => {
  try {
    const q = query(
      collection(db, 'payout_requests'),
      where('status', '==', status),
      orderBy('requestedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    } as PayoutRequest));
  } catch (error) {
    console.error(`Error fetching ${status} payouts:`, error);
    throw error;
  }
};

export const fetchFemalePaymentAccount = async (userId: string): Promise<FemalePaymentAccount | null> => {
  try {
    const docRef = doc(db, 'female_payment_accounts', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as FemalePaymentAccount;
    }
    return null;
  } catch (error) {
    console.error('Error fetching payment account:', error);
    return null;
  }
};

export const updatePayoutStatus = async (
  requestId: string,
  newStatus: PayoutStatus,
  adminNotes?: string,
  transactionId?: string
): Promise<void> => {
  try {
    const docRef = doc(db, 'payout_requests', requestId);
    const updateData: Record<string, any> = {
      status: newStatus,
      processedAt: Timestamp.now(),
    };
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }
    if (transactionId !== undefined) {
      updateData.transactionId = transactionId;
    }
    await updateDoc(docRef, updateData);
    console.log(`Payout ${requestId} updated to ${newStatus}`);
  } catch (error) {
    console.error('Error updating payout status:', error);
    throw error;
  }
};

export const updateFemaleEarningsOnApproval = async (
  userId: string,
  payoutRequestId: string,
  amount: number
): Promise<void> => {
  try {
    const { runTransaction } = await import('firebase/firestore');
    const earningsRef = doc(db, 'female_earnings', userId);
    const userPayoutRef = doc(db, 'users', userId, 'payouts', payoutRequestId);

    await runTransaction(db, async (transaction) => {
      const earningsDoc = await transaction.get(earningsRef);
      if (!earningsDoc.exists()) {
        throw new Error('Female earnings document not found');
      }
      const data = earningsDoc.data();
      const currentPending = data.pendingAmount || 0;
      const currentClaimed = data.claimedAmount || 0;

      // Update female_earnings: move from pending to claimed
      transaction.update(earningsRef, {
        pendingAmount: Math.max(0, currentPending - amount),
        claimedAmount: currentClaimed + amount,
        lastUpdated: Timestamp.now(),
      });

      // Update users/{userId}/payouts/{id} status
      try {
        transaction.update(userPayoutRef, {
          status: 'completed',
          updatedAt: Timestamp.now(),
        });
      } catch (e) {
        // Subcollection doc may not exist if created via backend API only
        console.warn('Could not update user payout subcollection doc:', e);
      }
    });
    console.log(`Female earnings updated for ${userId}: moved ${amount} from pending to claimed`);
  } catch (error) {
    console.error('Error updating female earnings on approval:', error);
    throw error;
  }
};

export const updateFemaleEarningsOnRejection = async (
  userId: string,
  payoutRequestId: string,
  amount: number
): Promise<void> => {
  try {
    const { runTransaction } = await import('firebase/firestore');
    const earningsRef = doc(db, 'female_earnings', userId);
    const userDocRef = doc(db, 'users', userId);
    const userPayoutRef = doc(db, 'users', userId, 'payouts', payoutRequestId);

    await runTransaction(db, async (transaction) => {
      const [earningsDoc, userDoc] = await Promise.all([
        transaction.get(earningsRef),
        transaction.get(userDocRef),
      ]);

      if (!earningsDoc.exists()) {
        throw new Error('Female earnings document not found');
      }

      const earningsData = earningsDoc.data();
      const currentPending = earningsData.pendingAmount || 0;
      const currentAvailable = earningsData.availableBalance || 0;

      // Restore female_earnings: move from pending back to available
      transaction.update(earningsRef, {
        pendingAmount: Math.max(0, currentPending - amount),
        availableBalance: currentAvailable + amount,
        lastUpdated: Timestamp.now(),
      });

      // Also restore users/{userId} balance fields (mobile app reads from here)
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userAvailable = userData.availableBalance || 0;
        const userClaimed = userData.claimedAmount || 0;

        transaction.update(userDocRef, {
          availableBalance: userAvailable + amount,
          claimedAmount: Math.max(0, userClaimed - amount),
        });
      }

      // Update users/{userId}/payouts/{id} status
      try {
        transaction.update(userPayoutRef, {
          status: 'rejected',
          updatedAt: Timestamp.now(),
        });
      } catch (e) {
        console.warn('Could not update user payout subcollection doc:', e);
      }
    });
    console.log(`Female earnings updated for ${userId}: restored ${amount} from pending to available`);
  } catch (error) {
    console.error('Error updating female earnings on rejection:', error);
    throw error;
  }
};

export const computePayoutStats = (payouts: PayoutRequest[]): PayoutStats => {
  const stats: PayoutStats = {
    totalPayouts: payouts.length,
    totalAmountPaid: 0,
    pendingCount: 0,
    pendingAmount: 0,
    processingCount: 0,
    processingAmount: 0,
    completedCount: 0,
    completedAmount: 0,
    rejectedCount: 0,
    rejectedAmount: 0,
  };

  payouts.forEach(p => {
    switch (p.status) {
      case 'pending':
        stats.pendingCount++;
        stats.pendingAmount += p.amount;
        break;
      case 'processing':
        stats.processingCount++;
        stats.processingAmount += p.amount;
        break;
      case 'completed':
        stats.completedCount++;
        stats.completedAmount += p.amount;
        stats.totalAmountPaid += p.amount;
        break;
      case 'rejected':
        stats.rejectedCount++;
        stats.rejectedAmount += p.amount;
        break;
    }
  });

  return stats;
};

export const onPendingPayoutsCount = (callback: (count: number) => void): (() => void) => {
  const q = query(
    collection(db, 'payout_requests'),
    where('status', '==', 'pending')
  );
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.size);
  }, (err) => {
    console.error('Error listening to pending payouts:', err);
  });
};
