import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface BankAccountDetails {
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
}

export interface UserProfile {
  userId: string;
  displayName: string;
  email: string;
  bankAccount?: BankAccountDetails;
  createdAt: any;
  updatedAt: any;
}

export const userProfileService = {
  // Create or update user profile with bank account details
  async saveUserProfile(userId: string, email: string, data: {
    displayName: string;
    bankAccount?: BankAccountDetails;
  }): Promise<void> {
    const userProfileRef = doc(db, 'userProfiles', userId);
    
    try {
      // Check if profile exists
      const existingProfile = await getDoc(userProfileRef);
      
      if (existingProfile.exists()) {
        // Update existing profile
        await updateDoc(userProfileRef, {
          displayName: data.displayName,
          ...(data.bankAccount && { bankAccount: data.bankAccount }),
          updatedAt: serverTimestamp()
        });
      } else {
        // Create new profile
        const profileData: Omit<UserProfile, 'userId'> = {
          displayName: data.displayName,
          email,
          ...(data.bankAccount && { bankAccount: data.bankAccount }),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        await setDoc(userProfileRef, profileData);
      }
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw new Error('Failed to save user profile');
    }
  },

  // Get user profile including bank account details
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userProfileRef = doc(db, 'userProfiles', userId);
      const profileDoc = await getDoc(userProfileRef);
      
      if (profileDoc.exists()) {
        return {
          userId,
          ...profileDoc.data()
        } as UserProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw new Error('Failed to get user profile');
    }
  },

  // Update only bank account details
  async updateBankAccountDetails(userId: string, bankAccount: BankAccountDetails): Promise<void> {
    try {
      const userProfileRef = doc(db, 'userProfiles', userId);
      await updateDoc(userProfileRef, {
        bankAccount,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating bank account details:', error);
      throw new Error('Failed to update bank account details');
    }
  },

  // Get only bank account details
  async getBankAccountDetails(userId: string): Promise<BankAccountDetails | null> {
    try {
      const profile = await this.getUserProfile(userId);
      return profile?.bankAccount || null;
    } catch (error) {
      console.error('Error getting bank account details:', error);
      throw new Error('Failed to get bank account details');
    }
  }
};