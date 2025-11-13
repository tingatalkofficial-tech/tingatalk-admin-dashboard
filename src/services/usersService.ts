import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { User, UserDetail } from '../types/users';

export const fetchAllUsers = async (): Promise<User[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'users'));
    const users: User[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as User));
    
    console.log(`✅ Fetched ${users.length} users`);
    return users;
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    throw error;
  }
};

export const fetchUserDetail = async (userId: string): Promise<UserDetail> => {
  try {
    // Fetch user basic info
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    
    const userData = { id: userDoc.id, ...userDoc.data() } as User;
    const userDetail: UserDetail = { ...userData };

    // If male, fetch admin data
    if (userData.gender === 'male') {
      try {
        const maleAdminDoc = await getDoc(doc(db, 'male_users_admin', userId));
        if (maleAdminDoc.exists()) {
          userDetail.maleAdminData = {
            userId,
            ...maleAdminDoc.data()
          } as any;
          console.log('✅ Fetched male admin data:', userDetail.maleAdminData);
        }
      } catch (err) {
        console.warn('No male admin data for user:', userId);
      }
    }

    // If female, fetch admin data
    if (userData.gender === 'female') {
      try {
        const femaleAdminDoc = await getDoc(doc(db, 'female_users_admin', userId));
        if (femaleAdminDoc.exists()) {
          userDetail.femaleAdminData = {
            userId,
            ...femaleAdminDoc.data()
          } as any;
          console.log('✅ Fetched female admin data:', userDetail.femaleAdminData);
        }
      } catch (err) {
        console.warn('No female admin data for user:', userId);
      }
    }

    return userDetail;
  } catch (error) {
    console.error('❌ Error fetching user detail:', error);
    throw error;
  }
};
