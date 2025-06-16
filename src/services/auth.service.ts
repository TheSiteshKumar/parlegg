import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut,
  User
} from 'firebase/auth';
import { auth } from '../config/firebase';

export const authService = {
  async signUp(email: string, password: string, displayName: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    return userCredential.user;
  },

  async signIn(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  async signOut() {
    await signOut(auth);
  },

  async resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email);
  },

  async updateUserProfile(user: User, data: { displayName?: string; photoURL?: string }) {
    await updateProfile(user, data);
  }
};