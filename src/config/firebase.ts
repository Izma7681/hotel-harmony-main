import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// ⚠️ IMPORTANT: Get your actual Firebase config from Firebase Console
// 1. Go to: https://console.firebase.google.com/
// 2. Select project: hotel-system-70a44
// 3. Click gear icon → Project settings
// 4. Scroll to "Your apps" → Web app
// 5. Copy the firebaseConfig object
// 6. Replace the config below with your actual config
// 
// If you see "api-key-not-valid" error, you need to update this config!
// See: FIX_API_KEY_ERROR.md for detailed instructions

const firebaseConfig = {
  apiKey: "AIzaSyD6yZq7hZ_eftIAzD9tRDkgR65yoQrhN-g",
  authDomain: "hotel-system-70a44.firebaseapp.com",
  projectId: "hotel-system-70a44",
  storageBucket: "hotel-system-70a44.firebasestorage.app",
  messagingSenderId: "364905636210",
  appId: "1:364905636210:web:bd6ec98ab7ce3f9d563deb",
  measurementId: "G-DWRX6E6T2I"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
