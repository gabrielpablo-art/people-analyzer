import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BarChart3,
    Users,
    Settings,
    LogOut,
    UserCircle,
    ClipboardList,
    Network,
    BookOpen,
    MessageSquare
} from 'lucide-react';
import logo from '../assets/logo.png';
import Logo from './ui/Logo';
import { hasPermission, PERMISSIONS } from '../utils/permissions';

const NavItem = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${active
            ? 'bg-brand-blue/10 text-brand-blue shadow-sm shadow-brand-blue/5 dark:bg-brand-blue/20'
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
    >
        <Icon size={20} strokeWidth={active ? 2.5 : 2} />
        <span className="font-medium text-sm">{label}</span>
    </button>
);

export const Sidebar = ({ activeTab, onTabChange, companyDetails }) => {
    const navigate = useNavigate();

    // Use state for user data to trigger re-renders
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const stored = localStorage.getItem('currentUser');
            if (!stored || stored === 'undefined') return {};
            return JSON.parse(stored);
        } catch (e) {
            return {};
        }
    });

    useEffect(() => {
        const handleStorageChange = () => {
            try {
                const stored = localStorage.getItem('currentUser');
                if (stored && stored !== 'undefined') {
                    setCurrentUser(JSON.parse(stored));
                }
            } catch (e) {
                console.error("Error parsing user from storage", e);
            }
        };

        // Listen for both native storage events (cross-tab) and custom events (same-tab)
        window.addEventListener('storage', handleStorageChange);
        // Custom event for same-tab updates not triggered by native storage event
        // Note: dispatchEvent(new Event('storage')) in ProfilePage works, but let's be safe

        // Also a custom interval check fallback just in case
        const interval = setInterval(handleStorageChange, 2000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    const userName = currentUser.name || 'HR Manager';
    const userEmail = currentUser.email || 'admin@company.com';
    const userAvatar = currentUser.avatar || currentUser.photoURL;

    const handleLogout = () => {
        // Clear session
        localStorage.removeItem('currentUser');
        navigate('/');
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col p-6 z-30 transition-colors duration-200">
            <div className="flex items-center gap-3 mb-10 px-2">
                <Logo
                    iconSize={companyDetails?.logoUrl ? "w-12 h-12" : "w-8 h-8"}
                    textSize="text-lg"
                    customLogoUrl={companyDetails?.logoUrl}
                />
            </div>

            <nav className="flex-1 space-y-2">
                <NavItem
                    icon={BarChart3}
                    label="Dashboard"
                    active={activeTab === 'dashboard'}
                    onClick={() => onTabChange('dashboard')}
                />

                {(hasPermission(currentUser, PERMISSIONS.VIEW_USERS) || hasPermission(currentUser, PERMISSIONS.MANAGE_EMPLOYEES)) && (
                    <NavItem
                        icon={Users}
                        label="Team Management"
                        active={activeTab === 'admin'}
                        onClick={() => onTabChange('admin')}
                    />
                )}

                <NavItem
                    icon={MessageSquare}
                    label="Feedback (Manager)"
                    active={activeTab === 'feedback'}
                    onClick={() => onTabChange('feedback')}
                />

                <NavItem
                    icon={ClipboardList}
                    label="Evaluation"
                    active={activeTab === 'evaluation'}
                    onClick={() => onTabChange('evaluation')}
                />

                {hasPermission(currentUser, PERMISSIONS.MANAGE_ACCOUNTABILITY_CHART) && (
                    <NavItem
                        icon={Network}
                        label="Accountability Chart"
                        active={activeTab === 'accountability'}
                        onClick={() => onTabChange('accountability')}
                    />
                )}

                <NavItem
                    icon={BookOpen}
                    label="Resources"
                    active={activeTab === 'resources'}
                    onClick={() => onTabChange('resources')}
                />

                {hasPermission(currentUser, PERMISSIONS.MANAGE_CORE_VALUES) && (
                    <NavItem
                        icon={Settings}
                        label="Configuration"
                        active={activeTab === 'settings'}
                        onClick={() => onTabChange('settings')}
                    />
                )}
            </nav>

            <div className="mt-auto pt-6 border-t border-gray-50 dark:border-gray-800">
                <button
                    onClick={() => navigate('/profile')}
                    className="flex items-center gap-3 px-2 mb-6 w-full text-left hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors group"
                >
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-300 overflow-hidden border border-gray-100 dark:border-gray-700 group-hover:border-brand-blue/30 transition-colors">
                        {userAvatar ? (
                            <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <UserCircle size={24} />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-brand-blue transition-colors">{userName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate text-ellipsis">{userEmail}</p>
                    </div>
                </button>
                <NavItem icon={LogOut} label="Logout" active={false} onClick={handleLogout} />
            </div>
        </aside>
    );
};
