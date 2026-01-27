import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/ui/Logo';
import { Mail, CheckCircle, ArrowRight, User, Building, Target, Check, ChevronLeft, AlertCircle, CreditCard } from 'lucide-react';
import { authService } from '../services/authService';

export default function RegistrationPage() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1); // 1: Plan, 2: Account/Org, 3: Success
    const [selectedPlan, setSelectedPlan] = useState('starter'); // 'starter', 'growth', 'business'

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        companyName: '',
        industry: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const PLANS = [
        {
            id: 'Starter',
            name: 'Starter',
            price: '$50',
            period: '/month',
            features: ['Up to 10 Employees', 'Core Values Assessment', 'Basic GWC Analysis'],
            recommended: false
        },
        {
            id: 'Growth',
            name: 'Growth',
            price: '$150',
            period: '/month',
            features: ['Up to 50 Employees', 'Historical Trending', 'Advanced Filtering', 'Email Support'],
            recommended: true
        },
        {
            id: 'Business',
            name: 'Business',
            price: 'Custom',
            period: '',
            features: ['Unlimited Employees', 'Dedicated Success Manager', 'API Access', 'SSO / SAML'],
            recommended: false
        }
    ];

    const handleNext = () => setCurrentStep(prev => prev + 1);
    const handleBack = () => setCurrentStep(prev => prev - 1);

    const handlePlanSelect = (planId) => {
        setSelectedPlan(planId);
        handleNext(); // Move to account creation after plan selection
    };

    const handleRegister = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            // Prepare Organization Data
            const orgData = {
                name: formData.companyName,
                plan: selectedPlan,
                industry: formData.industry
            };

            // Prepare User Data
            const userData = {
                fullName: formData.fullName
            };

            // If Business plan, we might redirect to a "Contact Sales" or "Pending Approval" flow
            // For now, allow regular registration but maybe set status to pending?
            // "Si es Business: Envía solicitud a equipo de ventas + Crea cuenta en estado 'pending_business_approval'"
            // Implementing direct creation for now as per "Mock Payment" decision, but user will be Admin.

            if (selectedPlan === 'business') {
                // Logic for business plan could go here (e.g. skip payment mock, go to contact form)
                // For this MVP step, we treat it same as others but typically no payment
            }

            // MOCK PAYMENT STEP WOULD GO HERE
            // await stripeService.processPayment(...)

            // Register Admin and Create Org
            await authService.registerAdmin(formData.email, formData.password, userData, orgData);

            setCurrentStep(3);
            setTimeout(() => navigate('/app'), 2000);
        } catch (err) {
            console.error('Registration error:', err);
            if (err.code === 'auth/email-already-in-use') {
                setError('This email is already registered. Please login instead.');
            } else {
                setError(err.message || 'An error occurred during registration.');
            }
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 py-4 px-8 flex justify-between items-center sticky top-0 z-10">
                <Link to="/">
                    <Logo iconSize="w-8 h-8" textSize="text-lg" />
                </Link>
                <div className="text-sm text-gray-500">
                    Already have an account? <Link to="/login" className="text-brand-blue font-bold hover:underline">Log in</Link>
                </div>
            </div>

            <div className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-12">
                {currentStep === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose the right plan for your team</h1>
                            <p className="text-gray-500">Start with a 14-day free trial. No credit card required for trial.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {PLANS.map((plan) => (
                                <div key={plan.id} className={`relative bg-white rounded-2xl shadow-sm border p-6 flex flex-col transition-all hover:shadow-md cursor-pointer ${selectedPlan === plan.id ? 'border-brand-blue ring-1 ring-brand-blue' : 'border-gray-200 hover:border-brand-blue/50'}`}
                                    onClick={() => handlePlanSelect(plan.id)}
                                >
                                    {plan.recommended && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-blue text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                            Most Popular
                                        </div>
                                    )}
                                    <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                                    <div className="mt-4 mb-6">
                                        <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                                        <span className="text-gray-500 font-medium">{plan.period}</span>
                                    </div>
                                    <ul className="space-y-3 mb-8 flex-1">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                                <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <button className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${selectedPlan === plan.id ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'bg-gray-50 text-gray-900 hover:bg-gray-100'}`}>
                                        Select {plan.name}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
                        <button onClick={handleBack} className="flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-6 transition-colors">
                            <ChevronLeft size={18} />
                            <span className="text-sm font-medium">Back to Plans</span>
                        </button>

                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">Set up your account</h2>
                                <p className="text-gray-500 text-sm mt-1">You selected the <strong className="text-brand-blue capitalize">{selectedPlan}</strong> plan.</p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-2">
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}

                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
                                            placeholder="John Doe"
                                            value={formData.fullName}
                                            onChange={e => setFormData(p => ({ ...p, fullName: e.target.value }))}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Company Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
                                            placeholder="Acme Inc."
                                            value={formData.companyName}
                                            onChange={e => setFormData(p => ({ ...p, companyName: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
                                        placeholder="you@company.com"
                                        value={formData.email}
                                        onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue focus:bg-white transition-all"
                                        placeholder="Min. 8 characters"
                                        value={formData.password}
                                        onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                                    />
                                </div>

                                <div className="pt-4">
                                    <button
                                        onClick={handleRegister}
                                        disabled={isSubmitting || !formData.email || !formData.password || !formData.fullName || !formData.companyName}
                                        className="w-full py-4 bg-brand-blue text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-blue/20 hover:bg-blue-600 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            'Creating Account...'
                                        ) : (
                                            <>
                                                Proceed to Payment (Mock) <ArrowRight size={18} />
                                            </>
                                        )}
                                    </button>
                                    <p className="text-xs text-gray-400 text-center mt-3">
                                        By clicking "Proceed", you agree to our Terms of Service and Privacy Policy.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="flex flex-col items-center justify-center py-20 animate-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                            <CheckCircle size={40} />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Aboard!</h1>
                        <p className="text-gray-500">Your organization has been successfully created.</p>
                        <p className="text-gray-400 text-sm mt-8">Redirecting to dashboard...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
