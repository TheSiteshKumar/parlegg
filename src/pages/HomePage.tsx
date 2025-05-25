import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Shield, Clock, ChevronRight } from 'lucide-react';
import Features from '../components/home/Features';
import PlansSection from '../components/plans/PlansSection';

export default function HomePage() {
  return (
    <div>
      {/* Welcome Section */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">
                Your Gateway to Smart Investments
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of investors who trust Britannia for secure, high-yield investment opportunities.
              </p>
              <div className="flex gap-4">
                <Link 
                  to="/plans" 
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  View Plans
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  to="/signup" 
                  className="inline-flex items-center px-6 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?auto=format&fit=crop&q=80&w=2000" 
                alt="Investment Dashboard" 
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Why Choose Britannia</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Experience the benefits of our carefully crafted investment platform
          </p>
          <Features />
        </div>
      </section>

      {/* Plans */}
      <PlansSection className="bg-gray-800" />

      {/* Statistics */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-500 mb-2">10K+</div>
              <div className="text-gray-400">Active Investors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-500 mb-2">$50M+</div>
              <div className="text-gray-400">Total Investments</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-500 mb-2">45</div>
              <div className="text-gray-400">Days Return Period</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-500 mb-2">24/7</div>
              <div className="text-gray-400">Support Available</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}