import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        const usersJSON = localStorage.getItem('users');
        let users = [];
        if (usersJSON) {
            users = JSON.parse(usersJSON);
        }

        // Also check legacy single user for backward compatibility
        const legacyUserJSON = localStorage.getItem('currentUser');
        let legacyUser = null;
        if (legacyUserJSON) {
            legacyUser = JSON.parse(legacyUserJSON);
        }

        const foundUser = users.find(u => u.email === email && u.password === password) ||
            (legacyUser && legacyUser.email === email && legacyUser.password === password ? legacyUser : null);

        if (foundUser) {
            // Success
            localStorage.setItem('currentUser', JSON.stringify(foundUser));
            navigate('/app');
            return;
        } else {
            // Check if email exists but wrong password
            const emailExists = users.some(u => u.email === email) || (legacyUser && legacyUser.email === email);

            if (emailExists) {
                setError('Invalid password.');
            } else {
                handleUnregistered();
            }
        }

    };

    const handleUnregistered = () => {
        // User not found flow
        const confirmRegister = window.confirm("User not registered. would you like to view our subscription plans?");
        if (confirmRegister) {
            // Redirect to pricing section on landing page
            // Using window.location.href because it's a hash link on a different page (or potentially same app)
            // But since LandingPage is internal route '/', we can use navigate with state or just redirect
            window.location.href = '/#pricing';
        } else {
            setError('User not found. Please register.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-blue-50 text-brand-blue rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Lock size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="text-gray-500 mt-2 text-sm">Log in to your People Analyzer account</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-2">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
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
                        className="w-full py-3 bg-brand-blue text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-blue/20 hover:bg-blue-600 transition-all transform active:scale-95 flex items-center justify-center gap-2"
                    >
                        <span>Log In</span>
                        <ArrowRight size={16} />
                    </button>
                </form>

                <p className="text-center mt-8 text-xs text-gray-400">
                    Don't have an account? <Link to="/register" className="text-brand-blue font-bold hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
}
