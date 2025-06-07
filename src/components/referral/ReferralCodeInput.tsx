import React, { useState } from 'react';
import { Gift, AlertCircle, CheckCircle, User, ArrowRight } from 'lucide-react';
import { referralService } from '../../services/referral.service';

interface ReferrerInfo {
  userId: string;
  userName: string;
  isValid: boolean;
}

export default function ReferralCodeInput() {
  const [referralCode, setReferralCode] = useState('');
  const [validationState, setValidationState] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
  const [message, setMessage] = useState('');
  const [referrerInfo, setReferrerInfo] = useState<ReferrerInfo | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateReferralCode = async (code: string) => {
    if (!code.trim() || code.length !== 8) {
      setValidationState('idle');
      setMessage('');
      setReferrerInfo(null);
      return;
    }

    setValidationState('validating');
    
    try {
      const result = await referralService.validateReferralCode(code);
      if (result.isValid) {
        // Get referrer name from user document
        const referrerName = await referralService.getReferrerName(result.userId);
        setReferrerInfo({
          userId: result.userId,
          userName: referrerName,
          isValid: true
        });
        setValidationState('valid');
        setMessage(`Valid referral code from ${referrerName}! You'll both get bonus rewards when you purchase a plan.`);
      } else {
        setValidationState('invalid');
        setMessage('Invalid referral code. Please check and try again.');
        setReferrerInfo(null);
      }
    } catch (error) {
      setValidationState('invalid');
      setMessage('Error validating referral code. Please try again.');
      setReferrerInfo(null);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.toUpperCase();
    setReferralCode(code);
    setIsSubmitted(false);
    
    if (code.length === 8) {
      validateReferralCode(code);
    } else {
      setValidationState('idle');
      setMessage('');
      setReferrerInfo(null);
    }
  };

  const handleSubmit = () => {
    if (validationState === 'valid' && referrerInfo) {
      setIsSubmitted(true);
      // Store referral code in localStorage for signup process
      localStorage.setItem('pendingReferralCode', referralCode);
      localStorage.setItem('pendingReferrerInfo', JSON.stringify(referrerInfo));
    }
  };

  const getInputBorderColor = () => {
    switch (validationState) {
      case 'valid':
        return 'border-green-500 focus:ring-green-500';
      case 'invalid':
        return 'border-red-500 focus:ring-red-500';
      case 'validating':
        return 'border-blue-500 focus:ring-blue-500';
      default:
        return 'border-gray-700 focus:ring-blue-500';
    }
  };

  const getMessageColor = () => {
    switch (validationState) {
      case 'valid':
        return 'text-green-500';
      case 'invalid':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch (validationState) {
      case 'valid':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'invalid':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'validating':
        return <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent" />;
      default:
        return null;
    }
  };

  if (isSubmitted && referrerInfo) {
    return (
      <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 backdrop-blur-sm p-8 rounded-2xl border border-green-500/20">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-green-500/10 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
          </div>
          
          <h3 className="text-2xl font-semibold mb-4">Referral Code Activated!</h3>
          
          <div className="bg-gray-900/50 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-blue-500/10 rounded-full">
                <User className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Referred by</p>
                <p className="text-lg font-semibold text-white">{referrerInfo.userName}</p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-mono font-bold text-green-400 mb-2">{referralCode}</p>
              <p className="text-sm text-gray-400">Your referral code is now active</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <h4 className="font-semibold text-green-400 mb-2">🎉 Next Steps:</h4>
              <ul className="text-sm text-gray-300 space-y-2 text-left">
                <li>• Purchase any investment plan to activate rewards</li>
                <li>• Both you and {referrerInfo.userName} will earn bonus rewards</li>
                <li>• Rewards are automatically added to your earnings wallet</li>
                <li>• Higher value plans = bigger rewards for both of you!</li>
              </ul>
            </div>

            <a 
              href="/plans"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all transform hover:scale-105"
            >
              Purchase Investment Plan
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/20">
      <div className="flex items-center gap-3 mb-6">
        <Gift className="h-6 w-6 text-purple-500" />
        <h3 className="text-xl font-semibold">Have a Referral Code?</h3>
      </div>

      <div className="space-y-4">
        <p className="text-gray-300">
          Enter a referral code to get bonus rewards when you purchase your first investment plan.
        </p>

        <div className="space-y-3">
          <label htmlFor="referralCode" className="block text-sm font-medium text-gray-300">
            Referral Code
          </label>
          <div className="relative">
            <input
              id="referralCode"
              type="text"
              value={referralCode}
              onChange={handleCodeChange}
              maxLength={8}
              className={`w-full bg-gray-900/50 border rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:border-transparent transition-all ${getInputBorderColor()}`}
              placeholder="Enter 8-character code"
            />
            {getStatusIcon() && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {getStatusIcon()}
              </div>
            )}
          </div>
          
          {message && (
            <p className={`text-sm ${getMessageColor()}`}>
              {message}
            </p>
          )}

          {validationState === 'valid' && referrerInfo && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-500/10 rounded-full">
                  <User className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Referred by</p>
                  <p className="font-semibold text-green-400">{referrerInfo.userName}</p>
                </div>
              </div>
              
              <button
                onClick={handleSubmit}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                Activate Referral Code
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
          <h4 className="font-semibold text-purple-400 mb-2">💡 How it works:</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Enter a valid referral code from a friend</li>
            <li>• Purchase any investment plan to activate rewards</li>
            <li>• Both you and your friend earn bonus rewards</li>
            <li>• Rewards are automatically added to your earnings wallet</li>
          </ul>
        </div>

        {!isSubmitted && (
          <div className="text-center">
            <a 
              href="/plans"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
            >
              View Investment Plans
            </a>
          </div>
        )}
      </div>
    </div>
  );
}