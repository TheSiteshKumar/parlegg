import React from 'react';
import { TrendingUp, Shield, Clock } from 'lucide-react';

export default function Hero() {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-6">
          Invest Smart, Grow Faster
        </h1>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Choose from our carefully crafted investment plans and start your journey towards financial freedom today.
        </p>
        
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
      </div>
    </div>
  );
}