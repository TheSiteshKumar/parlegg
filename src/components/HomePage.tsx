import React from 'react';
import Hero from './home/Hero';
import Features from './home/Features';
import InvestmentPlans from './home/InvestmentPlans';
import Footer from './layout/Footer';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <InvestmentPlans />
      <Footer />
    </>
  );
}