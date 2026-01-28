import React from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowRight, Star, TrendingUp, Users, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import CarlosImg from '../assets/testimonials/carlos-nunez.png';
import SofiaImg from '../assets/testimonials/sofia-vergara.png';
import RobertoImg from '../assets/testimonials/roberto-silva.png';
import DrJamesImg from '../assets/testimonials/james-west.png';
import MarianaImg from '../assets/testimonials/mariana-lopez.png';
import BillImg from '../assets/testimonials/bill-henderson.png';

export default function SuccessStoriesPage() {
    return (
        <PublicLayout>
            <div className="min-h-screen bg-gray-50 font-sans text-brand-dark">
                {/* Hero Section */}
                <section className="bg-brand-dark text-white pt-32 pb-20 px-6">
                    <div className="max-w-7xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold mb-6 border border-white/20">
                            SMB Case Studies
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                            Real SMBs, Real Growth.
                        </h1>
                        <p className="max-w-2xl mx-auto text-xl text-gray-300 mb-10">
                            See how small business owners across the Americas are building autonomous teams and regaining their freedom.
                        </p>
                    </div>
                </section>

                {/* Metrics Section */}
                <section className="py-12 bg-white border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <div className="p-6">
                                <div className="text-4xl font-extrabold text-brand-blue mb-2">20hrs+</div>
                                <p className="text-gray-500 font-medium">Saved per week for Owners</p>
                            </div>
                            <div className="p-6 border-l border-r border-gray-100">
                                <div className="text-4xl font-extrabold text-brand-blue mb-2">40%</div>
                                <p className="text-gray-500 font-medium">Reduction in Hiring Mistakes</p>
                            </div>
                            <div className="p-6">
                                <div className="text-4xl font-extrabold text-brand-blue mb-2">100%</div>
                                <p className="text-gray-500 font-medium">Clarity on Roles (GWC)</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stories Grid */}
                <section className="py-24 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Story 1 */}
                            <SuccessCard
                                image={CarlosImg}
                                company="FastTrack Logistics"
                                location="Miami, FL"
                                industry="Logistics & Transport"
                                metric="Expanded to 3 new states smoothly"
                                quote="I was the bottleneck. People Analyzer showed me exactly who on my team was ready to step up and lead the new branches. I finally stopped driving the truck and started driving the business."
                                author="Carlos Nuñez, Owner"
                            />
                            {/* Story 2 */}
                            <SuccessCard
                                image={SofiaImg}
                                company="DevSquad Latam"
                                location="Mexico City, MX"
                                industry="Software Development"
                                metric="Synced culture across borders"
                                quote="We grew from 10 to 50 devs in a year. The tool was essential to ensure our new hires in Argentina and Colombia shared the same values as our HQ in Mexico."
                                author="Sofia Vergara, Founder & CEO"
                            />
                            {/* Story 3 */}
                            <SuccessCard
                                image={RobertoImg}
                                company="Constructora Silva"
                                location="São Paulo, BR"
                                industry="Construction / Family Business"
                                metric="Professionalized management team"
                                quote="Working with family is hard. The objective data from the quarterly pulses took the emotion out of our difficult conversations. My brother finally found the right seat where he excels."
                                author="Roberto Silva, Director"
                            />
                            {/* Story 4 */}
                            <SuccessCard
                                image={DrJamesImg}
                                company="Smile Bright Dental Group"
                                location="Austin, TX"
                                industry="Healthcare"
                                metric="Unified 4 clinic locations"
                                quote="We bought three small practices. Integrating the staff was a nightmare until we used this to set a clear standard. We kept the best people and aligned everyone on patient care."
                                author="Dr. James West, Partner"
                            />
                            {/* Story 5 */}
                            <SuccessCard
                                image={MarianaImg}
                                company="Andes Marketing"
                                location="Bogotá, CO"
                                industry="Digital Agency"
                                metric="Reduced creative burnout"
                                quote="We discovered our best designers were drowning in admin work they hated (Capacity). shifts roles around based on the GWC analysis and productivity skyrocketed."
                                author="Mariana Lopez, Creative Director"
                            />
                            {/* Story 6 */}
                            <SuccessCard
                                image={BillImg}
                                company="Valley Fresh Markets"
                                location="Modesto, CA"
                                industry="Retail Chain"
                                metric="Retained top seasonal managers"
                                quote="In retail, turnover is a killer. Identifying the managers who truly 'Want It' helped us invest in the right people. Our seasonal retention is the highest it has ever been."
                                author="Bill Henderson, General Manager"
                            />
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-brand-blue text-white text-center">
                    <div className="max-w-4xl mx-auto px-6">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Stop Working IN Your Business, Start Working ON It.</h2>
                        <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
                            Join thousands of SMB owners who have built self-managing teams.
                        </p>
                        <Link to="/app">
                            <Button size="lg" className="bg-white text-brand-blue hover:bg-blue-50 rounded-full px-8 h-14 text-lg border-none">
                                Start Analyzing Your Team <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* Footer is in PublicLayout */}
            </div>
        </PublicLayout>
    );
}

function SuccessCard({ image, company, location, industry, metric, quote, author }) {
    return (
        <Card className="hover:shadow-xl transition-all duration-300 border-gray-100 h-full flex flex-col">
            <CardContent className="p-8 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        <Target className="w-4 h-4 text-brand-blue" />
                        {industry}
                    </div>
                    <div className="text-xs text-brand-blue bg-blue-50 px-2 py-1 rounded-full font-semibold">
                        {location}
                    </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{company}</h3>
                <div className="flex items-start gap-3 mb-6">
                    <TrendingUp className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <p className="text-green-700 font-medium text-sm">{metric}</p>
                </div>
                <blockquote className="text-gray-600 italic mb-6 flex-grow text-sm leading-relaxed">
                    "{quote}"
                </blockquote>
                <div className="flex items-center gap-3 mt-auto pt-6 border-t border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center font-bold text-white text-xs overflow-hidden">
                        {image ? (
                            <img src={image} alt={author} className="w-full h-full object-cover" />
                        ) : (
                            author.split(' ').map(n => n[0]).join('')
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900">{author.split(',')[0]}</p>
                        <p className="text-xs text-gray-500">{author.split(',')[1]}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
