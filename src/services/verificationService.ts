import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';

export interface UnverifiedUser {
  id: string;
  displayName: string;
  phoneNumber: string;
  age?: number;
  verificationPhoto?: string;
  verificationStatus?: string;
  createdAt?: any;
}

export const fetchUnverifiedFemales = async (): Promise<UnverifiedUser[]> => {
  try {
    const q = query(
      collection(db, 'users'),
      where('gender', '==', 'female'),
      where('isVerified', '==', false)
    );
    const snapshot = await getDocs(q);
    const users: UnverifiedUser[] = snapshot.docs
      .filter(d => {
        // Exclude already-rejected users — they still have isVerified=false
        const status = d.data().verificationStatus;
        return status !== 'rejected';
      })
      .map(d => ({
        id: d.id,
        displayName: d.data().displayName || d.data().name || 'Unknown',
        phoneNumber: d.data().phoneNumber || 'N/A',
        age: d.data().age,
        verificationPhoto: d.data().verificationPhoto,
        verificationStatus: d.data().verificationStatus,
        createdAt: d.data().createdAt,
      }));

    console.log(`Fetched ${users.length} unverified female users`);
    return users;
  } catch (error) {
    console.error('Error fetching unverified females:', error);
    throw error;
  }
};

export const verifyUser = async (userId: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      isVerified: true,
      verificationStatus: 'verified',
    });
    console.log(`User ${userId} verified successfully`);
  } catch (error) {
    console.error('Error verifying user:', error);
    throw error;
  }
};

export const rejectUser = async (userId: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      verificationStatus: 'rejected',
    });
    console.log(`User ${userId} rejected`);
  } catch (error) {
    console.error('Error rejecting user:', error);
    throw error;
  }
};
