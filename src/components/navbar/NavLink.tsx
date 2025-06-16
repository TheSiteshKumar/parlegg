import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  onClick?: () => void;
}

export default function NavLink({ to, children, icon: Icon, onClick }: NavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
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