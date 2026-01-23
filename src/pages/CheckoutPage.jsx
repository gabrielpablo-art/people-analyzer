import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Shield, CreditCard, ArrowRight, Lock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export default function CheckoutPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const planId = searchParams.get('plan') || 'starter';

    // Mock Plan Data
    const plans = {
        starter: { name: 'Starter Plan', price: 50, period: '/month', features: ['Up to 10 Employees', 'Core Values Assessment'] },
        growth: { name: 'Growth Plan', price: 150, period: '/month', features: ['Up to 50 Employees', 'Historical Trending'] },
        business: { name: 'Business Plan', price: 0, period: '(Custom)', features: ['Unlimited Employees', 'API Access'] }
    };

    const selectedPlan = plans[planId] || plans.starter;

    const handleCheckout = (e) => {
        e.preventDefault();
        // Here you would integrate Stripe
        // const stripe = await stripePromise;
        // await stripe.redirectToCheckout({ ... });
        alert("This is where Stripe Checkout would launch!\n\nPlan: " + selectedPlan.name);
        navigate('/app');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900">Complete your secure checkout</h1>
                    <p className="mt-2 text-gray-500">You are just one step away from analyzing your team.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Account Details */}
                        <Card className="bg-white p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center text-xs">1</div>
                                Account Details
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input type="email" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none" placeholder="you@company.com" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <input type="password" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none" placeholder="Create a secure password" />
                                </div>
                            </div>
                        </Card>

                        {/* Payment Method (Mock) */}
                        <Card className="bg-white p-6 shadow-sm border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
                                <Lock size={12} /> SSL Secure
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center text-xs">2</div>
                                Payment Info
                            </h3>

                            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 mb-4">
                                <p className="text-sm text-gray-500 mb-3">This is a secure checkout placeholder. In production, Stripe Elements will load here.</p>
                                <div className="animate-pulse space-y-3">
                                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="h-10 bg-gray-200 rounded w-full"></div>
                                        <div className="h-10 bg-gray-200 rounded w-full"></div>
                                    </div>
                                </div>
                            </div>

                            <Button onClick={handleCheckout} size="lg" className="w-full text-lg shadow-xl shadow-brand-blue/20">
                                Pay ${selectedPlan.price} & Start Trial <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                            <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                                <Shield size={12} /> Powered by Stripe. Cancel anytime.
                            </p>
                        </Card>
                    </div>

                    {/* Order Summary */}
                    <div className="md:col-span-1">
                        <Card className="bg-white p-6 shadow-lg border border-gray-100 sticky top-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>

                            <div className="flex justify-between items-start pb-6 border-b border-gray-100">
                                <div>
                                    <h4 className="font-bold text-gray-900">{selectedPlan.name}</h4>
                                    <p className="text-sm text-gray-500">Billed monthly</p>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-xl">${selectedPlan.price}</span>
                                    <span className="text-xs text-gray-500">{selectedPlan.period}</span>
                                </div>
                            </div>

                            <div className="py-6 space-y-3 border-b border-gray-100">
                                {selectedPlan.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                        <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 flex justify-between items-center font-bold text-lg text-gray-900">
                                <span>Total due today</span>
                                <span>${selectedPlan.price}</span>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
