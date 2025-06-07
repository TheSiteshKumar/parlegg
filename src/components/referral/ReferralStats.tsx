import React from 'react';
import { Users, Gift, Target, TrendingUp } from 'lucide-react';
import { useReferral } from '../../context/ReferralContext';
import { formatCurrency } from '../../utils/formatters';
import { MILESTONE_BONUSES } from '../../types/referral';
import ReferralRewardChart from './ReferralRewardChart';

export default function ReferralStats() {
  const { stats, loading } = useReferral();

  if (loading || !stats) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
              <div className="animate-pulse">
                <div className="h-8 w-8 bg-gray-700 rounded mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3 mb-2"></div>
                <div className="h-8 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const nextMilestoneBonus = MILESTONE_BONUSES.find(m => m.referrals === stats.nextMilestone)?.bonus || 0;

  return (
    <div className="space-y-8">
      {/* Reward Chart */}
      <ReferralRewardChart />

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-6 w-6 text-blue-500" />
            <h3 className="text-sm font-medium text-gray-400">Total Referrals</h3>
          </div>
          <p className="text-3xl font-bold">{stats.totalReferrals}</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
          <div className="flex items-center gap-3 mb-4">
            <Target className="h-6 w-6 text-green-500" />
            <h3 className="text-sm font-medium text-gray-400">Completed</h3>
          </div>
          <p className="text-3xl font-bold text-green-500">{stats.completedReferrals}</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
          <div className="flex items-center gap-3 mb-4">
            <Gift className="h-6 w-6 text-purple-500" />
            <h3 className="text-sm font-medium text-gray-400">Total Rewards</h3>
          </div>
          <p className="text-3xl font-bold text-purple-500">{formatCurrency(stats.totalRewards)}</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-6 w-6 text-yellow-500" />
            <h3 className="text-sm font-medium text-gray-400">Current Milestone</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-500">{stats.currentMilestone}</p>
        </div>
      </div>

      {/* Milestone Progress */}
      <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/20">
        <div className="flex items-center gap-3 mb-6">
          <Target className="h-6 w-6 text-purple-500" />
          <h3 className="text-xl font-semibold">Milestone Progress</h3>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">
              Progress to {stats.nextMilestone} referrals
            </span>
            <span className="text-purple-400 font-semibold">
              {formatCurrency(nextMilestoneBonus)} bonus
            </span>
          </div>

          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${stats.progressToNext}%` }}
            />
          </div>

          <div className="flex justify-between text-sm text-gray-400">
            <span>{stats.completedReferrals} completed</span>
            <span>{stats.nextMilestone} target</span>
          </div>
        </div>

        {/* Milestone List */}
        <div className="mt-8">
          <h4 className="text-lg font-semibold mb-4">Milestone Rewards</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {MILESTONE_BONUSES.map((milestone) => (
              <div 
                key={milestone.referrals}
                className={`p-4 rounded-xl border ${
                  stats.completedReferrals >= milestone.referrals
                    ? 'bg-green-500/10 border-green-500/20 text-green-400'
                    : stats.nextMilestone === milestone.referrals
                    ? 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                    : 'bg-gray-800/50 border-gray-700/50 text-gray-400'
                }`}
              >
                <div className="text-center">
                  <div className="text-lg font-bold">{milestone.referrals}</div>
                  <div className="text-xs mb-2">referrals</div>
                  <div className="text-sm font-semibold">{formatCurrency(milestone.bonus)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}