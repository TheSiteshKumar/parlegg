import React from 'react';
import { Gift, Users, Award, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { REFERRAL_REWARDS, MILESTONE_BONUSES } from '../../types/referral';

export default function ReferralRewardChart() {
  const planLevels = Object.keys(REFERRAL_REWARDS);

  return (
    <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 backdrop-blur-sm p-8 rounded-2xl border border-green-500/20">
      <div className="flex items-center gap-3 mb-8">
        <Gift className="h-6 w-6 text-green-500" />
        <h3 className="text-2xl font-semibold">Referral Reward Structure</h3>
      </div>

      <div className="space-y-8">
        {/* Plan-based Rewards */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Users className="h-5 w-5 text-blue-500" />
            <h4 className="text-xl font-semibold">Plan Purchase Rewards</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {planLevels.map((planLevel) => {
              const rewards = REFERRAL_REWARDS[planLevel as keyof typeof REFERRAL_REWARDS];
              return (
                <div 
                  key={planLevel}
                  className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50 hover:border-green-500/30 transition-all"
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400 mb-2">
                      {formatCurrency(parseInt(planLevel))}
                    </div>
                    <div className="text-sm text-gray-400 mb-4">Plan Investment</div>
                    
                    <div className="space-y-3">
                      <div className="bg-green-500/10 rounded-lg p-3">
                        <div className="text-sm text-gray-400">You Earn</div>
                        <div className="text-lg font-bold text-green-400">
                          {formatCurrency(rewards.referrer)}
                        </div>
                      </div>
                      
                      <div className="bg-blue-500/10 rounded-lg p-3">
                        <div className="text-sm text-gray-400">Friend Gets</div>
                        <div className="text-lg font-bold text-blue-400">
                          {formatCurrency(rewards.referee)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
            <p className="text-sm text-green-400">
              <strong>💰 How it works:</strong> When someone uses your referral code and purchases a plan, you both earn instant rewards! The bigger the plan, the bigger the rewards.
            </p>
          </div>
        </div>

        {/* Milestone Bonuses */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Award className="h-5 w-5 text-purple-500" />
            <h4 className="text-xl font-semibold">Milestone Bonus Rewards</h4>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {MILESTONE_BONUSES.map((milestone, index) => (
              <div 
                key={milestone.referrals}
                className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/30 transition-all relative"
              >
                {index === MILESTONE_BONUSES.length - 1 && (
                  <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                    MAX
                  </div>
                )}
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {milestone.referrals}
                  </div>
                  <div className="text-sm text-gray-400 mb-4">Successful Referrals</div>
                  
                  <div className="bg-purple-500/10 rounded-lg p-3">
                    <div className="text-sm text-gray-400">Bonus Reward</div>
                    <div className="text-xl font-bold text-purple-400">
                      {formatCurrency(milestone.bonus)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
            <p className="text-sm text-purple-400">
              <strong>🎯 Milestone Bonuses:</strong> Earn additional rewards as you reach referral milestones! These bonuses are awarded once when you hit each target.
            </p>
          </div>
        </div>

        {/* Total Earning Potential */}
        <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-xl p-6 border border-yellow-500/20">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-yellow-500" />
            <h4 className="text-lg font-semibold">Maximum Earning Potential</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-yellow-400">
                {formatCurrency(15500)}
              </div>
              <div className="text-sm text-gray-400">Total Milestone Bonuses</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-green-400">
                {formatCurrency(1950)}
              </div>
              <div className="text-sm text-gray-400">Per Premium Plan Referral</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-blue-400">
                Unlimited
              </div>
              <div className="text-sm text-gray-400">Earning Potential</div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-yellow-400">
              <strong>🚀 Pro Tip:</strong> Focus on referring friends to higher-value plans for maximum rewards!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}