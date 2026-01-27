import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Logo from '../components/ui/Logo';
import { authService } from '../services/authService';
import { invitationService } from '../services/invitationService';
import { ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

export default function InvitationAcceptPage() {
    const [searchParams] = useSearchParams();
    // Assuming URL structure like: /accept-invite?token=XYZ&email=user@example.com
    const token = searchParams.get('token');
    const invitedEmail = searchParams.get('email');

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        password: '',
        confirmPassword: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const validateLink = async () => {
            if (!token) {
                setError('Invalid or missing invitation token.');
                return;
            }

            try {
                await invitationService.validateToken(token);
                // Token is valid
            } catch (err) {
                console.error("Token validation failed:", err);
                setError(err.message || 'This invitation link is invalid or has expired.');
            }
        };

        validateLink();
    }, [token]);

    const handleAccept = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsSubmitting(true);
        try {
            await authService.registerInvitedUser(
                invitedEmail,
                formData.password,
                token,
                formData.fullName
            );
            setSuccess(true);
            setTimeout(() => navigate('/app'), 2000);
        } catch (err) {
            console.error('Accept invitation error:', err);
            setError(err.message || 'Failed to accept invitation');
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-12 text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to the Team!</h1>
                    <p className="text-gray-500 mb-6">Your account has been set up successfully.</p>
                    <p className="text-sm text-gray-400">Redirecting you to the dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <Logo iconSize="w-12 h-12" textSize="text-2xl" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Accept Invitation</h1>
                    <p className="text-gray-500 mt-2 text-sm">
                        You've been invited to join <span className="font-semibold text-gray-800">People Analyzer</span>
                    </p>
                    {invitedEmail && (
                        <div className="mt-3 inline-block px-3 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-600">
                            {invitedEmail}
                        </div>
                    )}
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-2">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleAccept} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue"
                            placeholder="John Doe"
                            value={formData.fullName}
                            onChange={e => setFormData(p => ({ ...p, fullName: e.target.value }))}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Create Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue"
                            placeholder="Min. 8 characters"
                            value={formData.password}
                            onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue"
                            placeholder="Min. 8 characters"
                            value={formData.confirmPassword}
                            onChange={e => setFormData(p => ({ ...p, confirmPassword: e.target.value }))}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-brand-blue text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-blue/20 hover:bg-blue-600 transition-all flex items-center justify-center gap-2 mt-2"
                    >
                        {isSubmitting ? 'Setting up...' : 'Complete Registration'}
                        {!isSubmitting && <ArrowRight size={16} />}
                    </button>
                </form>
            </div>
        </div>
    );
}
