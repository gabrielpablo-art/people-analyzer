import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './ui/Logo';
import { Button } from './ui/Button';
import { Linkedin, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
                    {/* Brand Column - takes 2 cols on large screens */}
                    <div className="lg:col-span-2 space-y-6">
                        <Link to="/">
                            <Logo iconSize="w-8 h-8" textSize="text-xl" />
                        </Link>
                        <p className="text-gray-500 leading-relaxed max-w-sm">
                            The EOS People Analyzer developed for modern teams. Evaluate Core Values and GWC with data-driven insights.
                        </p>
                        <div className="pt-2">
                            <Link to="/app">
                                <Button variant="primary" className="rounded-full px-6">
                                    Try People Analyzer
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Site Map */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Site Map</h4>
                        <ul className="space-y-3">
                            <li><Link to="/" className="text-gray-500 hover:text-brand-blue transition-colors text-sm">Home</Link></li>
                            <li><a href="#" className="text-gray-500 hover:text-brand-blue transition-colors text-sm">Partners</a></li>
                            <li><Link to="/success-stories" className="text-gray-500 hover:text-brand-blue transition-colors text-sm">Success Stories</Link></li>
                        </ul>
                    </div>
                    {/* Resources */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Resources</h4>
                        <ul className="space-y-3">
                            <li><Link to="/resources" className="text-gray-500 hover:text-brand-blue transition-colors text-sm">Resources & Learning</Link></li>
                            <li><Link to="/help-center" className="text-gray-500 hover:text-brand-blue transition-colors text-sm">Help Center</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Legal</h4>
                        <ul className="space-y-3">
                            <li><Link to="/privacy-policy" className="text-gray-500 hover:text-brand-blue transition-colors text-sm">Privacy Policy</Link></li>
                            <li><Link to="/terms-of-use" className="text-gray-500 hover:text-brand-blue transition-colors text-sm">Terms of Use</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6">
                        {[Linkedin, Instagram, Twitter, Youtube].map((Icon, i) => (
                            <a key={i} href="#" className="text-gray-400 hover:text-brand-blue transition-colors">
                                <Icon className="w-5 h-5" />
                            </a>
                        ))}
                    </div>
                    <div className="text-sm text-gray-500">
                        © {new Date().getFullYear()} PeopleAnalyzer. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}
