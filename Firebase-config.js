import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBV1hAMqHSK-i1vDe1c0YpMzJ1i-b9K5uA",
  authDomain: "family-brain-5ce2f.firebaseapp.com",
  projectId: "family-brain-5ce2f",
  storageBucket: "family-brain-5ce2f.firebasestorage.app",
  messagingSenderId: "72751844190",
  appId: "1:72751844190:web:bfbd121a36964f6539ddcf"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
