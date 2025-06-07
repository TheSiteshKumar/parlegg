import React from 'react';
import { Clock, CheckCircle, User, Gift, ArrowRight, Target } from 'lucide-react';
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

  const getNextStepMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Waiting for plan purchase to earn rewards';
      case 'plan_purchased':
        return 'Rewards have been credited to your earnings wallet';
      default:
        return '';
    }
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
                className="p-4 bg-gray-900/50 rounded-xl hover:bg-gray-900/70 transition-colors border border-gray-700/30"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{referral.refereeName}</h4>
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

                {/* Reward Information */}
                {referral.status === 'plan_purchased' && referral.referrerReward && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Gift className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-400">Reward Earned</span>
                      </div>
                      <span className="text-lg font-bold text-green-500">
                        {formatCurrency(referral.referrerReward)}
                      </span>
                    </div>
                    <p className="text-xs text-green-400 mt-1">
                      From {referral.refereeName}'s {formatCurrency(parseInt(referral.planPurchased || '0'))} plan purchase
                    </p>
                  </div>
                )}

                {/* Next Steps */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {referral.status === 'pending' ? (
                      <Target className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    <span className="text-sm text-gray-400">
                      {getNextStepMessage(referral.status)}
                    </span>
                  </div>
                  
                  {referral.status === 'pending' && (
                    <div className="flex items-center gap-1 text-xs text-blue-400">
                      <span>Encourage them to invest</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  )}
                </div>

                {/* Progress Indicator for Pending */}
                {referral.status === 'pending' && (
                  <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium text-yellow-400">Next Step Required</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {referral.refereeName} needs to purchase an investment plan for both of you to earn rewards.
                    </p>
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