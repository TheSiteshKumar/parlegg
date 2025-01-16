import React from 'react';
import { TrendingUp, Shield, Clock } from 'lucide-react';

export default function Features() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
      <div className="p-6 bg-gray-800 rounded-xl">
        <TrendingUp className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">High Returns</h3>
        <p className="text-gray-400">Earn competitive daily returns on your investments</p>
      </div>
      
      <div className="p-6 bg-gray-800 rounded-xl">
        <Shield className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
        <p className="text-gray-400">Your investments are protected by advanced security</p>
      </div>
      
      <div className="p-6 bg-gray-800 rounded-xl">
        <Clock className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Fixed Duration</h3>
        <p className="text-gray-400">Clear timeline for your investment returns</p>
      </div>
    </div>
  );
}