import React from 'react';
import { Shield, Users, Award, TrendingUp } from 'lucide-react';

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">
                Our Mission to Transform Investment
              </h1>
              <p className="text-xl text-gray-300">
                At Britannia, we're dedicated to making smart investment opportunities accessible to everyone. Our platform combines cutting-edge technology with financial expertise to deliver exceptional returns.
              </p>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=2000" 
                alt="Team Meeting" 
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Our Core Values</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            The principles that guide us in delivering exceptional investment services
          </p>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-gray-800 p-6 rounded-xl">
              <Shield className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Security First</h3>
              <p className="text-gray-400">Your investments are protected by industry-leading security measures</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-xl">
              <Users className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Client Focus</h3>
              <p className="text-gray-400">Every decision we make puts our clients' interests first</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-xl">
              <Award className="h-12 w-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p className="text-gray-400">We maintain the highest standards in all our operations</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-xl">
              <TrendingUp className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-400">Constantly evolving to provide better investment solutions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-800 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Our Leadership Team</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Meet the experts behind Britannia's success
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900 rounded-xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400" 
                alt="CEO" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">James Wilson</h3>
                <p className="text-blue-400 mb-4">Chief Executive Officer</p>
                <p className="text-gray-400">20+ years of experience in investment banking and fintech</p>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" 
                alt="CTO" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">Sarah Chen</h3>
                <p className="text-blue-400 mb-4">Chief Technology Officer</p>
                <p className="text-gray-400">Former tech lead at major financial institutions</p>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400" 
                alt="CFO" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">Michael Brooks</h3>
                <p className="text-blue-400 mb-4">Chief Financial Officer</p>
                <p className="text-gray-400">Expert in financial planning and risk management</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}