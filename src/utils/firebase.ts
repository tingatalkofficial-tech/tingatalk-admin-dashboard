// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration (client-side keys — safe to commit)
const firebaseConfig = {
  apiKey: "AIzaSyDGIHRWxDzVCpUhwqiX3ic7a0CP5sUjL3c",
  authDomain: "tingatalk-53057.firebaseapp.com",
  projectId: "tingatalk-53057",
  storageBucket: "tingatalk-53057.firebasestorage.app",
  messagingSenderId: "462676704637",
  appId: "1:462676704637:web:52de781bba225bb88c6014",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;
