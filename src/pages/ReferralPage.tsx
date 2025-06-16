import React from 'react';
import { ArrowLeft, Gift, Users, Star, Award, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReferralCodeSection from '../components/referral/ReferralCodeSection';
import ReferralStats from '../components/referral/ReferralStats';
import ReferralList from '../components/referral/ReferralList';
import ReferralRewards from '../components/referral/ReferralRewards';
import { formatCurrency } from '../utils/formatters';

export default function ReferralPage() {
  const rewardStructure = [
    {
      plan: 'Starter Plan',
      amount: '₹600',
      referrerReward: 150,
      refereeReward: 100,
      color: 'from-blue-500 to-blue-600'
    },
    {
      plan: 'Growth Plan',
      amount: '₹3,800',
      referrerReward: 300,
      refereeReward: 200,
      color: 'from-green-500 to-green-600'
    },
    {
      plan: 'Advanced Plan',
      amount: '₹9,600',
      referrerReward: 500,
      refereeReward: 300,
      color: 'from-purple-500 to-purple-600'
    },
    {
      plan: 'Premium Plan',
      amount: '₹20,800',
      referrerReward: 1000,
      refereeReward: 500,
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link 
            to="/dashboard" 
            className="flex items-center text-blue-400 hover:text-blue-500 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-2">Referral Program</h1>
          <p className="text-gray-400">Earn rewards by referring friends to PARLEG</p>
        </div>
      </div>

      <div className="space-y-12">
        {/* Referral Code Section */}
        <ReferralCodeSection />

        {/* Reward Structure Section */}
        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm p-8 rounded-2xl border border-blue-500/20">
          <div className="flex items-center gap-3 mb-8">
            <Gift className="h-8 w-8 text-blue-500" />
            <div>
              <h2 className="text-2xl font-bold">Referral Reward Structure</h2>
              <p className="text-gray-400">Earn rewards when your friends invest in any plan</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {rewardStructure.map((reward, index) => (
              <div 
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all"
              >
                <div className={`w-full h-2 bg-gradient-to-r ${reward.color} rounded-full mb-4`}></div>
                <h3 className="font-semibold text-lg mb-2">{reward.plan}</h3>
                <p className="text-gray-400 text-sm mb-4">Investment: {reward.amount}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">You earn:</span>
                    <span className="font-bold text-green-500">{formatCurrency(reward.referrerReward)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Friend earns:</span>
                    <span className="font-bold text-blue-500">{formatCurrency(reward.refereeReward)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50">
            <div className="flex items-start gap-4">
              <div className="bg-yellow-500/20 p-3 rounded-full">
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">How It Works</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Share your unique referral code with friends</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Your friend signs up using your code</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>When they purchase any investment plan, both of you get rewarded!</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Rewards are instantly credited to your earnings wallet</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Bonuses */}
        <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/20">
          <div className="flex items-center gap-3 mb-6">
            <Award className="h-8 w-8 text-purple-500" />
            <div>
              <h2 className="text-2xl font-bold">Milestone Bonuses</h2>
              <p className="text-gray-400">Earn extra rewards for reaching referral milestones</p>
            </div>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            {[
              { referrals: 3, bonus: 100 },
              { referrals: 10, bonus: 300 },
              { referrals: 25, bonus: 1000 },
              { referrals: 50, bonus: 4000 },
              { referrals: 100, bonus: 10000 }
            ].map((milestone, index) => (
              <div 
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50 text-center"
              >
                <div className="text-2xl font-bold text-purple-400 mb-2">{milestone.referrals}</div>
                <div className="text-sm text-gray-400 mb-2">Referrals</div>
                <div className="text-lg font-bold text-green-500">{formatCurrency(milestone.bonus)}</div>
                <div className="text-xs text-gray-500">Bonus</div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
            <p className="text-purple-400 text-sm">
              <TrendingUp className="h-4 w-4 inline mr-1" />
              <strong>Pro Tip:</strong> The more friends you refer, the bigger your milestone bonuses become! 
              Reach 100 referrals and earn a massive ₹10,000 bonus.
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <ReferralStats />

        {/* Referrals and Rewards Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          <ReferralList />
          <ReferralRewards />
        </div>

        {/* Tips for Success */}
        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50">
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-8 w-8 text-green-500" />
            <h2 className="text-2xl font-bold">Tips for Successful Referrals</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-500/20 p-2 rounded-lg">
                  <span className="text-blue-500 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Share Your Experience</h3>
                  <p className="text-gray-400 text-sm">Tell friends about your positive experience with PARLEG and how you're earning daily returns.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-500/20 p-2 rounded-lg">
                  <span className="text-green-500 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Explain the Benefits</h3>
                  <p className="text-gray-400 text-sm">Help them understand how they can earn daily returns and get welcome bonuses.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  <span className="text-purple-500 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Use Social Media</h3>
                  <p className="text-gray-400 text-sm">Share your referral link on WhatsApp, Telegram, and other social platforms.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-yellow-500/20 p-2 rounded-lg">
                  <span className="text-yellow-500 font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Provide Support</h3>
                  <p className="text-gray-400 text-sm">Help your friends get started and answer any questions they might have.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}