const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs, doc, updateDoc } = require('firebase/firestore');

const app = initializeApp({
  apiKey: 'AIzaSyDGIHRWxDzVCpUhwqiX3ic7a0CP5sUjL3c',
  authDomain: 'tingatalk-53057.firebaseapp.com',
  projectId: 'tingatalk-53057',
  storageBucket: 'tingatalk-53057.firebasestorage.app',
  messagingSenderId: '462676704637',
  appId: '1:462676704637:web:52de781bba225bb88c6014',
});
const db = getFirestore(app);

(async () => {
  try {
    const q = query(
      collection(db, 'users'),
      where('gender', '==', 'female'),
      where('isVerified', '==', true)
    );
    const snapshot = await getDocs(q);
    console.log(`Total verified females: ${snapshot.size}`);

    const stuck = [];
    snapshot.forEach(d => {
      const data = d.data();
      if (data.verificationStatus !== 'verified') {
        stuck.push({
          id: d.id,
          name: data.displayName || data.name || 'Unknown',
          currentStatus: data.verificationStatus || '(missing)',
        });
      }
    });

    console.log(`\nStuck users (isVerified=true, verificationStatus != 'verified'): ${stuck.length}`);
    stuck.forEach(u => console.log(`  - ${u.id} | ${u.name} | status="${u.currentStatus}"`));

    if (stuck.length === 0) {
      console.log('\nNothing to backfill. Exiting.');
      process.exit(0);
    }

    console.log('\nUpdating each stuck user...');
    for (const u of stuck) {
      try {
        await updateDoc(doc(db, 'users', u.id), {
          isVerified: true,
          verificationStatus: 'verified',
        });
        console.log(`  OK Updated ${u.id}`);
      } catch (e) {
        console.log(`  FAIL ${u.id}: ${e.message}`);
      }
    }
    console.log('\nDone.');
    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
})();
