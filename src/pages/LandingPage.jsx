import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/ui/Logo';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Bot, CheckCircle, TrendingUp, Users, ArrowRight, ShieldCheck } from 'lucide-react';
import Footer from '../components/Footer';
import FAQSection from '../components/FAQSection';

import PublicLayout from '../components/PublicLayout';

export default function LandingPage() {
    return (
        <PublicLayout>
            <div className="bg-white text-brand-dark font-sans selection:bg-brand-blue selection:text-white">
                {/* Navbar is now in PublicLayout */}


                {/* Hero Section */}
                <section className="pt-32 pb-20 px-6 overflow-hidden">
                    <div className="max-w-7xl mx-auto text-center relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-semibold mb-6 border border-blue-100">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-blue"></span>
                            </span>
                            New: AI-Powered Talent Calibration
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-gray-900 leading-tight">
                            Stop guessing about <br />
                            <span className="text-brand-blue relative whitespace-nowrap">
                                your team's talent
                                <svg className="absolute w-full h-3 -bottom-1 left-0 text-blue-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                                </svg>
                            </span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-500 mb-10 leading-relaxed">
                            The EOS People Analyzer developed for modern teams. Evaluate Core Values and GWC with data-driven insights, not just gut feelings.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                            <Link to="/app">
                                <Button size="lg" className="rounded-full px-8 text-lg h-14 w-full sm:w-auto">
                                    Start Analyzing Free <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Button variant="outline" size="lg" className="rounded-full px-8 text-lg h-14 w-full sm:w-auto border-gray-200">
                                Watch Demo
                            </Button>
                        </div>

                        {/* Hero Visual */}
                        <div className="relative max-w-5xl mx-auto">
                            <div className="absolute -inset-1 bg-gradient-to-r from-brand-blue to-purple-500 rounded-2xl blur opacity-20"></div>
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
                                <img
                                    src="/assets/dashboard-screenshot.png"
                                    alt="Dashboard Preview"
                                    className="w-full h-auto object-cover opacity-90 shadow-2xl rounded-2xl"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent flex items-center justify-center">
                                    <div className="bg-white/90 backdrop-blur shadow-darwin-lg border border-white/50 p-6 rounded-2xl max-w-sm text-left transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">JD</div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">Jane Doe</h4>
                                                <p className="text-xs text-gray-500">Sales Director</p>
                                            </div>
                                            <div className="ml-auto px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">Right Person</div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-medium text-gray-500">
                                                <span>Core Values</span>
                                                <span className="text-gray-900">95% Match</span>
                                            </div>
                                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                                <div className="bg-brand-blue h-full w-[95%]"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Trusted By Section */}
                <section className="py-10 border-b border-gray-100 bg-white">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-8">Trusted by innovative teams worldwide</p>
                        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            {/* Placeholder Logos */}
                            <div className="text-2xl font-bold text-gray-900 flex items-center gap-2"><div className="w-8 h-8 bg-gray-900 rounded-lg"></div>ACME Corp</div>
                            <div className="text-2xl font-bold text-gray-900 flex items-center gap-2"><div className="w-8 h-8 bg-blue-600 rounded-full"></div>GlobalTech</div>
                            <div className="text-2xl font-bold text-gray-900 flex items-center gap-2"><div className="w-8 h-8 border-4 border-gray-900 rounded-sm"></div>Nebula</div>
                            <div className="text-2xl font-bold text-gray-900 flex items-center gap-2"><div className="w-8 h-8 bg-purple-600 rotate-45 rounded-sm"></div>Vortex</div>
                            <div className="text-2xl font-bold text-gray-900 flex items-center gap-2"><div className="w-8 h-8 bg-green-500 rounded-tr-xl rounded-bl-xl"></div>EcoSystems</div>
                        </div>
                    </div>
                </section>

                {/* How it Works Section */}
                <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-transparent to-transparent opacity-50"></div>
                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">From data to decision in 4 steps</h2>
                            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                                Automate the EOS People Analyzer™ process and get back to growing your business.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-4 gap-8">
                            {[
                                { title: "Set Standards", desc: "Define Core Values and GWC roles for your organization.", step: "01" },
                                { title: "Sync Team", desc: "Import employees or invite them to self-assess.", step: "02" },
                                { title: "Analyze", desc: "Visualize talent on the 9-Box Grid automatically.", step: "03" },
                                { title: "Take Action", desc: "Generate coaching plans for 'Wrong Seat' issues.", step: "04" }
                            ].map((item, i) => (
                                <div key={i} className="relative group">
                                    <div className="text-6xl font-black text-brand-blue/20 mb-4 group-hover:text-brand-blue/40 transition-colors select-none">{item.step}</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                    <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                                    {i < 3 && <div className="hidden md:block absolute top-8 right-0 w-8 h-[2px] bg-gray-100 translate-x-1/2"></div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why use People Analyzer AI?</h2>
                            <p className="text-gray-500 text-lg">We combine the proven EOS methodology with modern interface design to make quarterly conversations painless.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={<ShieldCheck className="w-6 h-6 text-brand-blue" />}
                                title="Core Values Alignment"
                                description="Visually map your team against company values. Identify cultural fits and misfits instantly."
                            />
                            <FeatureCard
                                icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
                                title="GWC Analysis"
                                description="Get it, Want it, Capacity to do it. Track role fit over time with historical data."
                            />
                            <FeatureCard
                                icon={<Users className="w-6 h-6 text-green-600" />}
                                title="Quarterly Pulses"
                                description="Automate 5-5-5 conversations and keep a record of every coaching session."
                            />
                        </div>
                    </div>
                </section>

                {/* Resources Preview Section */}
                <section id="resources" className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                            <div className="max-w-2xl">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Latest from our Resources</h2>
                                <p className="text-gray-500 text-lg">
                                    Master organizational design and EOS methodology with our expert-curated articles.
                                </p>
                            </div>
                            <Link to="/resources">
                                <Button variant="outline" className="rounded-full px-6">
                                    View All Resources <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="group cursor-pointer">
                                <div className="aspect-video bg-gray-100 rounded-2xl mb-6 overflow-hidden border border-gray-100 group-hover:border-brand-blue/20 transition-all">
                                    <div className="w-full h-full bg-gradient-to-br from-brand-blue/5 to-purple-500/5 flex items-center justify-center">
                                        <Bot className="w-12 h-12 text-brand-blue opacity-20" />
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">Organization Design</span>
                                <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3 group-hover:text-brand-blue transition-colors">Why Accountability Charts Are Not Job Descriptions</h3>
                                <p className="text-gray-500 text-sm line-clamp-2">Organizations often mix up tools that look similar but serve very different purposes...</p>
                            </div>
                            <div className="group cursor-pointer">
                                <div className="aspect-video bg-gray-100 rounded-2xl mb-6 overflow-hidden border border-gray-100 group-hover:border-brand-blue/20 transition-all">
                                    <div className="w-full h-full bg-gradient-to-br from-purple-500/5 to-brand-blue/5 flex items-center justify-center">
                                        <Users className="w-12 h-12 text-purple-500 opacity-20" />
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">Leadership</span>
                                <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3 group-hover:text-brand-blue transition-colors">Seats, Not People: The EOS Way</h3>
                                <p className="text-gray-500 text-sm line-clamp-2">Design your organization around seats (outcome bundles) rather than individuals...</p>
                            </div>
                            <div className="group cursor-pointer">
                                <div className="aspect-video bg-gray-100 rounded-2xl mb-6 overflow-hidden border border-gray-100 group-hover:border-brand-blue/20 transition-all">
                                    <div className="w-full h-full bg-gradient-to-br from-green-500/5 to-brand-blue/5 flex items-center justify-center">
                                        <TrendingUp className="w-12 h-12 text-green-500 opacity-20" />
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">HR Management</span>
                                <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3 group-hover:text-brand-blue transition-colors">Working Best Together</h3>
                                <p className="text-gray-500 text-sm line-clamp-2">How EOS Accountability Charts and Job Specs can be integrated for maximum impact...</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="py-24 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
                            <p className="text-gray-500 text-lg">Start free, scale as your team grows.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {/* Starter Plan */}
                            <Card className="p-8 border border-gray-100 hover:border-brand-blue/30 transition-all hover:shadow-darwin-lg relative bg-white">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Starter</h3>
                                <p className="text-gray-500 text-sm mb-6">For small teams getting started.</p>
                                <div className="flex items-baseline mb-6">
                                    <span className="text-4xl font-extrabold text-gray-900">$50</span>
                                    <span className="text-gray-500 ml-2">/month</span>
                                </div>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center gap-3 text-sm text-gray-600">
                                        <CheckCircle className="w-5 h-5 text-brand-blue flex-shrink-0" /> Up to 10 Employees
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-gray-600">
                                        <CheckCircle className="w-5 h-5 text-brand-blue flex-shrink-0" /> Core Values Assessment
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-gray-600">
                                        <CheckCircle className="w-5 h-5 text-brand-blue flex-shrink-0" /> Basic GWC Analysis
                                    </li>
                                </ul>
                                <Link to="/checkout?plan=Starter">
                                    <Button variant="outline" className="w-full font-bold">Start Free Trial</Button>
                                </Link>
                            </Card>

                            {/* Growth Plan */}
                            <Card className="p-8 border-2 border-brand-blue shadow-darwin-lg relative transform md:-translate-y-4 bg-white">
                                <div className="absolute top-0 right-0 bg-brand-blue text-white text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Growth</h3>
                                <p className="text-gray-500 text-sm mb-6">For expanding organizations.</p>
                                <div className="flex items-baseline mb-6">
                                    <span className="text-4xl font-extrabold text-gray-900">$150</span>
                                    <span className="text-gray-500 ml-2">/month</span>
                                </div>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center gap-3 text-sm text-gray-600">
                                        <CheckCircle className="w-5 h-5 text-brand-blue flex-shrink-0" /> Up to 50 Employees
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-gray-600">
                                        <CheckCircle className="w-5 h-5 text-brand-blue flex-shrink-0" /> Historical Trending
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-gray-600">
                                        <CheckCircle className="w-5 h-5 text-brand-blue flex-shrink-0" /> Advanced Filtering
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-gray-600">
                                        <CheckCircle className="w-5 h-5 text-brand-blue flex-shrink-0" /> Email Support
                                    </li>
                                </ul>
                                <Link to="/checkout?plan=Growth">
                                    <Button variant="primary" className="w-full font-bold shadow-lg shadow-blue-500/20">Get Started</Button>
                                </Link>
                            </Card>

                            {/* Business Plan */}
                            <Card className="p-8 border border-gray-100 hover:border-brand-blue/30 transition-all hover:shadow-darwin-lg bg-white">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Business</h3>
                                <p className="text-gray-500 text-sm mb-6">For established companies.</p>
                                <div className="flex items-baseline mb-6">
                                    <span className="text-4xl font-extrabold text-gray-900">Custom</span>
                                </div>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center gap-3 text-sm text-gray-600">
                                        <CheckCircle className="w-5 h-5 text-brand-blue flex-shrink-0" /> Unlimited Employees
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-gray-600">
                                        <CheckCircle className="w-5 h-5 text-brand-blue flex-shrink-0" /> Dedicated Success Manager
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-gray-600">
                                        <CheckCircle className="w-5 h-5 text-brand-blue flex-shrink-0" /> API Access
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-gray-600">
                                        <CheckCircle className="w-5 h-5 text-brand-blue flex-shrink-0" /> SSO / SAML
                                    </li>
                                </ul>
                                <Button variant="outline" className="w-full font-bold" onClick={() => window.location.href = 'mailto:sales@peopleanalyzer.ai'}>Contact Sales</Button>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <FAQSection />

                {/* Footer is now in PublicLayout */}
            </div>
        </PublicLayout>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <Card className="hover:shadow-darwin-lg transition-shadow duration-300 border-none shadow-darwin p-6">
            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-6">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-500 leading-relaxed">{description}</p>
        </Card>
    );
}
