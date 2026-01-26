import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ResourcesView } from '../components/ResourcesView';
import Logo from '../components/ui/Logo';
import { Button } from '../components/ui/Button';

export default function ResourcesPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/">
                        <Logo iconSize="w-8 h-8" textSize="text-xl" />
                    </Link>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                        <Link to="/" className="hover:text-brand-blue transition-colors">Product</Link>
                        <Link to="/" className="hover:text-brand-blue transition-colors">How it Works</Link>
                        <Link to="/" className="hover:text-brand-blue transition-colors">Pricing</Link>
                        <Link to="/resources" className="text-brand-blue transition-colors">Resources</Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login">
                            <Button variant="ghost" size="sm">Log In</Button>
                        </Link>
                        <Link to="/app">
                            <Button variant="primary" size="sm">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="pt-24 pb-20">
                <div className="max-w-7xl mx-auto">
                    <ResourcesView />
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <Link to="/">
                        <Logo iconSize="w-6 h-6" textSize="text-base" />
                    </Link>
                    <div className="text-sm text-gray-500">
                        © 2026 People Analyzer. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
