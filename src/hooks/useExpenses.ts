import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Expense } from '@/types/firebase';
import { useAuth } from '@/contexts/FirebaseAuthContext';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchExpenses = async () => {
    try {
      const q = query(collection(db, 'expenses'), orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => {
        const expense = doc.data();
        return {
          id: doc.id,
          ...expense,
          date: expense.date.toDate(),
          createdAt: expense.createdAt.toDate()
        } as Expense;
      });
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const addExpense = async (data: Omit<Expense, 'id' | 'createdAt' | 'createdBy'>) => {
    try {
      await addDoc(collection(db, 'expenses'), {
        ...data,
        createdBy: user?.id,
        createdAt: new Date()
      });
      await fetchExpenses();
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  };

  const updateExpense = async (id: string, data: Partial<Expense>) => {
    try {
      await updateDoc(doc(db, 'expenses', id), {
        ...data
      });
      await fetchExpenses();
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'expenses', id));
      await fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  };

  return { expenses, loading, addExpense, updateExpense, deleteExpense, refetch: fetchExpenses };
}
