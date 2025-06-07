import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useReferral } from '../../context/ReferralContext';
import { referralService } from '../../services/referral.service';
import { User, Mail, Lock, Gift } from 'lucide-react';
import AuthLayout from './AuthLayout';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [referralValid, setReferralValid] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get referral code from URL
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setReferralCode(refCode);
      validateReferralCode(refCode);
    }
  }, [searchParams]);

  const validateReferralCode = async (code: string) => {
    if (!code.trim()) {
      setReferralValid(null);
      return;
    }

    try {
      const result = await referralService.validateReferralCode(code);
      setReferralValid(result.isValid);
    } catch (error) {
      setReferralValid(false);
    }
  };

  const handleReferralCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.toUpperCase();
    setReferralCode(code);
    
    if (code.length === 8) {
      validateReferralCode(code);
    } else {
      setReferralValid(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await signUp(email, password, name);
      
      // If there's a valid referral code, create the referral relationship
      if (referralCode && referralValid && user) {
        try {
          const referrerInfo = await referralService.validateReferralCode(referralCode);
          if (referrerInfo.isValid) {
            await referralService.createReferral(
              referrerInfo.userId,
              user.uid,
              email,
              name,
              referralCode
            );
          }
        } catch (referralError) {
          console.error('Failed to create referral relationship:', referralError);
          // Don't block signup if referral creation fails
        }
      }
      
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    }
  };

  return (
    <AuthLayout title="Create Account">
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Choose a strong password"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="referralCode" className="block text-sm font-medium text-gray-300 mb-2">
            Referral Code (Optional)
          </label>
          <div className="relative">
            <Gift className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="referralCode"
              type="text"
              value={referralCode}
              onChange={handleReferralCodeChange}
              className={`w-full bg-gray-800 border rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:border-transparent ${
                referralValid === true
                  ? 'border-green-500 focus:ring-green-500'
                  : referralValid === false
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-700 focus:ring-blue-500'
              }`}
              placeholder="Enter referral code"
              maxLength={8}
            />
          </div>
          {referralValid === true && (
            <p className="text-green-500 text-sm mt-1">✓ Valid referral code! You'll get bonus rewards.</p>
          )}
          {referralValid === false && (
            <p className="text-red-500 text-sm mt-1">✗ Invalid referral code</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Account
        </button>
      </form>

      <p className="mt-6 text-center text-gray-400">
        Already have an account?{' '}
        <Link to="/signin" className="text-blue-400 hover:text-blue-300">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}