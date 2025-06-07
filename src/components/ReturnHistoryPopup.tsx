import React from 'react';
import { X } from 'lucide-react';
import { Investment } from '../types/investment';
import { earningsService } from '../services/earnings.service';
import { formatCurrency, formatDate } from '../utils/formatters';

interface ReturnHistoryPopupProps {
  investment: Investment;
  onClose: () => void;
}

export default function ReturnHistoryPopup({ investment, onClose }: ReturnHistoryPopupProps) {
  const generateReturnsHistory = () => {
    const returns = [];
    const startDate = new Date(investment.investmentDate);
    const currentDate = new Date();
    let totalEarned = 0;
    
    for (let i = 0; i < investment.duration; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      // Only show returns up to current date
      if (date > currentDate) break;
      
      totalEarned += investment.dailyReturns;
      returns.push({
        date: date.toISOString(),
        dailyReturn: investment.dailyReturns,
        totalEarned,
        dayNumber: i + 1
      });
    }
    
    return returns;
  };

  const status = earningsService.getInvestmentStatus(investment);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h3 className="text-xl font-semibold">
            Returns History - {investment.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="bg-gray-900 p-4 rounded-lg">
              <p className="text-gray-400 mb-1">Investment Amount</p>
              <p className="text-2xl font-bold">{formatCurrency(investment.amount)}</p>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg">
              <p className="text-gray-400 mb-1">Total Earned So Far</p>
              <p className="text-2xl font-bold text-green-500">{formatCurrency(status.totalEarnedToDate)}</p>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-900 sticky top-0">
                <tr>
                  <th className="text-left p-4">Day</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Daily Return</th>
                  <th className="text-left p-4">Total Earned</th>
                </tr>
              </thead>
              <tbody>
                {generateReturnsHistory().map((returnData, index) => (
                  <tr key={index} className="border-t border-gray-700">
                    <td className="p-4 font-semibold">Day {returnData.dayNumber}</td>
                    <td className="p-4">{formatDate(returnData.date)}</td>
                    <td className="p-4 text-green-500">{formatCurrency(returnData.dailyReturn)}</td>
                    <td className="p-4 text-green-500 font-semibold">{formatCurrency(returnData.totalEarned)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}