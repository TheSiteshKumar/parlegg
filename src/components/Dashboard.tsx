import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInvestments } from '../context/InvestmentContext';
import { TrendingUp, Calendar, DollarSign, ChevronRight, Users, Wallet as WalletIcon } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-6 py-24">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-12 gap-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Investment Dashboard</h2>
          <p className="text-gray-400">Track your investments, earnings, and referral rewards</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link 
            to="/referral"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            <Users className="h-5 w-5" />
            Referral Program
          </Link>
          <Link 
            to="/withdrawals"
            className="flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all border border-gray-700"
          >
            <WalletIcon className="h-5 w-5" />
            Withdrawal History
          </Link>
        </div>
      </div>

      <div className="space-y-16">
        {/* Wallets Section */}
        <WalletSection />

        {/* Overview Stats */}
        <div>
          <h3 className="text-2xl font-bold mb-8">Investment Overview</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 backdrop-blur-sm p-8 rounded-2xl border border-blue-500/20">
              <div className="flex items-center gap-3 mb-6">
                <DollarSign className="h-8 w-8 text-blue-500" />
                <h3 className="text-lg text-gray-300">Total Invested</h3>
              </div>
              <p className="text-3xl font-bold text-blue-400">{formatCurrency(calculateTotalInvestment())}</p>
              <p className="text-sm text-gray-400 mt-2">Across {investments.length} plans</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-900/20 to-green-800/20 backdrop-blur-sm p-8 rounded-2xl border border-green-500/20">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <h3 className="text-lg text-gray-300">Expected Returns</h3>
              </div>
              <p className="text-3xl font-bold text-green-400">{formatCurrency(calculateTotalReturns())}</p>
              <p className="text-sm text-gray-400 mt-2">Total projected earnings</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/20">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="h-8 w-8 text-purple-500" />
                <h3 className="text-lg text-gray-300">Active Investments</h3>
              </div>
              <p className="text-3xl font-bold text-purple-400">{investments.length}</p>
              <p className="text-sm text-gray-400 mt-2">Currently earning returns</p>
            </div>
          </div>
        </div>

        {/* Active Investments Table */}
        <div>
          <h3 className="text-2xl font-bold mb-8">Active Investment Plans</h3>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="text-left p-6 font-semibold">Plan Details</th>
                    <th className="text-left p-6 font-semibold">Investment Date</th>
                    <th className="text-left p-6 font-semibold">Amount</th>
                    <th className="text-left p-6 font-semibold">Daily Returns</th>
                    <th className="text-left p-6 font-semibold">Earned So Far</th>
                    <th className="text-left p-6 font-semibold">Progress</th>
                    <th className="text-left p-6 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {investments.map((investment, index) => {
                    const status = earningsService.getInvestmentStatus(investment);
                    return (
                      <tr key={index} className="border-t border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <img 
                              src={investment.image} 
                              alt={investment.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-semibold">{investment.name}</p>
                              <p className="text-sm text-gray-400">Level {investment.planLevel}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <p className="font-medium">{formatDate(investment.investmentDate)}</p>
                          <p className="text-sm text-gray-400">Ends {formatDate(investment.endDate)}</p>
                        </td>
                        <td className="p-6">
                          <p className="font-semibold">{formatCurrency(investment.amount)}</p>
                        </td>
                        <td className="p-6">
                          <p className="text-green-500 font-semibold">{formatCurrency(investment.dailyReturns)}</p>
                        </td>
                        <td className="p-6">
                          <p className="text-green-500 font-bold">{formatCurrency(status.totalEarnedToDate)}</p>
                          <p className="text-xs text-gray-400">{status.daysElapsed} days × {formatCurrency(investment.dailyReturns)}</p>
                        </td>
                        <td className="p-6">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-400">{Math.round(status.progress)}% complete</span>
                              <span className="text-sm text-gray-400">{status.remainingDays} days left</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${status.progress}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <button
                            onClick={() => setSelectedInvestment(investment)}
                            className="flex items-center text-blue-400 hover:text-blue-300 transition-colors font-medium"
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
                      <td colSpan={7} className="p-12 text-center">
                        <div className="text-gray-400">
                          <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <h3 className="text-lg font-semibold mb-2">No Active Investments</h3>
                          <p className="mb-4">Start your investment journey today</p>
                          <Link 
                            to="/plans"
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
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