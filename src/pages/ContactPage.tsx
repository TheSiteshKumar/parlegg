import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-800 py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="max-w-7xl mx-auto text-center relative">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Have questions about our investment plans? Need support with your account? 
            We're here to help you 24/7 through multiple channels.
          </p>
        </div>
      </section>

      {/* Quick Contact Options */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Choose Your Preferred Contact Method</h2>
            <p className="text-gray-400">Get instant support through our multiple communication channels</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* WhatsApp */}
            <a 
              href="https://wa.me/916209026046" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-green-900/30 to-green-800/20 backdrop-blur-sm p-8 rounded-2xl border border-green-500/20 text-center hover:border-green-500/40 transition-all transform hover:scale-105 group"
            >
              <div className="bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/30 transition-colors">
                <MessageCircle className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-green-400">WhatsApp</h3>
              <p className="text-gray-400 mb-4">Instant messaging support</p>
              <p className="text-green-500 font-semibold">+91 6209026046</p>
              <p className="text-sm text-gray-500 mt-2">Available 24/7</p>
            </a>

            {/* Telegram */}
            <a 
              href="https://t.me/parlegg_official" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 backdrop-blur-sm p-8 rounded-2xl border border-blue-500/20 text-center hover:border-blue-500/40 transition-all transform hover:scale-105 group"
            >
              <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/30 transition-colors">
                <Send className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-400">Telegram</h3>
              <p className="text-gray-400 mb-4">Official channel updates</p>
              <p className="text-blue-500 font-semibold">@parlegg_official</p>
              <p className="text-sm text-gray-500 mt-2">Join our community</p>
            </a>

            {/* Email */}
            <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/20 text-center">
              <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-purple-400">Email</h3>
              <p className="text-gray-400 mb-4">Detailed inquiries</p>
              <p className="text-purple-500 font-semibold">support@parleg.com</p>
              <p className="text-sm text-gray-500 mt-2">Response within 24 hours</p>
            </div>

            {/* Phone */}
            <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 backdrop-blur-sm p-8 rounded-2xl border border-orange-500/20 text-center">
              <div className="bg-orange-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-orange-400">Phone</h3>
              <p className="text-gray-400 mb-4">Direct voice support</p>
              <p className="text-orange-500 font-semibold">+91 6209026046</p>
              <p className="text-sm text-gray-500 mt-2">Mon - Sun, 9 AM - 9 PM</p>
            </div>
          </div>

          {/* Office Location */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 text-center">
            <MapPin className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-4">Our Office</h3>
            <p className="text-gray-300 text-lg mb-2">PARLEG Investments</p>
            <p className="text-gray-400">123 Investment Street, Koramangala</p>
            <p className="text-gray-400">Bangalore, Karnataka - 560034, India</p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 px-6 bg-gray-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Send Us a Message</h2>
            <p className="text-gray-400">Prefer to write? Send us a detailed message and we'll get back to you</p>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            {submitted ? (
              <div className="text-center py-12">
                <div className="bg-green-500/10 border border-green-500 text-green-500 rounded-xl p-6 mb-6">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Message Sent Successfully!</h3>
                  <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="https://wa.me/916209026046" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    WhatsApp for Instant Help
                  </a>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="inline-flex items-center justify-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="What is this regarding?"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Please provide details about your inquiry..."
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center transform hover:scale-105"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-400">Quick answers to common questions</p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
              <h3 className="text-lg font-semibold mb-2">How do I start investing?</h3>
              <p className="text-gray-400">Simply create an account, add funds to your investment wallet, and choose from our available investment plans.</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
              <h3 className="text-lg font-semibold mb-2">When do I receive my daily returns?</h3>
              <p className="text-gray-400">Daily returns are automatically credited to your earnings wallet every 24 hours after your investment starts.</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
              <h3 className="text-lg font-semibold mb-2">How do referral rewards work?</h3>
              <p className="text-gray-400">When someone uses your referral code and purchases an investment plan, both you and your friend receive rewards based on the plan level.</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
              <h3 className="text-lg font-semibold mb-2">How can I withdraw my earnings?</h3>
              <p className="text-gray-400">You can withdraw your earnings anytime through UPI or bank transfer. Withdrawals are processed within 24-48 hours.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}