import React from 'react';
import PublicNavbar from './PublicNavbar';
import Footer from './Footer';

export default function PublicLayout({ children, showNavbar = true, showFooter = true }) {
    return (
        <div className="min-h-screen flex flex-col bg-white font-sans text-brand-dark selection:bg-brand-blue selection:text-white">
            {showNavbar && <PublicNavbar />}
            <main className="flex-grow">
                {children}
            </main>
            {showFooter && <Footer />}
        </div>
    );
}
