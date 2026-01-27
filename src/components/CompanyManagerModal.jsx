import React, { useState, useEffect } from 'react';
import { X, Building2, Users, Network, FileText, Save, Upload, Plus, Trash2, Edit2, Link as LinkIcon, Image as ImageIcon, CreditCard, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { organizationsService } from '../services/firebaseService';
import { subscriptionService } from '../services/subscriptionService';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { AccountabilityChartView } from './AccountabilityChartView';

export const CompanyManagerModal = ({ companyName, users, metadata, onUpdateMetadata, onUpdateUser, onClose }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [localMetadata, setLocalMetadata] = useState({
        logo: '',
        link: '',
        documents: [],
        ...metadata
    });

    // Documents State
    const [newDocName, setNewDocName] = useState('');

    // Team State
    const [isEditingUser, setIsEditingUser] = useState(null);
    const [teamSearch, setTeamSearch] = useState('');

    // Subscription State
    const [subscriptionData, setSubscriptionData] = useState({
        plan: 'Starter',
        status: 'active',
        startDate: '',
        endDate: ''
    });
    const [plans, setPlans] = useState([]);
    const [orgId, setOrgId] = useState(null);
    const [isLoadingSub, setIsLoadingSub] = useState(false);

    useEffect(() => {
        setLocalMetadata({
            logo: '',
            link: '',
            documents: [],
            ...metadata
        });
    }, [metadata]);

    useEffect(() => {
        if (activeTab === 'subscription') {
            loadSubscriptionDetails();
        }
    }, [activeTab, companyName]);

    const loadSubscriptionDetails = async () => {
        setIsLoadingSub(true);
        try {
            // Fetch Plans
            const loadedPlans = await subscriptionService.getPlans();
            setPlans(loadedPlans);

            // Fetch Organization Subscription
            const org = await organizationsService.getByName(companyName);
            if (org) {
                setOrgId(org.id);
                if (org.subscription) {
                    setSubscriptionData({
                        plan: org.subscription.plan || 'Starter',
                        status: org.subscription.status || 'active',
                        startDate: org.subscription.startDate || '',
                        endDate: org.subscription.endDate || ''
                    });
                }
            } else {
                // Handle case where org doesn't exist yet (created implicitly)
                setOrgId(null);
            }
        } catch (error) {
            console.error("Error loading subscription details", error);
        } finally {
            setIsLoadingSub(false);
        }
    };

    const handleSaveSubscription = async () => {
        try {
            let currentOrgId = orgId;
            if (!currentOrgId) {
                // Create organization if it doesn't exist
                const newOrg = await organizationsService.createAutoId({
                    name: companyName
                });
                currentOrgId = newOrg.id;
                setOrgId(currentOrgId);
            }

            if (currentOrgId) {
                await subscriptionService.updateOrganizationSubscription(currentOrgId, subscriptionData);
                alert('Subscription updated successfully');
            }
        } catch (error) {
            console.error("Error saving subscription", error);
            alert('Failed to save subscription');
        }
    };

    const handleSaveOverview = () => {
        onUpdateMetadata(companyName, {
            logo: localMetadata.logo,
            link: localMetadata.link
        });
    };

    const handleAddDocument = () => {
        if (!newDocName.trim()) return;
        const newDoc = {
            id: Date.now(),
            name: newDocName,
            collaborators: [],
            date: new Date().toISOString()
        };
        const updatedDocs = [...(localMetadata.documents || []), newDoc];
        setLocalMetadata({ ...localMetadata, documents: updatedDocs });
        onUpdateMetadata(companyName, { ...localMetadata, documents: updatedDocs });
        setNewDocName('');
    };

    const handleDeleteDocument = (docId) => {
        const updatedDocs = localMetadata.documents.filter(d => d.id !== docId);
        setLocalMetadata({ ...localMetadata, documents: updatedDocs });
        onUpdateMetadata(companyName, { ...localMetadata, documents: updatedDocs });
    };

    const handleToggleCollaborator = (docId, userEmail) => {
        const updatedDocs = localMetadata.documents.map(doc => {
            if (doc.id === docId) {
                const isCollaborator = doc.collaborators?.includes(userEmail);
                let newCollabs = doc.collaborators || [];
                if (isCollaborator) {
                    newCollabs = newCollabs.filter(e => e !== userEmail);
                } else {
                    newCollabs = [...newCollabs, userEmail];
                }
                return { ...doc, collaborators: newCollabs };
            }
            return doc;
        });
        setLocalMetadata({ ...localMetadata, documents: updatedDocs });
        onUpdateMetadata(companyName, { ...localMetadata, documents: updatedDocs });
    };

    // Derived Users for this company
    const companiesUsers = users.filter(u => u.company === companyName);

    const filteredTeam = companiesUsers.filter(u =>
        u.name?.toLowerCase().includes(teamSearch.toLowerCase()) ||
        u.email?.toLowerCase().includes(teamSearch.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-slate-900 w-full max-w-6xl h-[90vh] rounded-3xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                            {localMetadata.logo ? (
                                <img src={localMetadata.logo} alt="Logo" className="w-full h-full object-cover rounded-xl" />
                            ) : (
                                <Building2 size={24} />
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{companyName}</h2>
                            <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">Company Management Console</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-800 bg-slate-950/50 px-6">
                    {[
                        { id: 'overview', label: 'Company Overview', icon: Building2 },
                        { id: 'team', label: 'Team Members', icon: Users },
                        { id: 'structure', label: 'Structure & Hierarchy', icon: Network },
                        { id: 'team', label: 'Team Members', icon: Users },
                        { id: 'structure', label: 'Structure & Hierarchy', icon: Network },
                        { id: 'documents', label: 'Documents & Files', icon: FileText },
                        { id: 'subscription', label: 'Subscription', icon: CreditCard },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === tab.id
                                ? 'border-indigo-500 text-white'
                                : 'border-transparent text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-slate-900/50">

                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                            <Card className="bg-slate-900 border-slate-800">
                                <CardHeader className="border-b border-slate-800 p-6">
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <Building2 size={20} className="text-indigo-400" />
                                        Brand Identity
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                            <ImageIcon size={14} /> Logo URL
                                        </label>
                                        <div className="flex gap-4">
                                            <input
                                                type="text"
                                                value={localMetadata.logo || ''}
                                                onChange={e => setLocalMetadata({ ...localMetadata, logo: e.target.value })}
                                                placeholder="https://example.com/logo.png"
                                                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-indigo-500 outline-none"
                                            />
                                        </div>
                                        <p className="text-xs text-slate-600">Provide a direct link to the company logo image (PNG/JPG).</p>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                            <LinkIcon size={14} /> Website Link
                                        </label>
                                        <input
                                            type="text"
                                            value={localMetadata.link || ''}
                                            onChange={e => setLocalMetadata({ ...localMetadata, link: e.target.value })}
                                            placeholder="https://company.com"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-indigo-500 outline-none"
                                        />
                                    </div>

                                    <Button onClick={handleSaveOverview} className="w-full bg-indigo-600 hover:bg-indigo-500 py-6 font-bold">
                                        <Save size={18} className="mr-2" /> Save Company Details
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* TEAM TAB */}
                    {activeTab === 'team' && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex justify-between items-center">
                                <div className="relative w-full max-w-sm">
                                    <input
                                        type="text"
                                        placeholder="Search team members..."
                                        value={teamSearch}
                                        onChange={e => setTeamSearch(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500 outline-none"
                                    />
                                </div>
                                <Button onClick={() => setIsEditingUser({ id: null, name: '', email: '', role: 'Employee', manager: 'Unassigned', company: companyName, plan: 'Starter', status: 'active' })} className="bg-indigo-600 hover:bg-indigo-500 gap-2">
                                    <Plus size={18} /> Add Member
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredTeam.map(user => (
                                    <Card key={user.id} className="bg-slate-900 border-slate-800 group hover:border-indigo-500/30 transition-all">
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 font-bold text-lg border border-slate-700">
                                                    {(user.name || user.email)[0].toUpperCase()}
                                                </div>
                                                <Button variant="ghost" size="icon" className="hover:text-white" onClick={() => setIsEditingUser({ ...user })}>
                                                    <Edit2 size={16} />
                                                </Button>
                                            </div>
                                            <h3 className="font-bold text-white truncate">{user.name || 'Team Member'}</h3>
                                            <p className="text-xs text-slate-500 font-mono mb-4 truncate">{user.email}</p>

                                            <div className="space-y-2 pt-4 border-t border-slate-800">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-slate-500">Role</span>
                                                    <span className="text-slate-300 font-medium">{user.role || 'Member'}</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-slate-500">Reports To</span>
                                                    <span className="text-indigo-400 font-medium cursor-pointer hover:underline">
                                                        {user.manager || 'Unassigned'}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STRUCTURE TAB */}
                    {activeTab === 'structure' && (
                        <div className="h-full flex flex-col animate-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 mb-6 flex justify-between items-center">
                                <p className="text-sm text-slate-400">
                                    <span className="text-indigo-400 font-bold">Interactive Chart: </span>
                                    Drag and click on nodes to edit reporting lines and responsibilities.
                                </p>
                            </div>
                            <div className="flex-1 bg-white/5 rounded-2xl border border-dashed border-slate-700 overflow-hidden">
                                <AccountabilityChartView
                                    employees={companiesUsers}
                                    onUpdateEmployee={(id, updates) => {
                                        // Find user by ID (in this context we might need to find by name if ID isn't clear, but let's assume we map it back)
                                        // The Chart view uses names usually, let's look at that implementation.
                                        // Actually AccountabilityChartView expects 'onUpdateEmployee' to likely take ID or Name.
                                        // Let's pass a handler that bubbles up to 'onUpdateUser'
                                        const user = companiesUsers.find(u => u.name === id || u.id === id); // Heuristic
                                        if (user) onUpdateUser({ ...user, ...updates });
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* DOCUMENTS TAB */}
                    {activeTab === 'documents' && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex gap-4 p-6 bg-slate-900 rounded-2xl border border-slate-800">
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Upload Document (Metadata)</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newDocName}
                                            onChange={e => setNewDocName(e.target.value)}
                                            placeholder="Document Name (e.g. Employee Handbook 2024)"
                                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-indigo-500 outline-none"
                                        />
                                        <Button onClick={handleAddDocument} className="bg-indigo-600 hover:bg-indigo-500 px-6 font-bold">
                                            <Upload size={18} className="mr-2" /> Add
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {(localMetadata.documents || []).map(doc => (
                                    <div key={doc.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="bg-indigo-500/10 p-2 rounded-lg text-indigo-400">
                                                    <FileText size={20} />
                                                </div>
                                                <h4 className="text-lg font-bold text-white">{doc.name}</h4>
                                            </div>
                                            <p className="text-xs text-slate-500 font-mono">Added: {new Date(doc.date).toLocaleDateString()}</p>
                                        </div>

                                        <div className="flex-1 border-l border-slate-800 pl-6">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-3">Collaborators (Access)</label>
                                            <div className="flex flex-wrap gap-2">
                                                {companiesUsers.map(u => {
                                                    const hasAccess = doc.collaborators?.includes(u.email);
                                                    return (
                                                        <button
                                                            key={u.email}
                                                            onClick={() => handleToggleCollaborator(doc.id, u.email)}
                                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${hasAccess
                                                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                                                : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600'
                                                                }`}
                                                        >
                                                            {u.name.split(' ')[0]}
                                                            {hasAccess && <span className="ml-1.5 ">✓</span>}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteDocument(doc.id)} className="text-slate-500 hover:text-red-400 hover:bg-red-400/10">
                                                <Trash2 size={20} />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {(!localMetadata.documents || localMetadata.documents.length === 0) && (
                                    <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl">
                                        No documents added yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* SUBSCRIPTION TAB */}
                    {activeTab === 'subscription' && (
                        <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                            <Card className="bg-slate-900 border-slate-800">
                                <CardHeader className="border-b border-slate-800 p-6">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-white flex items-center gap-2">
                                            <CreditCard size={20} className="text-indigo-400" />
                                            Active Membership & Plan
                                        </CardTitle>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${subscriptionData.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {subscriptionData.status}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    {isLoadingSub ? (
                                        <div className="text-center text-slate-500 py-8">Loading subscription details...</div>
                                    ) : (
                                        <>
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold text-slate-500 uppercase">Current Plan</label>
                                                <select
                                                    value={subscriptionData.plan}
                                                    onChange={e => setSubscriptionData({ ...subscriptionData, plan: e.target.value })}
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-indigo-500 outline-none"
                                                >
                                                    <option value="Free">Free / Trial</option>
                                                    {plans.map(p => (
                                                        <option key={p.id} value={p.name}>{p.name} - ${p.price}/mo</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                                        <Calendar size={14} /> Start Date
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={subscriptionData.startDate}
                                                        onChange={e => setSubscriptionData({ ...subscriptionData, startDate: e.target.value })}
                                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-indigo-500 outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                                        <Calendar size={14} /> End Date
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={subscriptionData.endDate}
                                                        onChange={e => setSubscriptionData({ ...subscriptionData, endDate: e.target.value })}
                                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-indigo-500 outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-xs font-bold text-slate-500 uppercase">Status Override</label>
                                                <div className="flex gap-4">
                                                    <button
                                                        onClick={() => setSubscriptionData({ ...subscriptionData, status: 'active' })}
                                                        className={`flex-1 py-3 rounded-xl border font-bold text-sm transition-all ${subscriptionData.status === 'active' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'}`}
                                                    >
                                                        Active
                                                    </button>
                                                    <button
                                                        onClick={() => setSubscriptionData({ ...subscriptionData, status: 'expired' })}
                                                        className={`flex-1 py-3 rounded-xl border font-bold text-sm transition-all ${subscriptionData.status === 'expired' ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'}`}
                                                    >
                                                        Expired
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-slate-800">
                                                <Button onClick={handleSaveSubscription} className="w-full bg-indigo-600 hover:bg-indigo-500 py-6 font-bold">
                                                    <Save size={18} className="mr-2" /> Update Subscription
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                </div>

                {/* Edit User Modal Overlay */}
                {isEditingUser && (
                    <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                            <div className="p-6 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-white">{isEditingUser.id ? 'Edit Team Member' : 'Add New Member'}</h3>
                                <button onClick={() => setIsEditingUser(null)} className="text-slate-400 hover:text-white"><X size={20} /></button>
                            </div>
                            <div className="p-6 space-y-4 overflow-y-auto">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                                    <input
                                        type="text"
                                        value={isEditingUser.name}
                                        onChange={e => setIsEditingUser({ ...isEditingUser, name: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                                    <input
                                        type="email"
                                        value={isEditingUser.email}
                                        onChange={e => setIsEditingUser({ ...isEditingUser, email: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Role</label>
                                        <input
                                            type="text"
                                            value={isEditingUser.role}
                                            onChange={e => setIsEditingUser({ ...isEditingUser, role: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Reports To</label>
                                        <select
                                            value={isEditingUser.manager}
                                            onChange={e => setIsEditingUser({ ...isEditingUser, manager: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none text-sm"
                                        >
                                            <option value="Unassigned">Unassigned</option>
                                            <option value="CEO">CEO</option>
                                            {companiesUsers.filter(u => u.email !== isEditingUser.email).map(u => (
                                                <option key={u.id} value={u.name}>{u.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-t border-slate-800 bg-slate-950/50 flex gap-3">
                                <Button variant="ghost" className="flex-1" onClick={() => setIsEditingUser(null)}>Cancel</Button>
                                <Button
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 font-bold"
                                    onClick={() => {
                                        onUpdateUser({
                                            ...isEditingUser,
                                            id: isEditingUser.id || Date.now().toString(),
                                            company: companyName // Force company association
                                        });
                                        setIsEditingUser(null);
                                    }}
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    </div>
                )}            </div>
        </div>
    );
};
