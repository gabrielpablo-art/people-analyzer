import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, CheckCircle, ArrowRight, User, Building, Target, Check, ChevronLeft, Layout as LayoutIcon, MessageSquare, Code, FileText, PenTool, BarChart } from 'lucide-react';

export default function RegistrationPage() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1); // 1: Sign up, 2: Profile, 3: Company, 4: Goals, 5: Success
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        role: '',
        companyName: '',
        industry: '',
        goals: []
    });

    const steps = [
        { id: 1, name: 'Sign Up', icon: <Mail size={16} /> },
        { id: 2, name: 'Profile', icon: <User size={16} /> },
        { id: 3, name: 'Company', icon: <Building size={16} /> },
        { id: 4, name: 'Goals', icon: <Target size={16} /> }
    ];

    const GOAL_OPTIONS = [
        { id: 'values', label: 'Analyze Core Values', icon: <Target size={14} /> },
        { id: 'org', label: 'Build Org Chart', icon: <LayoutIcon size={14} /> },
        { id: 'perf', label: 'Track Performance', icon: <BarChart size={14} /> },
        { id: 'feedback', label: 'Team Feedback', icon: <MessageSquare size={14} /> },
        { id: 'coding', label: 'Optimize Coding Flow', icon: <Code size={14} /> },
        { id: 'docs', label: 'Draft Documentation', icon: <FileText size={14} /> },
        { id: 'notes', label: 'Personal Notes', icon: <PenTool size={14} /> },
        { id: 'other', label: 'Something else', icon: <Check size={14} /> }
    ];

    const handleNext = () => setCurrentStep(prev => prev + 1);
    const handleBack = () => setCurrentStep(prev => prev - 1);

    const toggleGoal = (goalId) => {
        setFormData(prev => ({
            ...prev,
            goals: prev.goals.includes(goalId)
                ? prev.goals.filter(id => id !== goalId)
                : [...prev.goals, goalId]
        }));
    };

    const handleGoogleLogin = () => {
        setFormData(prev => ({ ...prev, email: 'google_user@company.com' }));
        handleNext();
    };

    const handleCompleteSetup = () => {
        // Build user object
        const newUser = {
            id: Date.now().toString(),
            name: formData.fullName || 'New User',
            email: formData.email,
            password: formData.password || 'social_auth',
            role: 'owner',
            company: formData.companyName,
            industry: formData.industry,
            goals: formData.goals,
            onboardingCompleted: true,
            status: 'active',
            trialStartDate: new Date().toISOString(),
            trialDaysLeft: 14
        };

        // Save to localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));

        setCurrentStep(5);
        setTimeout(() => navigate('/app'), 2000);
    };

    return (
        <div className="min-h-screen bg-white flex overflow-hidden">
            {/* Left Content Area */}
            <div className="w-full lg:w-1/2 flex flex-col h-screen">
                {/* Header / Progress Bar */}
                <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-white/80 backdrop-blur-md z-10">
                    <div className="flex items-center gap-8">
                        <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-red-400" />
                            <div className="w-2 h-2 rounded-full bg-amber-400" />
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                        </div>
                        <div className="hidden sm:flex items-center gap-6">
                            {steps.map((s) => (
                                <div key={s.id} className="flex items-center gap-2">
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${currentStep === s.id ? 'text-brand-blue' : 'text-gray-300'}`}>
                                        {s.name}
                                    </span>
                                    {s.id < 4 && <div className="text-gray-200 text-[10px]">/</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Form Container */}
                <div className="flex-1 overflow-y-auto px-8 py-12 lg:px-24 scrollbar-hide">
                    {currentStep > 1 && currentStep < 5 && (
                        <button onClick={handleBack} className="flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-8 transition-colors group">
                            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-medium">Back</span>
                        </button>
                    )}

                    <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {currentStep === 1 && (
                            <div className="space-y-8">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
                                    <p className="text-gray-500 text-sm">Join People Analyzer to optimize your team's performance.</p>
                                </div>

                                <button
                                    onClick={handleGoogleLogin}
                                    className="w-full flex items-center justify-center gap-3 px-6 py-3.5 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all group"
                                >
                                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                                    Sign up with Google
                                </button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-gray-400 font-medium">Or continue with email</span></div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                                        <input
                                            type="email"
                                            className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-sm"
                                            placeholder="you@company.com"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                                        <input
                                            type="password"
                                            className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-sm"
                                            placeholder="Min. 8 characters"
                                            value={formData.password}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        onClick={handleNext}
                                        disabled={!formData.email || !formData.password}
                                        className="w-full py-4 bg-brand-blue text-white rounded-2xl text-sm font-bold shadow-xl shadow-brand-blue/20 hover:bg-blue-600 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2 group"
                                    >
                                        Create Account
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-8">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Tell us about you</h1>
                                    <p className="text-gray-500 text-sm">Help us personalize your workspace experience.</p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                                        <input
                                            autoFocus
                                            type="text"
                                            className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-sm"
                                            placeholder="John Doe"
                                            value={formData.fullName}
                                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Role / Position</label>
                                        <input
                                            type="text"
                                            className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-sm"
                                            placeholder="e.g. CEO, HR Manager"
                                            value={formData.role}
                                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        onClick={handleNext}
                                        disabled={!formData.fullName || !formData.role}
                                        className="w-full py-4 bg-brand-blue text-white rounded-2xl text-sm font-bold shadow-xl shadow-brand-blue/20 hover:bg-blue-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2 group"
                                    >
                                        Continue
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-8">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Set up your company</h1>
                                    <p className="text-gray-500 text-sm">Where do you build greatness?</p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Company Name</label>
                                        <input
                                            autoFocus
                                            type="text"
                                            className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-sm"
                                            placeholder="Acme Inc."
                                            value={formData.companyName}
                                            onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Industry</label>
                                        <select
                                            className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-sm appearance-none"
                                            value={formData.industry}
                                            onChange={e => setFormData({ ...formData, industry: e.target.value })}
                                        >
                                            <option value="">Select an industry</option>
                                            <option value="tech">Technology</option>
                                            <option value="fintech">Financial Services</option>
                                            <option value="healthcare">Healthcare</option>
                                            <option value="mfg">Manufacturing</option>
                                            <option value="retail">Retail</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <button
                                        onClick={handleNext}
                                        disabled={!formData.companyName || !formData.industry}
                                        className="w-full py-4 bg-brand-blue text-white rounded-2xl text-sm font-bold shadow-xl shadow-brand-blue/20 hover:bg-blue-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2 group"
                                    >
                                        Continue
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="space-y-8">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Where do you spend time typing?</h1>
                                    <p className="text-gray-500 text-sm">This helps us personalize Flow where you work. Select all that apply.</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {GOAL_OPTIONS.map((goal) => (
                                        <button
                                            key={goal.id}
                                            onClick={() => toggleGoal(goal.id)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all border ${formData.goals.includes(goal.id)
                                                ? 'bg-brand-blue/5 border-brand-blue text-brand-blue shadow-sm'
                                                : 'bg-white border-gray-100 text-gray-600 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className={`${formData.goals.includes(goal.id) ? 'text-brand-blue' : 'text-gray-400'}`}>
                                                {goal.icon}
                                            </div>
                                            {goal.label}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={handleCompleteSetup}
                                    className="w-full py-4 bg-brand-blue text-white rounded-2xl text-sm font-bold shadow-xl shadow-brand-blue/20 hover:bg-blue-600 transition-all flex items-center justify-center gap-2 group"
                                >
                                    Finish Setup
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        )}

                        {currentStep === 5 && (
                            <div className="text-center py-12 animate-in zoom-in duration-500">
                                <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                                    <CheckCircle size={48} />
                                </div>
                                <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">You're all set!</h1>
                                <p className="text-gray-500 text-lg">Launching your customized People Analyzer dashboard...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Illustration Area */}
            <div className="hidden lg:flex w-1/2 bg-[#FEFDF2] relative overflow-hidden items-center justify-center">
                {/* Abstract Background Shapes */}
                <div className="absolute top-20 right-20 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl" />
                <div className="absolute bottom-40 left-20 w-80 h-80 bg-green-100/30 rounded-full blur-3xl" />

                <div className="relative z-10 w-full max-w-lg p-12">
                    <img
                        src="https://img.freepik.com/free-vector/digital-marketing-team-modern-business-concept_1262-19213.jpg?w=1000"
                        alt="Illustration"
                        className="w-full h-auto drop-shadow-2xl rounded-3xl animate-in fade-in slide-in-from-right-8 duration-700"
                    />

                    <div className="mt-12 space-y-4 text-center">
                        <h2 className="text-2xl font-bold text-gray-800">Transform your People Management</h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            The EOS® People Analyzer™ is the most effective way to ensure you have the right people in the right seats.
                        </p>
                    </div>
                </div>

                {/* Floating Micro-UI elements for fluff */}
                <div className="absolute top-1/4 right-1/4 w-32 bg-white rounded-2xl shadow-xl p-4 animate-bounce duration-[3000ms]">
                    <div className="h-2 w-12 bg-gray-100 rounded-full mb-2" />
                    <div className="h-2 w-20 bg-gray-50 rounded-full" />
                </div>
                <div className="absolute bottom-1/4 left-1/4 w-40 bg-white rounded-2xl shadow-xl p-5 animate-pulse duration-[4000ms]">
                    <div className="flex gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50" />
                        <div className="flex-1 space-y-1.5">
                            <div className="h-1.5 w-12 bg-gray-100 rounded-full" />
                            <div className="h-1.5 w-full bg-gray-50 rounded-full" />
                        </div>
                    </div>
                    <div className="h-2 w-full bg-brand-blue/10 rounded-full" />
                </div>
            </div>
        </div>
    );
}
