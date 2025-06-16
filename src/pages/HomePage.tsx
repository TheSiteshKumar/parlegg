import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Shield, Clock, ChevronRight, Users, Star, Award } from 'lucide-react';
import Features from '../components/home/Features';
import PlansSection from '../components/plans/PlansSection';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-800 py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="text-sm text-yellow-500 font-semibold">Trusted by 10,000+ Investors</span>
              </div>
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Your Gateway to Smart Investments
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Join thousands of investors who trust PARLEG for secure, high-yield investment opportunities. Start earning daily returns with our proven investment plans.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link 
                  to="/plans" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg"
                >
                  View Investment Plans
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  to="/signup" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-gray-800/50 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-gray-700/50 transition-all border border-gray-700"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>100% Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <span>Daily Returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  <span>Referral Rewards</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?auto=format&fit=crop&q=80&w=2000" 
                  alt="Investment Dashboard" 
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose PARLEG</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience the benefits of our carefully crafted investment platform designed for maximum returns and security
            </p>
          </div>
          <Features />
        </div>
      </section>

      {/* Investment Plans Preview */}
      <PlansSection className="bg-gray-900/50" />

      {/* Statistics & Trust Indicators */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trusted by Investors Worldwide</h2>
            <p className="text-gray-400">Our track record speaks for itself</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
              <div className="text-4xl font-bold text-blue-500 mb-2">10K+</div>
              <div className="text-gray-400">Active Investors</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
              <div className="text-4xl font-bold text-green-500 mb-2">₹50M+</div>
              <div className="text-gray-400">Total Investments</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
              <div className="text-4xl font-bold text-purple-500 mb-2">45</div>
              <div className="text-gray-400">Days Return Period</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
              <div className="text-4xl font-bold text-yellow-500 mb-2">24/7</div>
              <div className="text-gray-400">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Referral Program CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-sm p-12 rounded-2xl border border-blue-500/20">
            <Award className="h-16 w-16 text-blue-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Earn More with Referrals</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Invite friends and earn up to ₹1,000 for each successful referral. Both you and your friend get rewarded!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/signup" 
                className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Start Referring Now
                <Users className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                to="/referral" 
                className="inline-flex items-center justify-center px-8 py-3 bg-gray-800/50 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-gray-700/50 transition-all border border-gray-700"
              >
                Learn More
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}