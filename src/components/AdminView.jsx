import React, { useState } from 'react';
import { Card } from './Card';
import { Plus, Mail, ChevronRight, X, Upload } from 'lucide-react';
import { hasPermission, PERMISSIONS } from '../utils/permissions';

export const AdminView = ({ employees, onAddEmployee, onLaunch, coreValues }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState('single'); // 'single' | 'bulk'
    const [bulkData, setBulkData] = useState('');
    const [newEmployee, setNewEmployee] = useState({
        name: '',
        lastName: '',
        email: '',
        role: '',
        manager: '',
        systemRole: 'employee',
        responsibilities: '', // New field
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (mode === 'single') {
            const fullName = `${newEmployee.name} ${newEmployee.lastName}`.trim();
            onAddEmployee({
                ...newEmployee,
                name: fullName,
                values: coreValues.map(() => '+'),
                gwc: ['Y', 'Y', 'Y'],
                status: 'Ready',
                rating: 'The Right Person',
                photo: null,
                responsibilities: newEmployee.responsibilities.split('\n').filter(r => r.trim() !== '')
            });
            // Show toast simulation
            alert(`Invitation sent to ${newEmployee.email}`);
        } else {
            // Parse Bulk Data
            const lines = bulkData.trim().split('\n');
            const newEmployees = lines.map(line => {
                const [firstName, lastName, email, role, manager, responsibilitiesStr] = line.split(',').map(s => s.trim());
                if (!firstName || !lastName || !email) return null;

                return {
                    name: `${firstName} ${lastName}`,
                    email,
                    role: role || 'TBD',
                    manager: manager || 'TBD',
                    systemRole: 'employee',
                    values: coreValues.map(() => '+'),
                    gwc: ['Y', 'Y', 'Y'],
                    status: 'Ready',
                    rating: 'The Right Person',
                    photo: null,
                    responsibilities: responsibilitiesStr ? responsibilitiesStr.split(';').map(r => r.trim()) : []
                };
            }).filter(Boolean);

            if (newEmployees.length > 0) {
                onAddEmployee(newEmployees);
                alert(`Invitations sent to ${newEmployees.length} employees`);
            }
        }

        setIsModalOpen(false);
        setNewEmployee({ name: '', lastName: '', email: '', role: '', manager: '', systemRole: 'employee', responsibilities: '' });
        setBulkData('');
        setMode('single');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 card-shadow">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Manage People</h3>
                    <p className="text-sm text-gray-500">Define your organization and evaluation hierarchy.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                        <Plus size={18} />
                        Add Employee
                    </button>
                    <button
                        onClick={onLaunch}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-brand-blue/20"
                    >
                        <Mail size={18} />
                        Launch Cycle
                    </button>
                </div>
            </div>

            <Card className="p-0 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">System Role</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Manager</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {employees.map((emp, i) => (
                            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center font-bold text-xs">
                                            {emp.name ? emp.name.split(' ').map(n => n[0]).join('') : '?'}
                                        </div>
                                        <span className="font-semibold text-sm text-gray-900">{emp.name || 'Unknown'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{emp.role}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded-lg bg-gray-100 text-gray-600 text-[10px] font-bold uppercase">
                                        {emp.systemRole || 'employee'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{emp.manager}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${emp.status === 'Ready' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                                        }`}>
                                        {emp.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-gray-400 hover:text-brand-blue transition-colors">
                                        <ChevronRight size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            {/* Add Employee Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Add New Employee</h3>
                                <div className="flex gap-4 mt-2 text-sm">
                                    <button
                                        className={`pb-1 ${mode === 'single' ? 'text-brand-blue border-b-2 border-brand-blue font-semibold' : 'text-gray-500'}`}
                                        onClick={() => setMode('single')}
                                    >
                                        Single
                                    </button>
                                    <button
                                        className={`pb-1 ${mode === 'bulk' ? 'text-brand-blue border-b-2 border-brand-blue font-semibold' : 'text-gray-500'}`}
                                        onClick={() => setMode('bulk')}
                                    >
                                        Bulk Import
                                    </button>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {mode === 'single' ? (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                            <input
                                                required
                                                type="text"
                                                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue"
                                                value={newEmployee.name}
                                                onChange={e => setNewEmployee({ ...newEmployee, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                            <input
                                                required
                                                type="text"
                                                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue"
                                                value={newEmployee.lastName}
                                                onChange={e => setNewEmployee({ ...newEmployee, lastName: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input
                                            required
                                            type="email"
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue"
                                            value={newEmployee.email}
                                            onChange={e => setNewEmployee({ ...newEmployee, email: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Role / Position</label>
                                        <input
                                            required
                                            type="text"
                                            list="roles-list"
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue"
                                            value={newEmployee.role}
                                            onChange={e => setNewEmployee({ ...newEmployee, role: e.target.value })}
                                            placeholder="Select or type a role..."
                                        />
                                        <datalist id="roles-list">
                                            {organizationalRoles && Object.values(organizationalRoles.predefined).flat().map((role, idx) => (
                                                <option key={`pred-${idx}`} value={role} />
                                            ))}
                                            {organizationalRoles && organizationalRoles.custom.map((role, idx) => (
                                                <option key={`custom-${idx}`} value={role} />
                                            ))}
                                        </datalist>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
                                        <select
                                            required
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue"
                                            value={newEmployee.manager}
                                            onChange={e => setNewEmployee({ ...newEmployee, manager: e.target.value })}
                                        >
                                            <option value="">Select a manager...</option>
                                            <option value="CEO">CEO (Root)</option>
                                            {employees.map((emp, idx) => (
                                                <option key={idx} value={emp.name}>{emp.name} - {emp.role}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Areas of Responsibility</label>
                                        <textarea
                                            className="w-full h-24 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue"
                                            placeholder={`Type each responsibility in a new line...\ne.g.\nTeam Leadership\nBudget Management`}
                                            value={newEmployee.responsibilities}
                                            onChange={e => setNewEmployee({ ...newEmployee, responsibilities: e.target.value })}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        CSV Data (First Name, Last Name, Email, Role, Manager, Responsibilities [sep by ;])
                                    </label>
                                    <textarea
                                        className="w-full h-40 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue font-mono"
                                        placeholder={`John, Doe, john@example.com, Developer, Jane Smith, Team Lead; Code Review\nAlice, Wonderland, alice@example.com, Designer, Bob Builder, UI Design; Brand`}
                                        value={bulkData}
                                        onChange={e => setBulkData(e.target.value)}
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Paste your employee list here. One employee per line.
                                    </p>
                                </div>
                            )}

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-brand-blue text-white text-sm font-bold rounded-xl hover:bg-blue-600 shadow-lg shadow-brand-blue/20 transition-colors"
                                >
                                    {mode === 'single' ? 'Send Invitation' : 'Import Employees'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
