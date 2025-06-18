import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, CreditCard, Building, Save, Edit3 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { userProfileService, BankAccountDetails } from '../services/userProfile.service';

export default function AccountPage() {
  const { user, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load existing user profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return;
      
      try {
        const profile = await userProfileService.getUserProfile(user.uid);
        if (profile?.bankAccount) {
          setAccountNumber(profile.bankAccount.accountNumber || '');
          setIfscCode(profile.bankAccount.ifscCode || '');
          setAccountHolderName(profile.bankAccount.accountHolderName || '');
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    setError('');
    
    try {
      // Validate required fields
      if (!displayName.trim()) {
        setError('Display name is required');
        return;
      }
      
      // Update Firebase Auth profile
      await updateProfile({ displayName });
      
      // Save bank account details to Firestore (only if provided)
      let bankAccount: BankAccountDetails | undefined;
      
      if (accountNumber.trim() || ifscCode.trim() || accountHolderName.trim()) {
        // If any bank field is provided, validate all are provided
        if (!accountNumber.trim() || !ifscCode.trim() || !accountHolderName.trim()) {
          setError('Please fill all bank account fields or leave them all empty');
          return;
        }
        
        // Basic IFSC validation (should be 11 characters)
        if (ifscCode.trim().length !== 11) {
          setError('IFSC code should be 11 characters long');
          return;
        }
        
        bankAccount = {
          accountNumber: accountNumber.trim(),
          ifscCode: ifscCode.trim(),
          accountHolderName: accountHolderName.trim()
        };
      }
      
      await userProfileService.saveUserProfile(user.uid, user.email || '', {
        displayName,
        ...(bankAccount && { bankAccount })
      });
      
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      setSuccess(false);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link 
            to="/dashboard" 
            className="flex items-center text-blue-400 hover:text-blue-500 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-2">Account Settings</h1>
          <p className="text-gray-400">Manage your profile and bank account details</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-colors"
        >
          <Edit3 className="h-4 w-4" />
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8">
            <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4 mb-6">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-500/10 border border-green-500 text-green-500 rounded-lg p-4 mb-6">
                Profile updated successfully!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={user?.email || ''}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-300 cursor-not-allowed"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-400 mb-2">
                  Display Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className={`w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white ${
                      !isEditing ? 'cursor-not-allowed opacity-60' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    }`}
                    placeholder="Enter your display name"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="accountHolderName" className="block text-sm font-medium text-gray-400 mb-2">
                  Account Holder Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="accountHolderName"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                    className={`w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white ${
                      !isEditing ? 'cursor-not-allowed opacity-60' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    }`}
                    placeholder="Enter account holder name"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-400 mb-2">
                  Bank Account Number
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="accountNumber"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className={`w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white ${
                      !isEditing ? 'cursor-not-allowed opacity-60' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    }`}
                    placeholder="Enter bank account number"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-400 mb-2">
                  IFSC Code
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="ifscCode"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                    className={`w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white ${
                      !isEditing ? 'cursor-not-allowed opacity-60' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    }`}
                    placeholder="Enter IFSC code"
                    disabled={!isEditing}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Bank details will be used for withdrawals</p>
              </div>

              {isEditing && (
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-5 w-5" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Account Summary */}
        <div className="space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
            <h3 className="text-lg font-semibold mb-4">Account Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Member Since</span>
                <span className="text-white">
                  {user?.metadata?.creationTime ? 
                    new Date(user.metadata.creationTime).toLocaleDateString() : 
                    'N/A'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Account Status</span>
                <span className="text-green-500 font-semibold">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email Verified</span>
                <span className={user?.emailVerified ? 'text-green-500' : 'text-yellow-500'}>
                  {user?.emailVerified ? 'Yes' : 'Pending'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}