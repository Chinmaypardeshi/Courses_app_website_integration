import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile 
} from "firebase/auth";

// Environment Variables ya Firebase Console se aapki Production Config Keys
const firebaseConfig = {
  apiKey: "AIzaSyADy8LkFU9u4iHSm-tpCAfVo_Vc2cA4aY8",
  authDomain: "upsc-edtech-portal.firebaseapp.com",
  projectId: "upsc-edtech-portal",
  storageBucket: "upsc-edtech-portal.firebasestorage.app",
  messagingSenderId: "278130345719",
  appId: "1:278130345719:web:603ebfaa0d1110656df5f2",
  measurementId: "G-S2Y5HYLEYT"
};

// Firebase App Initialize karein
const app = initializeApp(firebaseConfig);

// Authentication Services Instance
export const auth = getAuth(app);

// Google Auth Provider (Prompt to select account every time)
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Authentication Methods Export
export { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile 
};

export default app;