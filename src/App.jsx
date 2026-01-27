import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import Logo from './components/ui/Logo';

// Lazy load all page components for code splitting
const LandingPage = lazy(() => import('./pages/LandingPage'));
const DashboardApp = lazy(() => import('./pages/DashboardApp'));
const RegistrationPage = lazy(() => import('./pages/RegistrationPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SuperAdminPage = lazy(() => import('./pages/SuperAdminPage'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));
const InvitationAcceptPage = lazy(() => import('./pages/InvitationAcceptPage'));

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
    <div className="flex flex-col items-center gap-6">
      <Logo iconSize="w-16 h-16" textSize="text-3xl" />
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin" />
        <p className="text-gray-500 font-medium">Loading...</p>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ThemeProvider>
          <AuthProvider>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/app" element={<DashboardApp />} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/accept-invite" element={<InvitationAcceptPage />} />
                <Route path="/super-admin-restricted-access" element={<SuperAdminPage />} />
                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
