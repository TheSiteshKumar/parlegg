import React from 'react';
import { Wallet } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Wallet className="h-12 w-12 text-blue-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
          <p className="text-gray-400">Secure investment platform for your future</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-700">
          {children}
        </div>
      </div>
    </div>
  );
}