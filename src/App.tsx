import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import ResetPassword from './components/auth/ResetPassword';
import ProfileForm from './components/profile/ProfileForm';
import PrivateRoute from './components/routing/PrivateRoute';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import PlansPage from './pages/PlansPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import Dashboard from './components/Dashboard';
import PlanDetails from './components/PlanDetails';
import WithdrawalHistoryPage from './pages/WithdrawalHistoryPage';
import WithdrawalApprovalPage from './pages/admin/WithdrawalApprovalPage';
import TermsPage from './pages/legal/TermsPage';
import PrivacyPage from './pages/legal/PrivacyPage';
import RefundPage from './pages/legal/RefundPage';
import { InvestmentProvider } from './context/InvestmentContext';
import { WalletProvider } from './context/WalletContext';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <WalletProvider>
          <InvestmentProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/plans" element={<PlansPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/refund" element={<RefundPage />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/withdrawals"
                  element={
                    <PrivateRoute>
                      <WithdrawalHistoryPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/withdrawals"
                  element={
                    <PrivateRoute>
                      <WithdrawalApprovalPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <ProfileForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/plan/:level"
                  element={
                    <PrivateRoute>
                      <PlanDetails />
                    </PrivateRoute>
                  }
                />
              </Route>
            </Routes>
          </InvestmentProvider>
        </WalletProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}