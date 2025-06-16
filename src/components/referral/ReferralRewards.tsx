import React from 'react';
import { Gift, TrendingUp, Award } from 'lucide-react';
import { useReferral } from '../../context/ReferralContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function ReferralRewards() {
  const { rewards, loading } = useReferral();

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border-b border-gray-700 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-gray-700 rounded"></div>
                  <div>
                    <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-20"></div>
                  </div>
                </div>
                <div className="h-6 bg-gray-700 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'referral':
        return <Gift className="h-5 w-5 text-blue-500" />;
      case 'milestone':
        return <Award className="h-5 w-5 text-purple-500" />;
      default:
        return <TrendingUp className="h-5 w-5 text-green-500" />;
    }
  };

  const getRewardColor = (type: string) => {
    switch (type) {
      case 'referral':
        return 'text-blue-500';
      case 'milestone':
        return 'text-purple-500';
      default:
        return 'text-green-500';
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <Gift className="h-6 w-6 text-green-500" />
          <h3 className="text-xl font-semibold">Reward History</h3>
        </div>
      </div>

      <div className="p-6">
        {rewards.length === 0 ? (
          <div className="text-center py-8">
            <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Rewards Yet</h3>
            <p className="text-gray-400">Start referring friends to earn your first rewards!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {rewards.map((reward) => (
              <div 
                key={reward.id}
                className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-gray-800 rounded-lg flex items-center justify-center">
                    {getRewardIcon(reward.type)}
                  </div>
                  <div>
                    <h4 className="font-semibold">{reward.description}</h4>
                    <p className="text-sm text-gray-400">
                      {formatDate(reward.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-lg font-bold ${getRewardColor(reward.type)}`}>
                    +{formatCurrency(reward.amount)}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    reward.status === 'credited' 
                      ? 'bg-green-500/10 text-green-500' 
                      : 'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    {reward.status === 'credited' ? 'Credited' : 'Pending'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}