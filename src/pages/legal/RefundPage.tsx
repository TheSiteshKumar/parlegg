import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RefundPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <Link to="/" className="flex items-center text-blue-400 hover:text-blue-500 mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>

      <h1 className="text-4xl font-bold mb-8">Cancellation and Refund Policy</h1>
      
      <div className="prose prose-invert max-w-none">
        <p className="text-gray-300 mb-6">
          This policy outlines the terms and conditions for cancellations and refunds at PARLEG, operated by VISHAL KUMAR.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Investment Cancellation</h2>
          <p className="text-gray-300 mb-4">
            Due to the nature of our investment products:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2">
            <li>Active investments cannot be cancelled once initiated</li>
            <li>Investment plans are binding once confirmed and funds are allocated</li>
            <li>Early withdrawal may be subject to penalties as per the investment terms</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Refund Eligibility</h2>
          <p className="text-gray-300 mb-4">Refunds may be considered in the following cases:</p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2">
            <li>Technical errors in fund transfer</li>
            <li>Duplicate transactions</li>
            <li>Unauthorized transactions (subject to investigation)</li>
            <li>System errors preventing investment allocation</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Refund Process</h2>
          <p className="text-gray-300 mb-4">To request a refund:</p>
          <ol className="list-decimal pl-6 text-gray-300 space-y-2">
            <li>Contact our support team within 24 hours of the transaction</li>
            <li>Provide transaction details and reason for refund</li>
            <li>Submit any required documentation</li>
            <li>Allow up to 7 business days for review</li>
            <li>If approved, refund will be processed to the original payment method</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Processing Time</h2>
          <ul className="list-disc pl-6 text-gray-300 space-y-2">
            <li>Refund requests are typically processed within 7 business days</li>
            <li>Bank transfer refunds may take 3-5 additional business days</li>
            <li>UPI refunds are usually processed within 24-48 hours</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Non-Refundable Items</h2>
          <p className="text-gray-300 mb-4">The following are not eligible for refund:</p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2">
            <li>Completed investment cycles</li>
            <li>Processing fees</li>
            <li>Transaction charges</li>
            <li>Withdrawal fees</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Contact Information</h2>
          <p className="text-gray-300 mb-4">
            For refund requests or related queries, please contact:
          </p>
          <div className="text-gray-300">
            <p>Customer Support</p>
            <p>PARLEG Investments</p>
            <p>123 Investment Street, Koramangala</p>
            <p>Bangalore, Karnataka - 560034</p>
            <p>Email: refunds@PARLEG.com</p>
            <p>Phone: +91 62090 26046</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Policy Updates</h2>
          <p className="text-gray-300 mb-4">
            We reserve the right to modify this policy at any time. Users will be notified of any changes through our website or email communications.
          </p>
        </section>
      </div>
    </div>
  );
}