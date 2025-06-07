import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useInvestments } from '../context/InvestmentContext';
import { useWallet } from '../context/WalletContext';
import { investmentPlans } from '../data/investmentPlans';
import { Check, ArrowLeft } from 'lucide-react';
import InvestmentConfirmModal from './investment/InvestmentConfirmModal';
import { formatCurrency } from '../utils/formatters';

export default function PlanDetails() {
  const { level } = useParams();
  const navigate = useNavigate();
  const { addInvestment, investments } = useInvestments();
  const { invest, balance } = useWallet();
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  const plan = investmentPlans.find((p) => p.level === level);

  if (!plan) {
    return <div>Plan not found</div>;
  }

  // Count existing purchases of this plan
  const purchaseCount = investments.filter(inv => inv.planLevel === level).length;
  const canPurchase = plan.purchaseLimit === 0 || purchaseCount < plan.purchaseLimit;

  const handleInvest = () => {
    if (!canPurchase) {
      setError('Purchase limit reached for this plan');
      return;
    }

    if (balance.investment < plan.amount) {
      setError('Insufficient funds in investment wallet');
      return;
    }
    setError('');
    setShowConfirm(true);
  };

  const confirmInvestment = async () => {
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + plan.duration);

      const investment = {
        planLevel: plan.level,
        investmentDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        amount: plan.amount,
        dailyReturns: plan.dailyReturns,
        totalReturn: plan.totalReturn,
        daysRemaining: plan.duration,
        duration: plan.duration,
        image: plan.image,
        name: plan.name
      };
      
      await addInvestment(investment);
      invest(plan.amount);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create investment. Please try again.');
      console.error('Investment error:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <button 
        onClick={() => navigate('/plans')}
        className="flex items-center text-blue-400 hover:text-blue-500 mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Plans
      </button>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
        <div className="relative h-64">
          <img 
            src={plan.image} 
            alt={plan.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent" />
          <div className="absolute bottom-6 left-8">
            <h2 className="text-3xl font-bold text-white mb-2">{plan.name}</h2>
            <p className="text-gray-300">{plan.description}</p>
          </div>
        </div>
        
        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Investment Details</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-gray-300">One-time investment: {formatCurrency(plan.amount)}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-gray-300">Daily returns: {formatCurrency(plan.dailyReturns)}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-gray-300">Duration: {plan.duration} days</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-gray-300">Total return: {formatCurrency(plan.totalReturn)}</span>
                </div>
                {plan.purchaseLimit > 0 && (
                  <div className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-gray-300">
                      Purchase limit: {purchaseCount}/{plan.purchaseLimit}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-900 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Investment Summary</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Investment Amount</span>
                  <span className="text-white font-semibold">{formatCurrency(plan.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Daily Returns</span>
                  <span className="text-green-500 font-semibold">{formatCurrency(plan.dailyReturns)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Returns</span>
                  <span className="text-green-500 font-semibold">{formatCurrency(plan.totalReturn)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Available Balance</span>
                  <span className="text-white font-semibold">{formatCurrency(balance.investment)}</span>
                </div>
              </div>
              <button
                onClick={handleInvest}
                disabled={!canPurchase}
                className={`w-full py-3 rounded-xl font-semibold ${
                  canPurchase
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-700 text-gray-300 cursor-not-allowed'
                } transition-colors`}
              >
                {canPurchase ? 'Invest Now' : 'Purchase Limit Reached'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <InvestmentConfirmModal
          onConfirm={confirmInvestment}
          onClose={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}