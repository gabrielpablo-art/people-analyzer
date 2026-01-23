import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    CreditCard,
    Shield,
    Search,
    MoreVertical,
    LogIn,
    Key,
    AlertCircle,
    CheckCircle,
    XCircle,
    Clock,
    Mail,
    Settings,
    LayoutDashboard,
    Activity,
    Save,
    Plus,
    Edit2,
    Trash2,
    Eye,
    Server,
    FileText,
    Building2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function SuperAdminPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({ total: 0, paying: 0, trials: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const [showUserModal, setShowUserModal] = useState(false);
    const [userForm, setUserForm] = useState({ id: '', name: '', email: '', password: '', role: 'admin', plan: 'free', status: 'active', company: '' });

    // Auth Gate
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [masterPassword, setMasterPassword] = useState('');
    const [authError, setAuthError] = useState(false);

    // Email Settings State
    const [emailSettings, setEmailSettings] = useState({
        smtpServer: 'smtp.sendgrid.net',
        smtpPort: '587',
        smtpUser: 'apikey',
        encryption: 'TLS',
        fromName: 'People Analyzer',
        fromEmail: 'noreply@peopleanalyzer.com',
        welcomeTemplate: 'Hi {{name}},\n\nWelcome to People Analyzer! We are excited to have you on board.',
        inviteTemplate: 'You have been invited to join {{company}} on People Analyzer.\n\nClick here to join: {{link}}'
    });

    // Site Settings State
    const [siteSettings, setSiteSettings] = useState({
        siteTitle: 'People Analyzer Pro',
        maintenanceMode: false,
        allowRegistration: true,
        trialDuration: 14
    });

    useEffect(() => {
        if (isAuthenticated) {
            loadAllData();
        }
    }, [isAuthenticated]);

    const loadAllData = () => {
        loadUsers();
        const savedEmail = localStorage.getItem('admin_email_settings');
        if (savedEmail) setEmailSettings(JSON.parse(savedEmail));
        const savedSite = localStorage.getItem('admin_site_settings');
        if (savedSite) setSiteSettings(JSON.parse(savedSite));
    };

    const loadUsers = () => {
        const usersJSON = localStorage.getItem('users');
        let loadedUsers = [];
        if (usersJSON) {
            try {
                loadedUsers = JSON.parse(usersJSON);
            } catch (e) {
                console.error("Failed to parse users", e);
            }
        }

        const legacyUserJSON = localStorage.getItem('currentUser');
        if (legacyUserJSON) {
            try {
                const legacy = JSON.parse(legacyUserJSON);
                if (!loadedUsers.find(u => u.email === legacy.email)) {
                    loadedUsers.push({
                        ...legacy,
                        id: 'legacy',
                        plan: 'free',
                        status: 'active',
                        company: 'Legacy Corp',
                        trialDaysLeft: 0,
                    });
                }
            } catch (e) { }
        }

        setUsers(loadedUsers);
        calculateStats(loadedUsers);
    };

    const calculateStats = (userList) => {
        const paying = userList.filter(u => u.plan === 'pro' || u.plan === 'enterprise').length;
        const trials = userList.filter(u => u.status === 'trial' || u.trialDaysLeft > 0).length;
        setStats({
            total: userList.length,
            paying,
            trials
        });
    };

    const handleMasterAuth = (e) => {
        e.preventDefault();
        if (masterPassword === 'admin2026') {
            setIsAuthenticated(true);
            setAuthError(false);
        } else {
            setAuthError(true);
        }
    };

    const handleGoogleAuth = () => {
        setIsAuthenticated(true);
        setAuthError(false);
    };

    const handleImpersonate = (user) => {
        if (window.confirm(`Are you sure you want to login as ${user.email}?`)) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            navigate('/app');
        }
    };

    const handleAddNewUser = () => {
        setUserForm({
            id: Date.now().toString(),
            name: '',
            email: '',
            password: '',
            role: 'user',
            plan: 'free',
            status: 'active',
            company: ''
        });
        setShowUserModal(true);
    };

    const handleDeleteUser = (user) => {
        if (window.confirm(`Are you sure you want to delete ${user.email}? This action cannot be undone.`)) {
            const updatedUsers = users.filter(u => u.email !== user.email);
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            setUsers(updatedUsers);
            alert('User deleted successfully');
        }
    };

    const openEditUser = (user) => {
        setUserForm({ ...user, company: user.company || '' });
        setShowUserModal(true);
    };

    const saveUser = () => {
        if (!userForm.email) {
            alert('Email is required');
            return;
        }

        let updatedUsers;
        const userExists = users.some(u => u.email === userForm.email);

        if (userExists && userForm.id !== 'legacy') {
            // Update existing
            updatedUsers = users.map(u => u.email === userForm.email ? userForm : u);
        } else {
            // Check for duplicate email on new user
            if (userExists) {
                alert('A user with this email already exists.');
                return;
            }
            // Add new
            updatedUsers = [...users, { ...userForm, id: userForm.id || Date.now().toString() }];
        }

        localStorage.setItem('users', JSON.stringify(updatedUsers));
        setUsers(updatedUsers);
        setShowUserModal(false);
    };

    const saveEmailSettings = () => {
        localStorage.setItem('admin_email_settings', JSON.stringify(emailSettings));
        alert('Email settings saved successfully');
    };

    const saveSiteSettings = () => {
        localStorage.setItem('admin_site_settings', JSON.stringify(siteSettings));
        alert('Site settings saved successfully');
    };

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Derived Companies list
    const companies = React.useMemo(() => {
        const comps = {};
        users.forEach(u => {
            const cName = u.company || 'Unassigned';
            if (!comps[cName]) {
                comps[cName] = { name: cName, count: 0, users: [] };
            }
            comps[cName].count++;
            comps[cName].users.push(u);
        });
        return Object.values(comps);
    }, [users]);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-mono">
                <div className="max-w-md w-full bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Shield size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-white uppercase tracking-widest">Admin Access</h1>
                        <p className="text-slate-500 mt-2 text-sm">Enter owner credentials to proceed</p>
                    </div>

                    <form onSubmit={handleMasterAuth} className="space-y-4">
                        <input
                            type="password"
                            value={masterPassword}
                            onChange={(e) => setMasterPassword(e.target.value)}
                            className={`w-full px-4 py-4 bg-slate-800 border ${authError ? 'border-red-500' : 'border-slate-700'} rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors`}
                            placeholder="Master Password"
                            autoFocus
                        />
                        {authError && <p className="text-red-500 text-xs mt-2">Incorrect master password.</p>}
                        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-6 text-lg font-bold">
                            Login with Password
                        </Button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-slate-900 px-2 text-slate-500 font-medium tracking-widest">Or Secure SSO</span>
                        </div>
                    </div>

                    <button
                        onClick={handleGoogleAuth}
                        className="w-full flex items-center justify-center gap-3 px-4 py-4 border border-slate-700 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-all group"
                    >
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                        Continue with Google
                    </button>
                </div>
            </div>
        );
    }

    const SidebarItem = ({ id, icon: Icon, label }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
        >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-slate-950 flex font-sans selection:bg-indigo-500/30">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col p-4 shrink-0 overflow-y-auto">
                <div className="flex items-center gap-3 px-3 mb-8">
                    <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white leading-tight">Super Admin</h2>
                        <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold">Main Control</span>
                    </div>
                </div>

                <nav className="space-y-2 flex-1">
                    <SidebarItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
                    <SidebarItem id="users" icon={Users} label="Users" />
                    <SidebarItem id="companies" icon={Building2} label="Companies" />
                    <SidebarItem id="email" icon={Mail} label="Email Settings" />
                    <SidebarItem id="settings" icon={Settings} label="General Settings" />
                    <SidebarItem id="activity" icon={Activity} label="Activity Log" />
                </nav>

                <div className="pt-4 mt-4 border-t border-slate-800 space-y-2">
                    <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors">
                        <Eye size={18} />
                        <span className="text-sm">Visit Site</span>
                    </button>
                    <button onClick={() => setIsAuthenticated(false)} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                        <LogIn size={18} className="rotate-180" />
                        <span className="text-sm font-medium">Log out</span>
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 overflow-y-auto bg-slate-950 p-8">
                <div className="max-w-6xl mx-auto space-y-8">

                    {activeTab === 'dashboard' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">System Overview</h1>
                                <p className="text-slate-400 font-mono text-sm">Status: <span className="text-emerald-400">Online</span></p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {[
                                    { label: 'Total Users', value: stats.total, icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
                                    { label: 'Companies', value: companies.length, icon: Building2, color: 'text-sky-400', bg: 'bg-sky-400/10' },
                                    { label: 'Paying Subs', value: stats.paying, icon: CreditCard, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                                    { label: 'Avg Trials', value: stats.trials, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
                                ].map((stat, i) => (
                                    <Card key={i} className="bg-slate-900 border-slate-800">
                                        <CardContent className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                                    <stat.icon size={24} />
                                                </div>
                                                <div>
                                                    <p className="text-xs uppercase font-bold text-slate-500">{stat.label}</p>
                                                    <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex justify-between items-end">
                                <h1 className="text-3xl font-bold text-white">User Management</h1>
                                <div className="flex gap-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                        <input
                                            type="text"
                                            placeholder="Search email/name..."
                                            className="bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <Button onClick={handleAddNewUser} className="bg-indigo-600 hover:bg-indigo-500 gap-2"><Plus size={18} /> Add User</Button>
                                </div>
                            </div>

                            <Card className="bg-slate-900 border-slate-800 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-800">
                                        <tr>
                                            <th className="px-6 py-4">User Details</th>
                                            <th className="px-6 py-4">Company</th>
                                            <th className="px-6 py-4">Plan</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {filteredUsers.map((user, idx) => (
                                            <tr key={idx} className="hover:bg-slate-800/30 transition-colors group text-sm">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 font-bold border border-slate-700">
                                                            {(user.name || user.email)[0].toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-white">{user.name || 'Admin User'}</div>
                                                            <div className="text-xs text-slate-500 font-mono">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="text-slate-300 flex items-center gap-2">
                                                        <Building2 size={14} className="text-slate-500" />
                                                        {user.company || <span className="text-slate-600 italic">None</span>}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold border ${user.plan === 'pro' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' : 'border-slate-700 text-slate-400'}`}>
                                                        {user.plan || 'Free'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button size="icon" variant="ghost" onClick={() => openEditUser(user)} className="hover:text-indigo-400 hover:bg-indigo-400/10"><Edit2 size={16} /></Button>
                                                        <Button size="icon" variant="ghost" onClick={() => handleImpersonate(user)} className="hover:text-emerald-400 hover:bg-emerald-400/10"><LogIn size={16} /></Button>
                                                        <Button size="icon" variant="ghost" onClick={() => handleDeleteUser(user)} className="hover:text-red-400 hover:bg-red-400/10"><Trash2 size={16} /></Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'companies' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <h1 className="text-3xl font-bold text-white">Company Management</h1>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {companies.map((comp, idx) => (
                                    <Card key={idx} className="bg-slate-900 border-slate-800 hover:border-indigo-500/50 transition-all cursor-default overflow-hidden group">
                                        <CardHeader className="bg-slate-950/50 p-6 border-b border-slate-800">
                                            <div className="flex justify-between items-start">
                                                <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-inner group-hover:scale-110 transition-transform">
                                                    <Building2 size={32} />
                                                </div>
                                                <span className="text-[10px] font-bold uppercase py-1 px-3 bg-indigo-500 text-white rounded-full shadow-lg shadow-indigo-500/20">
                                                    {comp.count} Users
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-white mt-4">{comp.name}</h3>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="space-y-4">
                                                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Team Members</p>
                                                <div className="flex -space-x-3">
                                                    {comp.users.slice(0, 5).map((u, i) => (
                                                        <div key={i} className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-indigo-400 text-xs font-bold" title={u.email}>
                                                            {(u.name || u.email)[0].toUpperCase()}
                                                        </div>
                                                    ))}
                                                    {comp.count > 5 && (
                                                        <div className="w-10 h-10 rounded-full bg-indigo-600 border-2 border-slate-900 flex items-center justify-center text-white text-[10px] font-bold">
                                                            +{comp.count - 5}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="pt-4 mt-4 border-t border-slate-800 flex justify-between items-center text-xs">
                                                    <span className="text-slate-500">Main Admin: <span className="text-indigo-400">{comp.users[0]?.email || 'N/A'}</span></span>
                                                    <Button variant="ghost" size="sm" className="text-indigo-400 hover:bg-indigo-400/10">Manage</Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'email' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <h1 className="text-3xl font-bold text-white">Email Configuration</h1>
                            <Card className="bg-slate-900 border-slate-800 max-w-2xl">
                                <CardContent className="p-8 space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase">SMTP Server</label>
                                            <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none" value={emailSettings.smtpServer} onChange={e => setEmailSettings({ ...emailSettings, smtpServer: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Port</label>
                                            <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none" value={emailSettings.smtpPort} onChange={e => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">From Email</label>
                                        <input type="email" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none" value={emailSettings.fromEmail} onChange={e => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })} />
                                    </div>
                                    <Button onClick={saveEmailSettings} className="w-full bg-indigo-600 hover:bg-indigo-500 py-6 font-bold shadow-lg shadow-indigo-600/20"><Save size={18} className="mr-2" /> Update Settings</Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <h1 className="text-3xl font-bold text-white mb-6">General Settings</h1>
                            <Card className="bg-slate-900 border-slate-800 max-w-2xl">
                                <CardContent className="p-8 space-y-8 text-white">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Site Name</label>
                                        <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none" value={siteSettings.siteTitle} onChange={e => setSiteSettings({ ...siteSettings, siteTitle: e.target.value })} />
                                    </div>
                                    <div className="flex items-center justify-between p-5 bg-slate-950 rounded-xl border border-slate-800">
                                        <div>
                                            <p className="font-bold">Maintenance Mode</p>
                                            <p className="text-xs text-slate-500">Block access for non-admin users.</p>
                                        </div>
                                        <button onClick={() => setSiteSettings({ ...siteSettings, maintenanceMode: !siteSettings.maintenanceMode })} className={`w-14 h-7 rounded-full relative transition-colors ${siteSettings.maintenanceMode ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                                            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${siteSettings.maintenanceMode ? 'left-8' : 'left-1'}`} />
                                        </button>
                                    </div>
                                    <Button onClick={saveSiteSettings} className="w-full bg-indigo-600 hover:bg-indigo-500 py-6 font-bold">Save Changes</Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </main>

            {/* Edit User Modal */}
            {showUserModal && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
                    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 w-full max-w-lg shadow-[0_0_50px_-12px_rgba(79,70,229,0.5)] space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold text-white">{userForm.id && users.some(u => u.id === userForm.id) ? 'Edit Team Member' : 'Add New Member'}</h3>
                            <p className="text-sm text-slate-500 mt-2">Manage profile information and access</p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2 col-span-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                                <input
                                    type="email"
                                    value={userForm.email}
                                    onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                                    disabled={users.some(u => u.id === userForm.id && userForm.id !== 'legacy')}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="user@company.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                                <input type="text" value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Company</label>
                                <input type="text" value={userForm.company} onChange={e => setUserForm({ ...userForm, company: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all" placeholder="Enter Company Name" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Subscription</label>
                                <select value={userForm.plan} onChange={e => setUserForm({ ...userForm, plan: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none">
                                    <option value="free">Free Tier</option>
                                    <option value="pro">Pro ($29/mo)</option>
                                    <option value="enterprise">Enterprise</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Secret Pass</label>
                                <input type="text" value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono text-xs focus:border-indigo-500 outline-none" />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button variant="ghost" onClick={() => setShowUserModal(false)} className="flex-1 text-slate-400 h-14 rounded-xl">Cancel</Button>
                            <Button onClick={saveUser} className="flex-1 bg-indigo-600 hover:bg-indigo-500 h-14 rounded-xl font-bold shadow-lg shadow-indigo-600/30">Commit Changes</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
