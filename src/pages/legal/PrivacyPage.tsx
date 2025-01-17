import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <Link to="/" className="flex items-center text-blue-400 hover:text-blue-500 mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>

      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-invert max-w-none">
        <p className="text-gray-300 mb-6">
          At PARLEG, operated by VISHAL KUMAR, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <h3 className="text-xl font-semibold mb-2">Personal Information:</h3>
          <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-4">
            <li>Name and contact information</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Date of birth</li>
            <li>Government-issued ID numbers (for KYC purposes)</li>
          </ul>

          <h3 className="text-xl font-semibold mb-2">Technical Information:</h3>
          <ul className="list-disc pl-6 text-gray-300 space-y-2">
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Device information</li>
            <li>Usage data and analytics</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-300 mb-4">We use your information to:</p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2">
            <li>Process your investments and transactions</li>
            <li>Verify your identity and prevent fraud</li>
            <li>Communicate with you about your account</li>
            <li>Send important updates and notifications</li>
            <li>Improve our services and user experience</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Data Security</h2>
          <p className="text-gray-300 mb-4">
            We implement appropriate security measures to protect your information from unauthorized access, disclosure, alteration, and destruction. These measures include encryption, secure servers, and regular security audits.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Data Sharing</h2>
          <p className="text-gray-300 mb-4">We may share your information with:</p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2">
            <li>Payment processors and financial institutions</li>
            <li>Identity verification services</li>
            <li>Legal and regulatory authorities</li>
            <li>Service providers who assist in our operations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
          <p className="text-gray-300 mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Object to processing of your information</li>
            <li>Withdraw consent</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Contact Information</h2>
          <p className="text-gray-300 mb-4">
            For any privacy-related questions or concerns, please contact us at:
          </p>
          <div className="text-gray-300">
            <p>VISHAL KUMAR</p>
            <p>PARLEG Investments</p>
            <p>123 Investment Street, Koramangala</p>
            <p>Bangalore, Karnataka - 560034</p>
            <p>Email: privacy@PARLEG.com</p>
          </div>
        </section>
      </div>
    </div>
  );
}