import React from 'react';
import {
    BarChart3,
    Users,
    Settings,
    LogOut,
    UserCircle,
    ClipboardList
} from 'lucide-react';
import logo from '../assets/logo.png';

const NavItem = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${active
            ? 'bg-brand-blue/10 text-brand-blue shadow-sm shadow-brand-blue/5'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
    >
        <Icon size={20} strokeWidth={active ? 2.5 : 2} />
        <span className="font-medium text-sm">{label}</span>
    </button>
);

export const Sidebar = ({ activeTab, onTabChange }) => {
    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 flex flex-col p-6 z-10">
            <div className="flex items-center gap-3 mb-10 px-2">
                <img src={logo} alt="Incluyeme" className="h-20 object-contain" />
            </div>

            <nav className="flex-1 space-y-2">
                <NavItem
                    icon={BarChart3}
                    label="Dashboard"
                    active={activeTab === 'dashboard'}
                    onClick={() => onTabChange('dashboard')}
                />
                <NavItem
                    icon={Users}
                    label="Admin (RRHH)"
                    active={activeTab === 'admin'}
                    onClick={() => onTabChange('admin')}
                />
                <NavItem
                    icon={ClipboardList}
                    label="Evaluation"
                    active={activeTab === 'evaluation'}
                    onClick={() => onTabChange('evaluation')}
                />
                <NavItem
                    icon={Settings}
                    label="Configuration"
                    active={activeTab === 'settings'}
                    onClick={() => onTabChange('settings')}
                />
            </nav>

            <div className="mt-auto pt-6 border-t border-gray-50">
                <div className="flex items-center gap-3 px-2 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <UserCircle size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">HR Manager</p>
                        <p className="text-xs text-gray-500 truncate text-ellipsis">admin@company.com</p>
                    </div>
                </div>
                <NavItem icon={LogOut} label="Logout" active={false} onClick={() => { }} />
            </div>
        </aside>
    );
};
