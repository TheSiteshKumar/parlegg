import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  onClick?: () => void;
  className?: string;
}

export default function NavLink({ to, children, icon: Icon, onClick, className }: NavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  // If custom className is provided, use it (for mobile menu)
  if (className) {
    return (
      <Link 
        to={to} 
        onClick={onClick}
        className={`${className} ${isActive ? 'bg-blue-600/30 text-blue-400 border-blue-500/50 shadow-lg shadow-blue-500/10' : ''}`}
      >
        {Icon && <Icon className="h-5 w-5" />}
        {children}
      </Link>
    );
  }
  
  // Default styling for desktop navbar
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`flex items-center gap-2 hover:text-blue-400 transition-colors ${
        isActive ? 'text-blue-400' : 'text-gray-300'
      }`}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </Link>
  );
}