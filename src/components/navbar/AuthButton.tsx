import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogOut } from 'lucide-react';

export default function AuthButton() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  if (!user) {
    return (
      <Link
        to="/signin"
        className="bg-blue-600 px-4 py-1 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Sign In
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        to="/profile"
        className="text-gray-300 hover:text-white transition-colors"
      >
        {user.displayName || 'Profile'}
      </Link>
      <button
        onClick={handleSignOut}
        className="flex items-center gap-2 bg-gray-800 px-4 py-1 rounded-lg hover:bg-gray-700 transition-colors"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>
    </div>
  );
}