import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export default function NavLink({ to, children, onClick }: NavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`hover:text-blue-400 transition-colors ${
        isActive ? 'text-blue-400' : 'text-gray-300'
      }`}
    >
      {children}
    </Link>
  );
}