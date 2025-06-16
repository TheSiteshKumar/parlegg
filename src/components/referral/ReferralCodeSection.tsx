import React, { useState } from 'react';
import { Copy, Share2, Users, Gift } from 'lucide-react';
import { useReferral } from '../../context/ReferralContext';

export default function ReferralCodeSection() {
  const { referralCode, createReferralCode, loading } = useReferral();
  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleCreateCode = async () => {
    setCreating(true);
    try {
      await createReferralCode();
    } catch (error) {
      console.error('Failed to create referral code:', error);
    } finally {
      setCreating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareReferral = async () => {
    const shareData = {
      title: 'Join PARLEG Investment Platform',
      text: `Use my referral code ${referralCode} to get bonus rewards when you start investing!`,
      url: `${window.location.origin}/signup?ref=${referralCode}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      copyToClipboard(`${shareData.text} ${shareData.url}`);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-12 bg-gray-700 rounded mb-4"></div>
          <div className="h-10 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm p-8 rounded-2xl border border-blue-500/20">
      <div className="flex items-center gap-3 mb-6">
        <Gift className="h-6 w-6 text-blue-500" />
        <h3 className="text-xl font-semibold">Your Referral Code</h3>
      </div>

      {!referralCode ? (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 mb-6">Generate your unique referral code to start earning rewards</p>
          <button
            onClick={handleCreateCode}
            disabled={creating}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {creating ? 'Creating...' : 'Generate Referral Code'}
          </button>
        </div>
      ) : (
        <div>
          <div className="bg-gray-900/50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-mono font-bold text-blue-400">{referralCode}</span>
              <button
                onClick={() => copyToClipboard(referralCode)}
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors"
              >
                <Copy className="h-4 w-4" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => copyToClipboard(`${window.location.origin}/signup?ref=${referralCode}`)}
              className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-xl transition-colors"
            >
              <Copy className="h-4 w-4" />
              Copy Link
            </button>
            <button
              onClick={shareReferral}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-xl transition-colors"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>

          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
            <p className="text-sm text-green-400">
              💡 <strong>Tip:</strong> Share your code with friends and family. You'll earn rewards when they purchase investment plans!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}