import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';

const isHttpUrl = (val: any): val is string =>
  typeof val === 'string' && (val.startsWith('http://') || val.startsWith('https://'));

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
        const data = d.data();
        // Exclude already-rejected users — they still have isVerified=false
        if (data.verificationStatus === 'rejected') return false;
        // Only show users who have actually uploaded a verification photo
        if (!isHttpUrl(data.verificationPhoto)) return false;
        return true;
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
      isVerified: false,
      verificationStatus: 'rejected',
    });
    console.log(`User ${userId} rejected`);
  } catch (error) {
    console.error('Error rejecting user:', error);
    throw error;
  }
};
