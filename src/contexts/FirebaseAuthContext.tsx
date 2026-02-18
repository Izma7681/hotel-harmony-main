import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import { User } from '@/types/firebase';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isReceptionist: boolean;
  isCustomer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          console.log('Auth state changed, user logged in:', firebaseUser.uid);
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            console.log('User data loaded:', userData);
            setUser({ ...userData, id: firebaseUser.uid });
            
            // Auto-redirect based on role
            const currentPath = window.location.pathname;
            if (currentPath === '/login' || currentPath === '/') {
              if (userData.role === 'admin') {
                console.log('Redirecting to admin dashboard');
                window.location.href = '/admin/dashboard';
              } else if (userData.role === 'receptionist') {
                console.log('Redirecting to receptionist dashboard');
                window.location.href = '/receptionist/dashboard';
              } else if (userData.role === 'customer') {
                console.log('Redirecting to customer dashboard');
                window.location.href = '/customer/dashboard';
              }
            }
          } else {
            console.error('User document not found for UID:', firebaseUser.uid);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
        setFirebaseUser(firebaseUser);
      } else {
        console.log('Auth state changed, user logged out');
        setUser(null);
        setFirebaseUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Attempting to sign in with email:', email);
      
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Firebase Authentication successful, UID:', result.user.uid);
      
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      console.log('Firestore document exists:', userDoc.exists());
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        console.log('User data:', userData);
        setUser({ ...userData, id: result.user.uid });
        return { error: null };
      } else {
        console.error('User document not found in Firestore for UID:', result.user.uid);
        await firebaseSignOut(auth);
        return { error: new Error('User data not found in database. Please contact admin.') };
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      return { error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setFirebaseUser(null);
  };

  const value = {
    user,
    firebaseUser,
    loading,
    signIn,
    signOut,
    isAdmin: user?.role === 'admin',
    isReceptionist: user?.role === 'receptionist',
    isCustomer: user?.role === 'customer',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
