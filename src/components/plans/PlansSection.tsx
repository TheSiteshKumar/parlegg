import React from 'react';
import { investmentPlans } from '../../data/investmentPlans';
import InvestmentCard from '../investment/InvestmentCard';

interface PlansSectionProps {
  className?: string;
}

export default function PlansSection({ className = '' }: PlansSectionProps) {
  return (
    <section className={`py-20 px-6 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Investment Plans</h2>
        <p className="text-gray-400 text-center mb-12">Choose the investment plan that best suits your goals</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {investmentPlans.map((plan) => (
            <InvestmentCard key={plan.level} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
}