import React from 'react';
import { Shield, TrendingUp, Users, Award, CheckCircle, Star } from 'lucide-react';
import PlansSection from '../components/plans/PlansSection';

export default function PlansPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-800 py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="max-w-7xl mx-auto text-center relative">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="h-5 w-5 text-yellow-500 fill-current" />
            <span className="text-sm text-yellow-500 font-semibold">4 Investment Plans Available</span>
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Investment Plans
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Choose from our range of investment plans designed to meet your financial goals. 
            Each plan offers guaranteed daily returns with flexible investment amounts.
          </p>
          
          {/* Key Features */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
              <Shield className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">100% Secure</h3>
              <p className="text-sm text-gray-400">Your investments are protected by advanced security measures</p>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
              <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Daily Returns</h3>
              <p className="text-sm text-gray-400">Earn consistent daily returns for 45 days</p>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
              <Users className="h-8 w-8 text-purple-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Referral Rewards</h3>
              <p className="text-sm text-gray-400">Earn extra by referring friends to our platform</p>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Grid */}
      <PlansSection />

      {/* Plan Comparison */}
      <section className="py-20 px-6 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Compare Our Plans</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              All plans offer the same 45-day investment period with guaranteed daily returns
            </p>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="text-left p-6 font-semibold">Plan Features</th>
                    <th className="text-center p-6 font-semibold">Starter</th>
                    <th className="text-center p-6 font-semibold">Growth</th>
                    <th className="text-center p-6 font-semibold">Advanced</th>
                    <th className="text-center p-6 font-semibold">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-700/50">
                    <td className="p-6 font-medium">Investment Amount</td>
                    <td className="p-6 text-center">₹600</td>
                    <td className="p-6 text-center">₹3,800</td>
                    <td className="p-6 text-center">₹9,600</td>
                    <td className="p-6 text-center">₹20,800</td>
                  </tr>
                  <tr className="border-t border-gray-700/50 bg-gray-800/30">
                    <td className="p-6 font-medium">Daily Returns</td>
                    <td className="p-6 text-center text-green-500 font-semibold">₹27</td>
                    <td className="p-6 text-center text-green-500 font-semibold">₹174</td>
                    <td className="p-6 text-center text-green-500 font-semibold">₹450</td>
                    <td className="p-6 text-center text-green-500 font-semibold">₹987</td>
                  </tr>
                  <tr className="border-t border-gray-700/50">
                    <td className="p-6 font-medium">Total Returns (45 days)</td>
                    <td className="p-6 text-center text-blue-500 font-semibold">₹1,215</td>
                    <td className="p-6 text-center text-blue-500 font-semibold">₹7,830</td>
                    <td className="p-6 text-center text-blue-500 font-semibold">₹20,250</td>
                    <td className="p-6 text-center text-blue-500 font-semibold">₹44,415</td>
                  </tr>
                  <tr className="border-t border-gray-700/50 bg-gray-800/30">
                    <td className="p-6 font-medium">Purchase Limit</td>
                    <td className="p-6 text-center">1 time</td>
                    <td className="p-6 text-center">3 times</td>
                    <td className="p-6 text-center">3 times</td>
                    <td className="p-6 text-center text-blue-500 font-semibold">Unlimited</td>
                  </tr>
                  <tr className="border-t border-gray-700/50">
                    <td className="p-6 font-medium">Referral Reward (You)</td>
                    <td className="p-6 text-center text-purple-500">₹150</td>
                    <td className="p-6 text-center text-purple-500">₹300</td>
                    <td className="p-6 text-center text-purple-500">₹500</td>
                    <td className="p-6 text-center text-purple-500 font-semibold">₹1,000</td>
                  </tr>
                  <tr className="border-t border-gray-700/50 bg-gray-800/30">
                    <td className="p-6 font-medium">Referral Reward (Friend)</td>
                    <td className="p-6 text-center text-green-500">₹100</td>
                    <td className="p-6 text-center text-green-500">₹200</td>
                    <td className="p-6 text-center text-green-500">₹300</td>
                    <td className="p-6 text-center text-green-500 font-semibold">₹500</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Plan Benefits & Features</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 backdrop-blur-sm p-8 rounded-2xl border border-blue-500/20">
              <Shield className="h-12 w-12 text-blue-500 mb-6" />
              <h3 className="text-2xl font-semibold mb-4">Secure Investment</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Protected by advanced security measures</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Regular security audits and monitoring</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Transparent investment tracking</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>24/7 dedicated support team</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 backdrop-blur-sm p-8 rounded-2xl border border-green-500/20">
              <TrendingUp className="h-12 w-12 text-green-500 mb-6" />
              <h3 className="text-2xl font-semibold mb-4">Guaranteed Returns</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Fixed daily returns for 45 days</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Clear investment timeline and milestones</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>No hidden fees or charges</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Easy withdrawal process</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <Award className="h-16 w-16 text-blue-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Ready to Start Investing?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of successful investors and start earning daily returns today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/signup" 
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105"
            >
              Create Account & Invest
              <TrendingUp className="ml-2 h-5 w-5" />
            </a>
            <a 
              href="https://wa.me/916209026046" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all"
            >
              WhatsApp Support
              <Users className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}