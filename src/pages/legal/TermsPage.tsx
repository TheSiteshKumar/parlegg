import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <Link to="/" className="flex items-center text-blue-400 hover:text-blue-500 mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>

      <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
      
      <div className="prose prose-invert max-w-none">
        <p className="text-gray-300 mb-6">
          Welcome to PARLEG, operated by VISHAL KUMAR. By accessing and using this website, you accept and agree to be bound by the following terms and conditions.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-300 mb-4">
            By accessing and using this website, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions. If you do not agree with any part of these terms, you must not use this website.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Investment Risks</h2>
          <p className="text-gray-300 mb-4">
            All investments carry risks, and past performance is not indicative of future results. Users should carefully consider their investment objectives and risks before investing. We recommend consulting with a financial advisor before making any investment decisions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
          <ul className="list-disc pl-6 text-gray-300 space-y-2">
            <li>Users must be at least 18 years old to create an account</li>
            <li>Users are responsible for maintaining the confidentiality of their account credentials</li>
            <li>Users must provide accurate and complete information during registration</li>
            <li>Users are responsible for all activities that occur under their account</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
          <p className="text-gray-300 mb-4">
            All content on this website, including but not limited to text, graphics, logos, images, and software, is the property of PARLEG and is protected by intellectual property laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Prohibited Activities</h2>
          <p className="text-gray-300 mb-4">Users must not:</p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2">
            <li>Use the website for any unlawful purpose</li>
            <li>Attempt to gain unauthorized access to any part of the website</li>
            <li>Interfere with the proper functioning of the website</li>
            <li>Upload or transmit any harmful code or malware</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
          <p className="text-gray-300 mb-4">
            PARLEG and VISHAL KUMAR shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Modifications</h2>
          <p className="text-gray-300 mb-4">
            We reserve the right to modify these terms at any time. Users will be notified of any changes, and continued use of the website constitutes acceptance of the modified terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Governing Law</h2>
          <p className="text-gray-300 mb-4">
            These terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka.
          </p>
        </section>
      </div>
    </div>
  );
}