import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User } from 'lucide-react';

export default function ProfileForm() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.displayName || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ displayName: name });
      setSuccess(true);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      setSuccess(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-700">
      <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
      
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
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={user?.email || ''}
            className="w-full bg-gray-700 rounded-lg px-4 py-2 text-gray-300"
            disabled
          />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
            Display Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your display name"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}