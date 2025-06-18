import React, { useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Home, TrendingUp, BarChart3, Users, User, X } from 'lucide-react';
import NavLink from './NavLink';

interface MobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function MobileMenu({ isOpen, onToggle }: MobileMenuProps) {
  const { user, signOut } = useAuth();

  // Handle body scroll prevention
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  // Close menu on escape key
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      onToggle();
    }
  }, [isOpen, onToggle]);

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handleEscape]);

  const handleSignOut = async () => {
    await signOut();
    onToggle();
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onToggle();
    }
  };

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={onToggle}
        className="relative z-[120] w-10 h-10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <div className="flex flex-col justify-between w-6 h-5 transform transition-all duration-300 ease-in-out">
          <span className={`bg-white h-0.5 w-full transform transition-all duration-300 ease-in-out origin-left ${
            isOpen ? 'rotate-45 translate-y-0.5' : ''
          }`} />
          <span className={`bg-white h-0.5 w-full transform transition-all duration-300 ease-in-out ${
            isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
          }`} />
          <span className={`bg-white h-0.5 w-full transform transition-all duration-300 ease-in-out origin-left ${
            isOpen ? '-rotate-45 -translate-y-0.5' : ''
          }`} />
        </div>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[110] bg-black/60 bg-black backdrop-blur-md"
          onClick={handleBackdropClick}
          aria-hidden="true"
          style={{
            background: 'linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.7) 100%)'
          }}
        />
      )}

      {/* Mobile Menu Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 backdrop-blur-lg border-l border-gray-700/50 shadow-2xl z-[115] transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50 bg-gray-800/30">
          <h2 id="mobile-menu-title" className="text-lg font-semibold text-white">Menu</h2>
          <button
            onClick={onToggle}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Menu Content */}
        <div className="flex flex-col p-6 space-y-1 bg-gray-900/20">
          {/* Navigation Links */}
          <div className="space-y-2">
            <NavLink 
              to="/" 
              onClick={onToggle} 
              icon={Home}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800/70 active:bg-gray-700 transition-all duration-200 text-base font-medium border border-transparent hover:border-gray-600/30"
            >
              Home
            </NavLink>
            <NavLink 
              to="/plans" 
              onClick={onToggle} 
              icon={TrendingUp}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800/70 active:bg-gray-700 transition-all duration-200 text-base font-medium border border-transparent hover:border-gray-600/30"
            >
              Plans
            </NavLink>
            {user && (
              <>
                <NavLink 
                  to="/dashboard" 
                  onClick={onToggle} 
                  icon={BarChart3}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800/70 active:bg-gray-700 transition-all duration-200 text-base font-medium border border-transparent hover:border-gray-600/30"
                >
                  Dashboard
                </NavLink>
                <NavLink 
                  to="/referral" 
                  onClick={onToggle} 
                  icon={Users}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800/70 active:bg-gray-700 transition-all duration-200 text-base font-medium border border-transparent hover:border-gray-600/30"
                >
                  Referral
                </NavLink>
                <NavLink 
                  to="/account" 
                  onClick={onToggle} 
                  icon={User}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800/70 active:bg-gray-700 transition-all duration-200 text-base font-medium border border-transparent hover:border-gray-600/30"
                >
                  Account
                </NavLink>
              </>
            )}
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-gray-700/50" />

          {/* Auth Section */}
          <div className="space-y-3 bg-gray-800/30 p-4 rounded-xl border border-gray-700/30">
            {user ? (
              <>
                <div className="px-4 py-2 text-sm text-gray-400 bg-gray-700/30 rounded-lg">
                  Signed in as <span className="text-gray-200 font-medium">{user.displayName || user.email}</span>
                </div>
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/20 active:bg-red-500/30 transition-all duration-200 text-base font-medium border border-red-500/20 hover:border-red-500/40"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <NavLink 
                to="/signin" 
                onClick={onToggle}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white transition-all duration-200 text-base font-medium justify-center border border-blue-500/30 hover:border-blue-400/50"
              >
                Sign In
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}