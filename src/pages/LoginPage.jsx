import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/ui/Logo';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetSent, setResetSent] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await authService.login(email, password);
            navigate('/app');
        } catch (err) {
            console.error('Login error:', err);
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError('Invalid email or password.');
            } else if (err.code === 'auth/invalid-email') {
                setError('Invalid email format.');
            } else {
                setError('An error occurred during login. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await authService.resetPassword(resetEmail);
            setResetSent(true);
        } catch (err) {
            console.error('Reset password error:', err);
            setError('Error sending password reset email. Please check the email address.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <Logo iconSize="w-12 h-12" textSize="text-2xl" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {showForgotPassword ? 'Reset Password' : 'Welcome Back'}
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm">
                        {showForgotPassword
                            ? "Enter your email to receive a password reset link."
                            : 'Log in to your People Analyzer account'}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-2">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                {resetSent ? (
                    <div className="text-center space-y-6">
                        <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto">
                            <Mail size={32} />
                        </div>
                        <div>
                            <p className="text-gray-900 font-bold text-lg">Check your email</p>
                            <p className="text-gray-500 text-sm mt-1">
                                We've sent a password reset link to <br />
                                <strong className="text-gray-700">{resetEmail}</strong>
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setResetSent(false);
                                setShowForgotPassword(false);
                                setResetEmail('');
                            }}
                            className="text-brand-blue font-bold text-sm hover:underline"
                        >
                            Back to log in
                        </button>
                    </div>
                ) : showForgotPassword ? (
                    <form onSubmit={handleForgotPassword} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue transition-colors"
                                placeholder="you@company.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 bg-brand-blue text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-blue/20 hover:bg-blue-600 transition-all transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                            {!isSubmitting && <ArrowRight size={16} />}
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowForgotPassword(false)}
                            className="w-full text-center text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            Back to log in
                        </button>
                    </form>
                ) : (
                    <>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue transition-colors"
                                    placeholder="you@company.com"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-sm font-medium text-gray-700">Password</label>
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotPassword(true)}
                                        className="text-xs font-bold text-brand-blue hover:underline"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 bg-brand-blue text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-blue/20 hover:bg-blue-600 transition-all transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <span>{isSubmitting ? 'Logging in...' : 'Log In'}</span>
                                {!isSubmitting && <ArrowRight size={16} />}
                            </button>
                        </form>

                        <p className="text-center mt-8 text-xs text-gray-400">
                            Don't have an account? <Link to="/register" className="text-brand-blue font-bold hover:underline">Sign up</Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
