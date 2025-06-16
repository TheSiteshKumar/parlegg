import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInvestments } from '../context/InvestmentContext';
import { TrendingUp, Calendar, DollarSign, ChevronRight, Users } from 'lucide-react';
import ReturnHistoryPopup from './ReturnHistoryPopup';
import WalletSection from './wallet/WalletSection';
import { Investment } from '../types/investment';
import { earningsService } from '../services/earnings.service';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function Dashboard() {
  const { investments } = useInvestments();
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);

  const calculateTotalInvestment = () => {
    return investments.reduce((total, inv) => total + inv.amount, 0);
  };

  const calculateTotalReturns = () => {
    return investments.reduce((total, inv) => total + inv.totalReturn, 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-1">Investment Dashboard</h2>
          <p className="text-gray-400">Track your investments, earnings, and referral rewards</p>
        </div>
        <Link 
          to="/referral"
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
        >
          <Users className="h-5 w-5" />
          Referral Program
        </Link>
      </div>

      <div className="space-y-10">
        {/* Wallets Section */}
        <WalletSection />

        {/* Investment Overview */}
        <div>
          <h3 className="text-xl font-bold mb-6">Investment Overview</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="h-6 w-6 text-blue-500" />
                <span className="text-sm text-gray-400">Total Invested</span>
              </div>
              <p className="text-2xl font-bold">{formatCurrency(calculateTotalInvestment())}</p>
              <p className="text-sm text-gray-400 mt-1">Across {investments.length} plans</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-6 w-6 text-green-500" />
                <span className="text-sm text-gray-400">Expected Returns</span>
              </div>
              <p className="text-2xl font-bold">{formatCurrency(calculateTotalReturns())}</p>
              <p className="text-sm text-gray-400 mt-1">Total projected earnings</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="h-6 w-6 text-purple-500" />
                <span className="text-sm text-gray-400">Active Investments</span>
              </div>
              <p className="text-2xl font-bold">{investments.length}</p>
              <p className="text-sm text-gray-400 mt-1">Currently earning returns</p>
            </div>
          </div>
        </div>

        {/* Active Investment Plans */}
        <div>
          <h3 className="text-xl font-bold mb-6">Active Investment Plans</h3>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Plan Details</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Investment Date</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Amount</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Daily Returns</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Earned So Far</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Progress</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {investments.map((investment, index) => {
                    const status = earningsService.getInvestmentStatus(investment);
                    const elapsedDays = investment.duration - status.remainingDays;
                    const earnedSoFar = investment.dailyReturns * elapsedDays;
                    
                    return (
                      <tr key={index} className="border-t border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={investment.image} 
                              alt={investment.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-semibold">{investment.name}</p>
                              <p className="text-sm text-gray-400">Level {investment.planLevel}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="text-sm">{formatDate(investment.investmentDate)}</p>
                            <p className="text-xs text-gray-400">Ends {formatDate(investment.endDate)}</p>
                          </div>
                        </td>
                        <td className="p-4 font-semibold">{formatCurrency(investment.amount)}</td>
                        <td className="p-4 text-green-500 font-semibold">{formatCurrency(investment.dailyReturns)}</td>
                        <td className="p-4">
                          <div>
                            <p className="text-green-500 font-semibold">{formatCurrency(earnedSoFar)}</p>
                            <p className="text-xs text-gray-400">{elapsedDays} days × {formatCurrency(investment.dailyReturns)}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-700 rounded-full h-2 min-w-[80px]">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${status.progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-400 whitespace-nowrap min-w-[60px]">
                              {status.progress === 100 ? 'Complete' : `${status.remainingDays} days left`}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => setSelectedInvestment(investment)}
                            className="flex items-center text-blue-400 hover:text-blue-300 transition-colors text-sm"
                          >
                            View History
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {investments.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-400">
                        <div className="flex flex-col items-center gap-3">
                          <TrendingUp className="h-12 w-12 text-gray-600" />
                          <div>
                            <p className="font-semibold mb-1">No active investments yet</p>
                            <p className="text-sm">Start investing to see your portfolio here</p>
                          </div>
                          <Link 
                            to="/plans" 
                            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                          >
                            View Investment Plans
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {selectedInvestment && (
        <ReturnHistoryPopup
          investment={selectedInvestment}
          onClose={() => setSelectedInvestment(null)}
        />
      )}
    </div>
  );
}