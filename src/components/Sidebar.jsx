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
            ? 'bg-brand-blue/10 text-brand-blue shadow-sm shadow-brand-blue/5'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
    >
        <Icon size={20} strokeWidth={active ? 2.5 : 2} />
        <span className="font-medium text-sm">{label}</span>
    </button>
);

export const Sidebar = ({ activeTab, onTabChange }) => {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userName = currentUser.name || 'HR Manager';
    const userEmail = currentUser.email || 'admin@company.com';
    const userAvatar = currentUser.avatar;

    const handleLogout = () => {
        // Clear session
        localStorage.removeItem('currentUser');
        navigate('/');
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 flex flex-col p-6 z-30">
            <div className="flex items-center gap-3 mb-10 px-2">
                <Logo iconSize="w-8 h-8" textSize="text-lg" />
            </div>

            <nav className="flex-1 space-y-2">
                <NavItem
                    icon={BarChart3}
                    label="Dashboard"
                    active={activeTab === 'dashboard'}
                    onClick={() => onTabChange('dashboard')}
                />

                {hasPermission(currentUser, PERMISSIONS.MANAGE_EMPLOYEES) && (
                    <NavItem
                        icon={Users}
                        label="Admin (RRHH)"
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

            <div className="mt-auto pt-6 border-t border-gray-50">
                <button
                    onClick={() => navigate('/profile')}
                    className="flex items-center gap-3 px-2 mb-6 w-full text-left hover:bg-gray-50 p-2 rounded-lg transition-colors group"
                >
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden border border-gray-100 group-hover:border-brand-blue/30 transition-colors">
                        {userAvatar ? (
                            <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <UserCircle size={24} />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-brand-blue transition-colors">{userName}</p>
                        <p className="text-xs text-gray-500 truncate text-ellipsis">{userEmail}</p>
                    </div>
                </button>
                <NavItem icon={LogOut} label="Logout" active={false} onClick={handleLogout} />
            </div>
        </aside>
    );
};
