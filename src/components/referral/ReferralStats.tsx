import React from 'react';
import { Users, Gift, Target, TrendingUp, Award, Star } from 'lucide-react';
import { useReferral } from '../../context/ReferralContext';
import { formatCurrency } from '../../utils/formatters';
import { MILESTONE_BONUSES } from '../../types/referral';

export default function ReferralStats() {
  const { stats, loading } = useReferral();

  if (loading || !stats) {
    return (
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
    );
  }

  const nextMilestoneBonus = MILESTONE_BONUSES.find(m => m.referrals === stats.nextMilestone)?.bonus || 0;
  const completedMilestones = MILESTONE_BONUSES.filter(m => stats.completedReferrals >= m.referrals);
  const totalMilestoneRewards = completedMilestones.reduce((sum, m) => sum + m.bonus, 0);

  return (
    <div className="space-y-8">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-6 w-6 text-blue-500" />
            <h3 className="text-sm font-medium text-gray-400">Total Referrals</h3>
          </div>
          <p className="text-3xl font-bold">{stats.totalReferrals}</p>
          <p className="text-sm text-gray-400 mt-1">People who used your code</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
          <div className="flex items-center gap-3 mb-4">
            <Target className="h-6 w-6 text-green-500" />
            <h3 className="text-sm font-medium text-gray-400">Completed</h3>
          </div>
          <p className="text-3xl font-bold text-green-500">{stats.completedReferrals}</p>
          <p className="text-sm text-gray-400 mt-1">Purchased investment plans</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
          <div className="flex items-center gap-3 mb-4">
            <Gift className="h-6 w-6 text-purple-500" />
            <h3 className="text-sm font-medium text-gray-400">Total Rewards</h3>
          </div>
          <p className="text-3xl font-bold text-purple-500">{formatCurrency(stats.totalRewards)}</p>
          <p className="text-sm text-gray-400 mt-1">Referral + milestone bonuses</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
          <div className="flex items-center gap-3 mb-4">
            <Award className="h-6 w-6 text-yellow-500" />
            <h3 className="text-sm font-medium text-gray-400">Milestones Achieved</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-500">{completedMilestones.length}</p>
          <p className="text-sm text-gray-400 mt-1">Out of {MILESTONE_BONUSES.length} total</p>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Milestone Progress */}
        <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/20">
          <div className="flex items-center gap-3 mb-6">
            <Target className="h-6 w-6 text-purple-500" />
            <h3 className="text-xl font-semibold">Milestone Progress</h3>
          </div>

          <div className="space-y-4 mb-6">
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
          <div>
            <h4 className="text-lg font-semibold mb-4">Milestone Rewards</h4>
            <div className="grid grid-cols-1 gap-3">
              {MILESTONE_BONUSES.map((milestone) => {
                const isCompleted = stats.completedReferrals >= milestone.referrals;
                const isCurrent = stats.nextMilestone === milestone.referrals;
                
                return (
                  <div 
                    key={milestone.referrals}
                    className={`p-4 rounded-xl border flex items-center justify-between ${
                      isCompleted
                        ? 'bg-green-500/10 border-green-500/20 text-green-400'
                        : isCurrent
                        ? 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                        : 'bg-gray-800/50 border-gray-700/50 text-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isCompleted ? (
                        <Star className="h-5 w-5 text-green-400 fill-current" />
                      ) : isCurrent ? (
                        <Target className="h-5 w-5 text-purple-400" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-gray-600" />
                      )}
                      <span className="font-semibold">{milestone.referrals} referrals</span>
                    </div>
                    <span className="font-bold">{formatCurrency(milestone.bonus)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Rewards Breakdown */}
        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-6 w-6 text-green-500" />
            <h3 className="text-xl font-semibold">Rewards Breakdown</h3>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-900/50 p-4 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Referral Rewards</span>
                <span className="text-green-500 font-semibold">
                  {formatCurrency(stats.totalRewards - totalMilestoneRewards)}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Earned from {stats.completedReferrals} completed referrals
              </p>
            </div>

            <div className="bg-gray-900/50 p-4 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Milestone Bonuses</span>
                <span className="text-purple-500 font-semibold">
                  {formatCurrency(totalMilestoneRewards)}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                From {completedMilestones.length} achieved milestones
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 p-4 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-blue-400 font-semibold">Total Earned</span>
                <span className="text-blue-400 font-bold text-xl">
                  {formatCurrency(stats.totalRewards)}
                </span>
              </div>
              <p className="text-sm text-gray-400">
                All-time earnings from referral program
              </p>
            </div>

            {stats.pendingRewards > 0 && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-yellow-400">Pending Rewards</span>
                  <span className="text-yellow-400 font-semibold">
                    {formatCurrency(stats.pendingRewards)}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Will be credited once processed
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}