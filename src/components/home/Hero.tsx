import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

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
        
        <Link 
          to="/signup" 
          className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Start Investing
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}