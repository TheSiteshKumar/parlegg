import React from 'react';
import { Clock, CheckCircle, User, Gift, ExternalLink } from 'lucide-react';
import { useReferral } from '../../context/ReferralContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function ReferralList() {
  const { referrals, loading } = useReferral();

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border-b border-gray-700 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-700 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-6 bg-gray-700 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2";
    
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-500/10 text-yellow-500 border border-yellow-500`;
      case 'plan_purchased':
        return `${baseClasses} bg-green-500/10 text-green-500 border border-green-500`;
      default:
        return `${baseClasses} bg-gray-500/10 text-gray-500 border border-gray-500`;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'plan_purchased':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending Purchase';
      case 'plan_purchased':
        return 'Plan Purchased';
      default:
        return status;
    }
  };

  const getEncouragementMessage = (referral: any) => {
    if (referral.status === 'pending') {
      return `${referral.refereeName} needs to purchase an investment plan for both of you to earn rewards.`;
    }
    return null;
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <User className="h-6 w-6 text-blue-500" />
          <h3 className="text-xl font-semibold">Your Referrals</h3>
        </div>
      </div>

      <div className="p-6">
        {referrals.length === 0 ? (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Referrals Yet</h3>
            <p className="text-gray-400">Share your referral code to start earning rewards!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {referrals.map((referral) => (
              <div 
                key={referral.id}
                className="bg-gray-900/50 rounded-xl p-4 hover:bg-gray-900/70 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{referral.refereeName}</h4>
                      <p className="text-sm text-gray-400">{referral.refereeEmail}</p>
                      <p className="text-xs text-gray-500">Joined {formatDate(referral.createdAt)}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={getStatusBadge(referral.status)}>
                      {getStatusIcon(referral.status)}
                      {getStatusText(referral.status)}
                    </div>
                  </div>
                </div>

                {/* Plan Purchase Info */}
                {referral.status === 'plan_purchased' && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-400 font-semibold">Plan Purchased: Level {referral.planPurchased}</p>
                        <p className="text-sm text-gray-400">
                          Amount: {formatCurrency(referral.planAmount || 0)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-green-500">
                          <Gift className="h-4 w-4" />
                          <span className="text-sm font-semibold">
                            You earned: {formatCurrency(referral.referrerReward || 0)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">
                          They earned: {formatCurrency(referral.refereeReward || 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Encouragement Message */}
                {referral.status === 'pending' && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-yellow-400 text-sm mb-2">
                          <Clock className="h-4 w-4 inline mr-1" />
                          Next Step Required
                        </p>
                        <p className="text-gray-300 text-sm">
                          {getEncouragementMessage(referral)}
                        </p>
                      </div>
                      <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm">
                        Encourage them to invest
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Waiting Message */}
                {referral.status === 'pending' && (
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>Waiting for plan purchase to earn rewards</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}