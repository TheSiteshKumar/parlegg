import { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../config/firebase';
import { authService } from '../services/auth.service';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    return authService.signIn(email, password);
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    return authService.signUp(email, password, displayName);
  }, []);

  const signOut = useCallback(async () => {
    return authService.signOut();
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    return authService.resetPassword(email);
  }, []);

  const updateProfile = useCallback(async (data: { displayName?: string; photoURL?: string }) => {
    if (!user) throw new Error('No user logged in');
    return authService.updateUserProfile(user, data);
  }, [user]);

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile
  };
}