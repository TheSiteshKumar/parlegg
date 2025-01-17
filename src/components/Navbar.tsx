import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import NavLink from './navbar/NavLink';
import AuthButton from './navbar/AuthButton';
import MobileMenu from './navbar/MobileMenu';

export default function Navbar() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm text-white py-4 px-6 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center relative">
        <Link to="/" className="flex items-center space-x-2 z-[100]">
          <Wallet className="h-6 w-6 text-blue-500" />
          <span className="text-xl font-bold">PARLEG</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/plans">Plans</NavLink>
          {user && <NavLink to="/dashboard">Dashboard</NavLink>}
          <AuthButton />
        </div>

        <MobileMenu 
          isOpen={isMenuOpen}
          onToggle={() => setIsMenuOpen(!isMenuOpen)}
        />
      </div>
    </nav>
  );
}