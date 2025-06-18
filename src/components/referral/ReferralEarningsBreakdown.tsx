import React from 'react';
import { TrendingUp, Gift, Award, Wallet } from 'lucide-react';
import { useReferral } from '../../context/ReferralContext';
import { useWallet } from '../../context/WalletContext';
import { formatCurrency } from '../../utils/formatters';
import { MILESTONE_BONUSES } from '../../types/referral';

export default function ReferralEarningsBreakdown() {
  const { stats, loading } = useReferral();
  const { balance } = useWallet();

  if (loading || !stats) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-900/50 p-4 rounded-xl">
                <div className="h-4 bg-gray-700 rounded w-2/3 mb-2"></div>
                <div className="h-6 bg-gray-700 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const completedMilestones = MILESTONE_BONUSES.filter(m => stats.completedReferrals >= m.referrals);
  const totalMilestoneRewards = completedMilestones.reduce((sum, m) => sum + m.bonus, 0);
  const directReferralRewards = (balance.referralEarnings || 0) - totalMilestoneRewards;

  return (
    <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 backdrop-blur-sm p-8 rounded-2xl border border-green-500/20">
      <div className="flex items-center gap-3 mb-6">
        <Wallet className="h-8 w-8 text-green-500" />
        <div>
          <h2 className="text-2xl font-bold">Referral Earnings Breakdown</h2>
          <p className="text-gray-400">Detailed breakdown of your referral program earnings</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Current Session Stats */}
        <div className="space-y-6">
          <div className="bg-gray-900/50 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <Gift className="h-6 w-6 text-purple-500" />
              <h3 className="text-lg font-semibold">Current Session Rewards</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Direct Referral Rewards</span>
                <span className="text-green-400 font-semibold">
                  {formatCurrency(stats.totalRewards - totalMilestoneRewards)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Milestone Bonuses</span>
                <span className="text-purple-400 font-semibold">
                  {formatCurrency(totalMilestoneRewards)}
                </span>
              </div>
              <div className="border-t border-gray-700 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">Session Total</span>
                  <span className="text-blue-400 font-bold text-lg">
                    {formatCurrency(stats.totalRewards)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <Award className="h-6 w-6 text-yellow-500" />
              <h3 className="text-lg font-semibold">Milestone Progress</h3>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Completed Referrals</span>
                <span className="text-green-400 font-semibold">{stats.completedReferrals}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Next Milestone</span>
                <span className="text-yellow-400 font-semibold">{stats.nextMilestone} referrals</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                <div 
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.progressToNext}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - All-time Earnings from DB */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/20 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-6 w-6 text-blue-400" />
              <h3 className="text-lg font-semibold text-blue-400">All-Time Earnings (Database)</h3>
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-400 mb-2">
                  {formatCurrency(balance.referralEarnings || 0)}
                </p>
                <p className="text-blue-300 text-sm">
                  Total earned from referral program
                </p>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">Direct Referrals</span>
                    <span className="text-green-400">{formatCurrency(directReferralRewards)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">Milestone Bonuses</span>
                    <span className="text-purple-400">{formatCurrency(totalMilestoneRewards)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 p-6 rounded-xl">
            <h4 className="text-lg font-semibold mb-4">Earned Milestone Bonuses</h4>
            <div className="space-y-2">
              {completedMilestones.length > 0 ? (
                completedMilestones.map((milestone) => (
                  <div 
                    key={milestone.referrals}
                    className="flex justify-between items-center p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-gray-300">{milestone.referrals} referrals</span>
                    </div>
                    <span className="text-green-400 font-semibold">
                      {formatCurrency(milestone.bonus)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm text-center py-4">
                  No milestone bonuses earned yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Summary */}
      <div className="mt-8 p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl">
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-2xl font-bold text-green-400">{stats.completedReferrals}</p>
            <p className="text-gray-400 text-sm">Successfully Completed Referrals</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-400">{completedMilestones.length}</p>
            <p className="text-gray-400 text-sm">Milestones Achieved</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-400">{formatCurrency(balance.referralEarnings || 0)}</p>
            <p className="text-gray-300 text-sm font-medium">Total Earned & Stored in Database</p>
          </div>
        </div>
      </div>
    </div>
  );
}