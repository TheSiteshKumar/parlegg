import React from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { InvestmentPlan } from '../types/investment';

export default function InvestmentCard({
  level,
  amount,
  dailyReturns,
  duration,
  totalReturn,
}: InvestmentPlan) {
  return (
    <div className="bg-gray-900 rounded-2xl p-6 transform hover:scale-105 transition-all duration-300 border border-gray-800 hover:border-blue-500">
      <h3 className="text-2xl font-bold text-blue-500 mb-4">Level {level}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold text-white">₹{amount}</span>
        <span className="text-gray-400 ml-2">/one-time</span>
      </div>
      
      <div className="space-y-4 mb-8">
        <div className="flex items-center space-x-3">
          <Check className="h-5 w-5 text-green-500" />
          <span className="text-gray-300">₹{dailyReturns} daily returns</span>
        </div>
        <div className="flex items-center space-x-3">
          <Check className="h-5 w-5 text-green-500" />
          <span className="text-gray-300">{duration} days duration</span>
        </div>
        <div className="flex items-center space-x-3">
          <Check className="h-5 w-5 text-green-500" />
          <span className="text-gray-300">Total return: ₹{totalReturn}</span>
        </div>
      </div>
      
      <Link 
        to={`/plan/${level}`}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
      >
        <span>View Details</span>
      </Link>
    </div>
  );
}