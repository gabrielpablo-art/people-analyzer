import React, { useState } from 'react';
import { MainNav } from '../components/MainNav';
import Footer from '../components/Footer';
import { ChevronDown, ChevronUp, Mail, MessageSquare, Phone, Send } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function HelpCenterPage() {
    const [openIndex, setOpenIndex] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setSubmitted(true);
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
        });

        // Reset success message after 5 seconds
        setTimeout(() => setSubmitted(false), 5000);
    };

    const faqs = [
        {
            category: "General",
            questions: [
                {
                    q: "What is People Analyzer?",
                    a: "People Analyzer is a comprehensive tool designed for EOS® (Entrepreneurial Operating System) companies to evaluate their team members based on Core Values and GWC™ (Get it, Want it, Capacity to do it)."
                },
                {
                    q: "Is my data secure?",
                    a: "Yes, we prioritize data security. All data is encrypted in transit and at rest, and we follow industry best practices to ensure your organization's sensitive information remains protected."
                }
            ]
        },
        {
            category: "Evaluations",
            questions: [
                {
                    q: "How often should I run evaluations?",
                    a: "While it depends on your organization's rhythm, most EOS® companies conduct People Analysis quarterly (every 90 days) ideally before Quarterly Planning sessions."
                },
                {
                    q: "Can employees see their own evaluations?",
                    a: "This depends on your organization's settings. Typically, evaluations are discussed in one-on-one sessions, but administrators can configure visibility permissions."
                },
                {
                    q: "What happens if I make a mistake on an evaluation?",
                    a: "Administrators and the original evaluator can edit evaluations within a certain timeframe after submission. Navigate to the employee's profile to view and edit recent evaluations."
                }
            ]
        },
        {
            category: "Account & Billing",
            questions: [
                {
                    q: "How do I add new users?",
                    a: "Administrators can add new users from the 'Team Management' tab in the dashboard. You can add users individually or bulk import them via CSV."
                },
                {
                    q: "What payment methods do you accept?",
                    a: "We accept all major credit cards (Visa, Mastercard, American Express, Discover) for subscription payments."
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <MainNav />

            {/* Hero Section */}
            <div className="bg-[#0B1C33] text-white pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">How can we help you?</h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Find answers to common questions or reach out to our support team for assistance.
                    </p>
                </div>
            </div>

            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                        {/* FAQ Section */}
                        <div className="lg:col-span-7 space-y-12">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>

                                <div className="space-y-8">
                                    {faqs.map((category, catIndex) => (
                                        <div key={catIndex} className="bg-gray-50 rounded-2xl p-6 md:p-8">
                                            <h3 className="text-xl font-bold text-[#0B1C33] mb-6">{category.category}</h3>
                                            <div className="space-y-4">
                                                {category.questions.map((item, qIndex) => {
                                                    const globalIndex = `${catIndex}-${qIndex}`;
                                                    const isOpen = openIndex === globalIndex;

                                                    return (
                                                        <div key={qIndex} className="bg-white rounded-xl border border-gray-100 overflow-hidden transition-all duration-200">
                                                            <button
                                                                onClick={() => toggleFaq(globalIndex)}
                                                                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                                                            >
                                                                <span className="font-semibold text-gray-900 pr-8">{item.q}</span>
                                                                {isOpen ?
                                                                    <ChevronUp className="w-5 h-5 text-brand-blue flex-shrink-0" /> :
                                                                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                                                }
                                                            </button>

                                                            <div
                                                                className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                                                    }`}
                                                            >
                                                                <div className="p-5 pt-0 text-gray-600 leading-relaxed border-t border-gray-50">
                                                                    {item.a}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Contact Form Section */}
                        <div className="lg:col-span-5">
                            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 sticky top-24">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Support</h2>
                                <p className="text-gray-500 mb-8">Can't find what you're looking for? Send a message.</p>

                                {submitted ? (
                                    <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center animate-in fade-in duration-500">
                                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Send className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-lg font-bold text-green-800 mb-2">Message Sent!</h3>
                                        <p className="text-green-700">Thank you for contacting us. We'll get back to you shortly.</p>
                                        <button
                                            onClick={() => setSubmitted(false)}
                                            className="mt-6 text-sm font-semibold text-green-700 hover:text-green-800 underline"
                                        >
                                            Send another message
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    required
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">Email</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all"
                                                    placeholder="john@company.com"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Subject</label>
                                            <select
                                                name="subject"
                                                required
                                                value={formData.subject}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all bg-white"
                                            >
                                                <option value="">Select a topic...</option>
                                                <option value="General Inquiry">General Inquiry</option>
                                                <option value="Technical Support">Technical Support</option>
                                                <option value="Billing">Billing & Subscription</option>
                                                <option value="Feature Request">Feature Request</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Message</label>
                                            <textarea
                                                name="message"
                                                required
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                rows="4"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all resize-none"
                                                placeholder="How can we help you?"
                                            />
                                        </div>

                                        <Button
                                            variant="primary"
                                            disabled={isSubmitting}
                                            className="w-full py-4 text-base rounded-xl shadow-lg shadow-brand-blue/20"
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Sending...
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    Send Message <Send className="w-4 h-4" />
                                                </span>
                                            )}
                                        </Button>
                                    </form>
                                )}

                                <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-2 gap-4">
                                    <a href="mailto:support@peopleanalyzer.com" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                                        <div className="w-10 h-10 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</p>
                                            <p className="text-sm font-medium text-gray-900">support@peopleanalyzer.com</p>
                                        </div>
                                    </a>
                                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-not-allowed opacity-60">
                                        <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
                                            <MessageSquare className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Live Chat</p>
                                            <p className="text-sm font-medium text-gray-900">Coming Soon</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
