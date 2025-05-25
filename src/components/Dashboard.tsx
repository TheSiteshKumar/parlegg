import React, { useState } from 'react';
import { useInvestments } from '../context/InvestmentContext';
import { TrendingUp, Calendar, DollarSign, ChevronRight } from 'lucide-react';
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
      <h2 className="text-3xl font-bold mb-12">Investment Dashboard</h2>

      <div className="space-y-16">
        <WalletSection />

        <div>
          <h3 className="text-2xl font-bold mb-8">Overview</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50">
              <DollarSign className="h-8 w-8 text-blue-500 mb-6" />
              <h3 className="text-lg text-gray-400 mb-2">Total Invested</h3>
              <p className="text-3xl font-bold">{formatCurrency(calculateTotalInvestment())}</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50">
              <TrendingUp className="h-8 w-8 text-green-500 mb-6" />
              <h3 className="text-lg text-gray-400 mb-2">Expected Returns</h3>
              <p className="text-3xl font-bold">{formatCurrency(calculateTotalReturns())}</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50">
              <Calendar className="h-8 w-8 text-purple-500 mb-6" />
              <h3 className="text-lg text-gray-400 mb-2">Active Investments</h3>
              <p className="text-3xl font-bold">{investments.length}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-8">Active Investments</h3>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="text-left p-6">Plan Level</th>
                    <th className="text-left p-6">Investment Date</th>
                    <th className="text-left p-6">End Date</th>
                    <th className="text-left p-6">Amount</th>
                    <th className="text-left p-6">Daily Returns</th>
                    <th className="text-left p-6">Progress</th>
                    <th className="text-left p-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {investments.map((investment, index) => {
                    const status = earningsService.getInvestmentStatus(investment);
                    return (
                      <tr key={index} className="border-t border-gray-700 hover:bg-gray-700/50 transition-colors">
                        <td className="p-6">Level {investment.planLevel}</td>
                        <td className="p-6">{formatDate(investment.investmentDate)}</td>
                        <td className="p-6">{formatDate(investment.endDate)}</td>
                        <td className="p-6">{formatCurrency(investment.amount)}</td>
                        <td className="p-6 text-green-500">{formatCurrency(investment.dailyReturns)}</td>
                        <td className="p-6">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${status.progress}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-400 whitespace-nowrap">
                              {status.remainingDays} days left
                            </span>
                          </div>
                        </td>
                        <td className="p-6">
                          <button
                            onClick={() => setSelectedInvestment(investment)}
                            className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
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
                      <td colSpan={7} className="p-6 text-center text-gray-400">
                        No active investments yet
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