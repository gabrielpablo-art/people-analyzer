import React, { useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { industriesData } from '../data/industriesData';
import PublicLayout from '../components/PublicLayout';
import { Button } from '../components/ui/Button';
import { ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

export default function IndustryPage() {
    const { industryId } = useParams();
    const data = industriesData[industryId];

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [industryId]);

    // If industry not found, redirect to home
    if (!data) {
        return <Navigate to="/" replace />;
    }

    return (
        <PublicLayout>
            <div className="min-h-screen bg-white font-sans text-brand-dark">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-brand-dark text-white">
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src={data.heroImage}
                            alt={data.title}
                            className="w-full h-full object-cover opacity-20"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark to-transparent"></div>
                    </div>

                    <div className="max-w-7xl mx-auto relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold mb-6 border border-white/20 uppercase tracking-widest">
                            {industryId.replace('-', ' ')}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                            {data.title}
                        </h1>
                        <p className="max-w-2xl mx-auto text-xl text-gray-300 mb-10">
                            {data.subtitle}
                        </p>
                        <Link to="/app">
                            <Button size="lg" className="bg-brand-blue hover:bg-blue-600 text-white border-none rounded-full px-8 h-14 text-lg">
                                Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* Challenges Section */}
                <section className="py-24 px-6 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row gap-16 items-center">
                            <div className="flex-1">
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Common Challenges in {industryId.replace('-', ' ')}</h2>
                                <p className="text-gray-500 text-lg mb-8">
                                    Every industry has its unique friction points. Do any of these sound familiar to your team?
                                </p>
                                <div className="space-y-6">
                                    {data.challenges.map((challenge, index) => (
                                        <div key={index} className="flex gap-4 p-4 rounded-xl bg-red-50 border border-red-100 items-start">
                                            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                                            <p className="text-gray-700 font-medium">{challenge}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex-1 h-96 bg-gray-100 rounded-3xl overflow-hidden relative">
                                {/* Abstract Visual Representation of Chaos/Challenge */}
                                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 flex items-center justify-center">
                                    <div className="text-center p-8">
                                        <div className="text-6xl font-bold text-gray-200 mb-4">?</div>
                                        <p className="text-gray-400 font-medium">Is your team aligned?</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Solution/Benefits Section */}
                <section className="py-24 px-6 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">How People Analyzer Helps</h2>
                            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                                Turn your personnel challenges into your competitive advantage.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {data.benefits.map((benefit, index) => (
                                <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {index === 0 ? "Right People" : index === 1 ? "Right Seats" : "Clear Vision"}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {benefit}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-20 px-6 bg-white text-center">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to transform your {industryId.replace('-', ' ')} business?</h2>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/app">
                                <Button size="lg" className="px-8 rounded-full h-14">
                                    Start Free Trial
                                </Button>
                            </Link>
                            <Link to="/contact">
                                <Button variant="outline" size="lg" className="px-8 rounded-full h-14">
                                    Schedule a Demo
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer is in PublicLayout */}
            </div>
        </PublicLayout>
    );
}
