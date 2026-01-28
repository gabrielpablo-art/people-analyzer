import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './ui/Logo';
import { Button } from './ui/Button';
import { Menu, X } from 'lucide-react';

export default function PublicNavbar() {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (sectionId) => {
        setMobileMenuOpen(false);
        if (isHomePage) {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // Navigate to home and hash will be handled by browser or we can handle it manually if needed
            // Ideally we'd pass state or use a hash link
            window.location.href = `/#${sectionId}`;
        }
    };

    const navLinks = [
        { label: 'Product', action: () => scrollToSection('features') },
        { label: 'How it Works', action: () => scrollToSection('how-it-works') },
        { label: 'Pricing', action: () => scrollToSection('pricing') },
        { label: 'Resources', to: '/resources' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link to="/" onClick={() => window.scrollTo(0, 0)}>
                    <Logo iconSize="w-8 h-8" textSize="text-xl" />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                    {navLinks.map((link, i) => (
                        link.to ? (
                            <Link key={i} to={link.to} className="hover:text-brand-blue transition-colors">
                                {link.label}
                            </Link>
                        ) : (
                            <button key={i} onClick={link.action} className="hover:text-brand-blue transition-colors bg-transparent border-none cursor-pointer">
                                {link.label}
                            </button>
                        )
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <Link to="/login">
                        <Button variant="ghost" size="sm">Log In</Button>
                    </Link>
                    <Link to="/app">
                        <Button variant="primary" size="sm" className="rounded-full shadow-lg shadow-brand-blue/20">
                            Get Started
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-gray-600"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 px-6 py-6 shadow-xl flex flex-col gap-4 animate-in slide-in-from-top-4">
                    {navLinks.map((link, i) => (
                        link.to ? (
                            <Link key={i} to={link.to} className="text-lg font-medium text-gray-700 py-2" onClick={() => setMobileMenuOpen(false)}>
                                {link.label}
                            </Link>
                        ) : (
                            <button key={i} onClick={link.action} className="text-lg font-medium text-gray-700 py-2 text-left bg-transparent border-none">
                                {link.label}
                            </button>
                        )
                    ))}
                    <div className="border-t border-gray-100 my-2"></div>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-lg">Log In</Button>
                    </Link>
                    <Link to="/app" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="primary" className="w-full justify-center text-lg">Get Started</Button>
                    </Link>
                </div>
            )}
        </nav>
    );
}
