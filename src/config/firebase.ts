import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDQJ4sCGRF6EyAT6-b1nq26v_JHeicDPCE",
  authDomain: "britannia-731b1.firebaseapp.com",
  projectId: "britannia-731b1",
  storageBucket: "britannia-731b1.firebasestorage.app",
  messagingSenderId: "31750145606",
  appId: "1:31750145606:web:e75076a3dd28694473ec47",
  measurementId: "G-NBR222J59L"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;