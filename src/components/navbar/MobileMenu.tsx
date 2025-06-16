import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Home, TrendingUp, BarChart3, Users, User } from 'lucide-react';
import NavLink from './NavLink';

interface MobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function MobileMenu({ isOpen, onToggle }: MobileMenuProps) {
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    await signOut();
    onToggle();
  };

  return (
    <div className="md:hidden">
      <button
        onClick={onToggle}
        className="relative z-[100] w-10 h-10 flex items-center justify-center"
        aria-label="Toggle menu"
      >
        <div className="flex flex-col justify-between w-6 h-5 transform transition-all duration-300">
          <span className={`bg-white h-0.5 w-full transform transition-all duration-300 origin-left ${isOpen ? 'rotate-45 translate-x-px' : ''}`} />
          <span className={`bg-white h-0.5 w-full transform transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
          <span className={`bg-white h-0.5 w-full transform transition-all duration-300 origin-left ${isOpen ? '-rotate-45 translate-x-px' : ''}`} />
        </div>
      </button>

      <div 
        className={`fixed inset-0 bg-gray-900/95 backdrop-blur-sm z-[90] transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8 text-2xl">
          <NavLink to="/" onClick={onToggle} icon={Home}>Home</NavLink>
          <NavLink to="/plans" onClick={onToggle} icon={TrendingUp}>Plans</NavLink>
          {user && <NavLink to="/dashboard" onClick={onToggle} icon={BarChart3}>Dashboard</NavLink>}
          {user && <NavLink to="/referral" onClick={onToggle} icon={Users}>Referral</NavLink>}
          {user && <NavLink to="/account" onClick={onToggle} icon={User}>Account</NavLink>}
          {user ? (
            <button 
              onClick={handleSignOut}
              className="text-gray-300 hover:text-white transition-colors text-2xl"
            >
              Sign Out
            </button>
          ) : (
            <NavLink to="/signin" onClick={onToggle}>Sign In</NavLink>
          )}
        </div>
      </div>
    </div>
  );
}