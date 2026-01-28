
import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import NotificationBell, { NotificationPanel } from './NotificationBell';
import ThemeToggle from './ThemeToggle';
import { notificationService } from '../services/notificationService';

export const Layout = ({ activeTab, onTabChange, children, companyDetails }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    // Load current user from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem('currentUser');
            if (stored && stored !== 'undefined') {
                setCurrentUser(JSON.parse(stored));
            }
        } catch (e) {
            console.error("Error loading user:", e);
        }
    }, []);

    // Subscribe to notifications
    useEffect(() => {
        if (!currentUser?.uid || !currentUser?.organizationId) return;

        const unsubscribe = notificationService.subscribe(
            currentUser.organizationId,
            currentUser.uid,
            (data) => {
                setNotifications(data);
            }
        );

        return () => unsubscribe();
    }, [currentUser]);

    const handleMarkAsRead = async (notificationId) => {
        try {
            await notificationService.markAsRead(notificationId);
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        if (!currentUser?.uid || !currentUser?.organizationId) return;
        try {
            await notificationService.markAllAsRead(currentUser.organizationId, currentUser.uid);
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="min-h-screen bg-surface-bg dark:bg-gray-900 flex">
            <Sidebar activeTab={activeTab} onTabChange={onTabChange} companyDetails={companyDetails} />

            <main className="flex-1 ml-64 p-8 transition-all duration-300">
                <header className="mb-10 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 capitalize flex items-center gap-3">
                            {activeTab === 'dashboard' && companyDetails?.logoUrl && (
                                <img
                                    src={companyDetails.logoUrl}
                                    alt="Company Logo"
                                    className="w-10 h-10 object-contain"
                                />
                            )}
                            {activeTab === 'admin' ? 'Team Management' :
                                activeTab === 'accountability' ? 'Accountability Chart' :
                                    activeTab === 'feedback' ? 'Feedback Manager' :
                                        activeTab === 'team' ? 'Team Management' :
                                            activeTab}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                            {activeTab === 'dashboard' && 'Overview of your team performance and EOS bar.'}
                            {activeTab === 'admin' && 'Manage your team structure and members.'}
                            {activeTab === 'evaluation' && 'Complete your pending evaluations.'}
                            {activeTab === 'feedback' && 'Manage team feedback, reviews and growth.'}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                            Active Cycle: Q1 2026
                        </div>

                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* Notification Bell */}
                        <div className="relative">
                            <NotificationBell
                                count={unreadCount}
                                onClick={() => setShowNotifications(!showNotifications)}
                            />
                            <NotificationPanel
                                isOpen={showNotifications}
                                onClose={() => setShowNotifications(false)}
                                notifications={notifications}
                                onMarkAsRead={handleMarkAsRead}
                                onMarkAllAsRead={handleMarkAllAsRead}
                            />
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

