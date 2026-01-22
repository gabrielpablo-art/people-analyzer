import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';

export default function RegistrationPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState('register'); // 'register' | 'success'

    const handleGoogleLogin = () => {
        // Simulate Google Auth
        handleSuccess();
    };

    const handleEmailRegister = (e) => {
        e.preventDefault();
        // Simulate Email Registration
        handleSuccess();
    };

    const handleSuccess = () => {
        setStep('success');
        setTimeout(() => {
            navigate('/app');
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">

                {step === 'register' ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center mb-8">
                            <div className="w-12 h-12 bg-blue-50 text-brand-blue rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Mail size={24} />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
                            <p className="text-gray-500 mt-2 text-sm">Join your team on People Analyzer</p>
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors mb-6 group"
                        >
                            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                            Sign up with Google
                        </button>

                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-100"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-400 font-medium">Or continue with email</span>
                            </div>
                        </div>

                        <form onSubmit={handleEmailRegister} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue transition-colors"
                                    placeholder="you@company.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Create Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-brand-blue text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-blue/20 hover:bg-blue-600 transition-all transform active:scale-95 flex items-center justify-center gap-2"
                            >
                                <span className="">Create Account</span>
                                <ArrowRight size={16} />
                            </button>
                        </form>

                        <p className="text-center mt-8 text-xs text-gray-400">
                            By clicking continue, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </div>
                ) : (
                    <div className="text-center py-8 animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Aboard!</h2>
                        <p className="text-gray-500">Redirecting you to the dashboard...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
