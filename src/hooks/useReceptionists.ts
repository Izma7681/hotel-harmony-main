import { useState, useEffect } from 'react';
import { collection, updateDoc, deleteDoc, doc, getDocs, query, where, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '@/config/firebase';
import { User } from '@/types/firebase';
import { useAuth } from '@/contexts/FirebaseAuthContext';

export function useReceptionists() {
  const [receptionists, setReceptionists] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, firebaseUser } = useAuth();

  const fetchReceptionists = async () => {
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'receptionist'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      setReceptionists(data);
    } catch (error) {
      console.error('Error fetching receptionists:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceptionists();
  }, []);

  const addReceptionist = async (data: { name: string; email: string; password: string }) => {
    // Store admin credentials to re-login after creating receptionist
    const adminEmail = firebaseUser?.email;
    
    try {
      console.log('Starting receptionist creation process...');
      console.log('Email:', data.email);
      console.log('Name:', data.name);
      console.log('Admin email:', adminEmail);
      
      // Create user in Firebase Authentication
      console.log('Creating user in Firebase Authentication...');
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      console.log('User created in Authentication with UID:', userCredential.user.uid);
      
      // Prepare user data for Firestore
      const userData = {
        email: data.email,
        name: data.name,
        role: 'receptionist' as const,
        createdAt: new Date(),
        createdBy: user?.id || 'unknown'
      };
      
      console.log('Creating Firestore document with data:', userData);
      
      // Create user document in Firestore with the same UID
      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      
      console.log('Firestore document created successfully');
      console.log('Document ID:', userCredential.user.uid);
      
      // Sign out the newly created receptionist
      console.log('Signing out newly created user...');
      await signOut(auth);
      console.log('Sign out complete');
      
      // Re-authenticate admin user
      // Note: Admin needs to be logged back in manually
      // This is a Firebase limitation - we can't keep admin logged in while creating new user
      
      // Refresh the receptionists list
      await fetchReceptionists();
      
      console.log('Receptionist creation complete!');
      
      // Return success with admin email for re-login
      return { success: true, adminEmail };
    } catch (error: any) {
      console.error('Error adding receptionist:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      throw error;
    }
  };

  const updateReceptionist = async (id: string, data: { name: string; email: string; password?: string }) => {
    try {
      const updateData: any = {
        name: data.name,
        email: data.email
      };
      
      await updateDoc(doc(db, 'users', id), updateData);
      
      // Note: Updating password in Firebase Auth requires re-authentication
      // For security, password updates should be done by the user themselves
      // or through Firebase Admin SDK on the backend
      
      await fetchReceptionists();
    } catch (error) {
      console.error('Error updating receptionist:', error);
      throw error;
    }
  };

  const deleteReceptionist = async (id: string) => {
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'users', id));
      
      // Note: Deleting from Firebase Authentication requires Firebase Admin SDK
      // This should be done on the backend for security
      // For now, we only delete from Firestore
      
      await fetchReceptionists();
    } catch (error) {
      console.error('Error deleting receptionist:', error);
      throw error;
    }
  };

  return { receptionists, loading, addReceptionist, updateReceptionist, deleteReceptionist, refetch: fetchReceptionists };
}
