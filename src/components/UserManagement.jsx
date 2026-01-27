import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../hooks/usePermissions';
import { usersService, organizationsService } from '../services/firebaseService';
import { invitationService } from '../services/invitationService';
import { db } from '../config/firebase'; // Direct db access for collection queries if needed
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { Plus, Search, Mail, Shield, Trash2, MoreHorizontal, CheckCircle, XCircle } from 'lucide-react';

export default function UserManagement() {
    const { organization, currentUser } = useAuth();
    const { can } = usePermissions();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showInviteModal, setShowInviteModal] = useState(false);

    // Invitation Form State
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRoles, setInviteRoles] = useState(['evaluator']);
    const [inviteStatus, setInviteStatus] = useState('');

    useEffect(() => {
        if (organization?.id && can(PERMISSIONS.VIEW_USERS)) {
            fetchUsers();
        }
    }, [organization, can]);

    const fetchUsers = async () => {
        try {
            // Fetch users belonging to this organization
            // Note: Ideally users collection should having fields indexed properly
            const q = query(collection(db, 'users'), where('organizationId', '==', organization.id));
            const snapshot = await getDocs(q);
            const userList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(userList);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        setInviteStatus('sending');

        try {
            // 1. Check Limits (Basic check, robust check should be backend/functions)
            const limit = organization.employee_limit;
            if (limit && users.length >= limit) {
                throw new Error(`Plan limit reached (${limit} users). Upgrade to add more.`);
            }

            // 2. Create Invitation using Service
            const { token } = await invitationService.createInvitation({
                email: inviteEmail,
                organizationId: organization.id,
                roles: inviteRoles, // Should be array
                invitedBy: currentUser.uid
            });

            // 3. "Send" Email (Mock)
            const inviteLink = `${window.location.origin}/accept-invite?token=${token}&email=${encodeURIComponent(inviteEmail)}`;
            console.log("---------------------------------------------------------");
            console.log(`[MOCK EMAIL] To: ${inviteEmail}`);
            console.log(`Subject: You have been invited to join ${organization.name}`);
            console.log(`Link: ${inviteLink}`);
            console.log("---------------------------------------------------------");

            setInviteStatus('success');
            setTimeout(() => {
                setShowInviteModal(false);
                setInviteStatus('');
                setInviteEmail('');
            }, 2000);

        } catch (error) {
            console.error("Invitation failed:", error);
            setInviteStatus('error: ' + error.message);
        }
    };

    const toggleRole = (role) => {
        setInviteRoles(prev =>
            prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
        );
    };

    if (!can(PERMISSIONS.VIEW_USERS)) {
        return <div className="p-8 text-center text-gray-500">You do not have permission to view users.</div>;
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage your team, roles and permissions.
                        Plan Limit: {users.length} / {organization.employee_limit || 'Unlimited'}
                    </p>
                </div>
                {can(PERMISSIONS.INVITE_USERS) && (
                    <button
                        onClick={() => setShowInviteModal(true)}
                        className="bg-brand-blue text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-brand-blue/20 hover:bg-blue-600 transition-all flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Invite Member
                    </button>
                )}
            </div>

            {/* User List Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-semibold">
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Roles</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Joined</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400">Loading users...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400">No users found. Invite someone to get started.</td></tr>
                        ) : (
                            users.map(user => (
                                <tr key={user.uid} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center font-bold text-sm">
                                                {user.name?.[0] || user.email?.[0]}
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-gray-900">{user.name || 'Pending...'}</div>
                                                <div className="text-xs text-gray-400">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles?.map(role => (
                                                <span key={role} className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${role === 'admin' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                    role === 'hr' ? 'bg-pink-50 text-pink-600 border-pink-100' :
                                                        'bg-blue-50 text-brand-blue border-blue-100'
                                                    }`}>
                                                    {role}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                                            {user.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900">Invite Team Member</h3>
                            <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-gray-600"><XCircle size={20} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-blue"
                                    placeholder="colleague@company.com"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Assign Roles</label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${inviteRoles.includes('hr') ? 'bg-brand-blue border-brand-blue text-white' : 'border-gray-300'}`}>
                                            {inviteRoles.includes('hr') && <CheckCircle size={14} />}
                                        </div>
                                        <input type="checkbox" className="hidden" onChange={() => toggleRole('hr')} checked={inviteRoles.includes('hr')} />
                                        <div>
                                            <div className="text-sm font-bold text-gray-900">HR Admin</div>
                                            <div className="text-xs text-gray-500">Can manage users and view reports</div>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${inviteRoles.includes('evaluator') ? 'bg-brand-blue border-brand-blue text-white' : 'border-gray-300'}`}>
                                            {inviteRoles.includes('evaluator') && <CheckCircle size={14} />}
                                        </div>
                                        <input type="checkbox" className="hidden" onChange={() => toggleRole('evaluator')} checked={inviteRoles.includes('evaluator')} />
                                        <div>
                                            <div className="text-sm font-bold text-gray-900">Evaluator</div>
                                            <div className="text-xs text-gray-500">Can perform evaluations</div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {inviteStatus && inviteStatus.startsWith('error') && (
                                <div className="text-red-500 text-xs bg-red-50 p-3 rounded-lg flex gap-2 items-center">
                                    <AlertCircle size={14} /> {inviteStatus}
                                </div>
                            )}

                            {inviteStatus === 'success' && (
                                <div className="text-green-600 text-xs bg-green-50 p-3 rounded-lg flex gap-2 items-center">
                                    <CheckCircle size={14} /> Invitation sent!
                                </div>
                            )}

                            <div className="pt-2">
                                <button
                                    onClick={handleInvite}
                                    disabled={!inviteEmail || inviteStatus === 'sending' || inviteStatus === 'success'}
                                    className="w-full bg-brand-blue text-white py-3 rounded-xl font-bold shadow-lg shadow-brand-blue/20 hover:bg-blue-600 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {inviteStatus === 'sending' ? 'Sending...' : 'Send Invitation'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
