import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Calendar, DollarSign, AlertCircle, Infinity } from 'lucide-react';
import { InvestmentPlan } from '../../types/investment';
import { formatCurrency } from '../../utils/formatters';
import { useInvestments } from '../../context/InvestmentContext';

interface InvestmentCardProps extends InvestmentPlan {}

export default function InvestmentCard({
  level,
  amount,
  dailyReturns,
  duration,
  totalReturn,
  image,
  name,
  description,
  purchaseLimit
}: InvestmentCardProps) {
  const { investments } = useInvestments();
  
  // Count how many times this plan has been purchased
  const purchaseCount = investments.filter(inv => inv.planLevel === level).length;
  
  // Check if the plan can still be purchased
  const canPurchase = purchaseLimit === 0 || purchaseCount < purchaseLimit;
  
  // Check if this is the premium plan
  const isPremium = purchaseLimit === 0;

  return (
    <div className={`bg-gray-900 rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 border ${
      isPremium 
        ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
        : 'border-gray-800 hover:border-blue-500'
    }`}>
      {isPremium && (
        <div className="bg-blue-500 text-white text-center py-2 font-semibold">
          UNLIMITED PURCHASES
        </div>
      )}
      <div className="relative h-48">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <h3 className="text-2xl font-bold text-white">{name}</h3>
          <p className="text-gray-300 text-sm">{description}</p>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <span className="text-4xl font-bold text-white">{formatCurrency(amount)}</span>
          <span className="text-gray-400 ml-2">/one-time</span>
        </div>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-3">
            <DollarSign className="h-5 w-5 text-green-500" />
            <span className="text-gray-300">{formatCurrency(dailyReturns)} daily returns</span>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-blue-500" />
            <span className="text-gray-300">{duration} days duration</span>
          </div>
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            <span className="text-gray-300">Total return: {formatCurrency(totalReturn)}</span>
          </div>
          {purchaseLimit > 0 ? (
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <span className="text-gray-300">
                {purchaseCount}/{purchaseLimit} purchases used
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Infinity className="h-5 w-5 text-blue-500" />
              <span className="text-blue-400 font-semibold">
                Unlimited investment potential
              </span>
            </div>
          )}
        </div>
        
        <Link 
          to={canPurchase ? `/plan/${level}` : '#'}
          className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 ${
            isPremium
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : canPurchase
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-700 cursor-not-allowed text-gray-300'
          }`}
          onClick={e => !canPurchase && e.preventDefault()}
        >
          <span>{canPurchase ? 'View Details' : 'Purchase Limit Reached'}</span>
        </Link>
      </div>
    </div>
  );
}