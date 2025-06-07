import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReferralCodeSection from '../components/referral/ReferralCodeSection';
import ReferralStats from '../components/referral/ReferralStats';
import ReferralList from '../components/referral/ReferralList';
import ReferralRewards from '../components/referral/ReferralRewards';

export default function ReferralPage() {
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

        {/* Stats Overview */}
        <ReferralStats />

        {/* Referrals and Rewards Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          <ReferralList />
          <ReferralRewards />
        </div>
      </div>
    </div>
  );
}