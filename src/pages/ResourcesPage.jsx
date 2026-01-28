import React from 'react';
import { Link } from 'react-router-dom';
import { ResourcesView } from '../components/ResourcesView';
import PublicLayout from '../components/PublicLayout';

export default function ResourcesPage() {
    return (
        <PublicLayout>
            <div className="bg-white">
                {/* Navbar is in PublicLayout */}

                <main className="pt-24 pb-20">
                    <div className="max-w-7xl mx-auto">
                        <ResourcesView />
                    </div>
                </main>

                {/* Footer is in PublicLayout */}
            </div>
        </PublicLayout>
    );
}
