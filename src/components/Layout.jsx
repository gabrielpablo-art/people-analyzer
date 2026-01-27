
import React from 'react';
import { Sidebar } from './Sidebar';

export const Layout = ({ activeTab, onTabChange, children }) => {
    return (
        <div className="min-h-screen bg-surface-bg flex">
            <Sidebar activeTab={activeTab} onTabChange={onTabChange} />

            <main className="flex-1 ml-64 p-8 transition-all duration-300">
                <header className="mb-10 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 capitalize">
                            {activeTab === 'admin' ? 'RRHH Management' :
                                activeTab === 'accountability' ? 'Accountability Chart' :
                                    activeTab === 'feedback' ? 'Feedback Manager' :
                                        activeTab === 'team' ? 'Team Management' :
                                            activeTab}
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            {activeTab === 'dashboard' && 'Overview of your team performance and EOS bar.'}
                            {activeTab === 'admin' && 'Manage employees, hierarchy and evaluation cycles.'}
                            {activeTab === 'evaluation' && 'Complete your pending evaluations.'}
                            {activeTab === 'feedback' && 'Manage team feedback, reviews and growth.'}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-white px-4 py-2 rounded-xl text-sm font-medium text-gray-600 border border-gray-100 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                            Active Cycle: Q1 2026
                        </div>
                    </div>
                </header>

                <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </section>
            </main>
        </div>
    );
};
