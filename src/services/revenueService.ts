import { collection, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { DailyRevenue } from '../types/revenue';

export const fetchDailyRevenue = async (): Promise<DailyRevenue[]> => {
  try {
    const revenueCollection = collection(db, 'admin_analytics', 'financial_stats', 'RevenueByDate');
    const snapshot = await getDocs(revenueCollection);
    
    const revenues: DailyRevenue[] = snapshot.docs.map(doc => ({
      ...doc.data()
    } as DailyRevenue));
    
    // Sort by date descending (most recent first)
    revenues.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
    
    console.log(`✅ Fetched ${revenues.length} daily revenue records`);
    return revenues;
  } catch (error) {
    console.error('❌ Error fetching daily revenue:', error);
    throw error;
  }
};
