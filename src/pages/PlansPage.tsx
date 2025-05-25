import React from 'react';
import { Shield, TrendingUp } from 'lucide-react';
import PlansSection from '../components/plans/PlansSection';

export default function PlansPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Investment Plans</h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Choose from our range of investment plans designed to meet your financial goals
          </p>
        </div>
      </section>

      {/* Plans Grid */}
      <PlansSection />

      {/* Benefits */}
      <section className="bg-gray-800 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Plan Benefits</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gray-900 p-8 rounded-xl">
              <Shield className="h-12 w-12 text-blue-500 mb-6" />
              <h3 className="text-xl font-semibold mb-4">Secure Investment</h3>
              <ul className="space-y-3 text-gray-300">
                <li>• Protected by advanced security measures</li>
                <li>• Regular security audits</li>
                <li>• Transparent investment tracking</li>
                <li>• Dedicated support team</li>
              </ul>
            </div>
            <div className="bg-gray-900 p-8 rounded-xl">
              <TrendingUp className="h-12 w-12 text-green-500 mb-6" />
              <h3 className="text-xl font-semibold mb-4">Guaranteed Returns</h3>
              <ul className="space-y-3 text-gray-300">
                <li>• Fixed daily returns</li>
                <li>• Clear investment timeline</li>
                <li>• No hidden fees</li>
                <li>• Easy withdrawal process</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}