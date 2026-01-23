import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { DashboardView } from '../components/DashboardView';
import { EvaluationView } from '../components/EvaluationView';
import { AdminView } from '../components/AdminView';
import { ConfigurationView } from '../components/ConfigurationView';
import { AccountabilityChartView } from '../components/AccountabilityChartView';
import { Mail } from 'lucide-react';
import { hasPermission, PERMISSIONS } from '../utils/permissions';

export default function DashboardApp() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showToast, setShowToast] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    // Centralized State
    const [coreValues, setCoreValues] = useState(['Humble', 'Hungry', 'Smart', 'Compass', 'Transp']);

    // Organizational Roles State
    const [organizationalRoles, setOrganizationalRoles] = useState(() => {
        const saved = localStorage.getItem('organizationalRoles');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            predefined: {
                'C-Suite': ['CEO', 'CTO', 'CFO', 'COO'],
                'Directors': [
                    'Director of Technology',
                    'Director of Finance',
                    'Director of Operations',
                    'Director of HR'
                ],
                'Analysts': [
                    'Technology Analyst',
                    'Finance Analyst',
                    'Operations Analyst',
                    'HR Analyst'
                ]
            },
            custom: []
        };
    });

    const [employees, setEmployees] = useState([
        {
            name: 'Juan Perez',
            email: 'juan@company.com',
            role: 'CTO',
            manager: 'CEO',
            status: 'Ready',
            values: ['+', '+', '+', '±', '+'],
            gwc: ['Y', 'Y', 'Y'],
            rating: 'Right Employee',
            photo: null,
            responsibilities: ['Technology Strategy', 'Product Development', 'IT Infrastructure', 'Technical Hiring']
        },
        {
            name: 'Maria Gomez',
            email: 'maria@company.com',
            role: 'HR Manager',
            manager: 'CEO',
            status: 'In Review',
            values: ['+', '±', '+', '+', '±'],
            gwc: ['Y', 'Y', 'Y'],
            rating: 'Right Employee',
            photo: null,
            responsibilities: ['Talent Acquisition', 'Employee Engagement', 'Payroll & Benefits', 'Compliance']
        },
        {
            name: 'Carlos Ruiz',
            email: 'carlos@company.com',
            role: 'Dev Lead',
            manager: 'Juan Perez',
            status: 'Waiting',
            values: ['+', '+', '-', '±', '+'],
            gwc: ['Y', 'Y', 'N'],
            rating: 'Wrong Seat',
            photo: null,
            responsibilities: ['Team Coordination', 'Code Review', 'Backend Architecture', 'Sprint Planning']
        },
        {
            name: 'Ana Lopez',
            email: 'ana@company.com',
            role: 'Designer',
            manager: 'Juan Perez',
            status: 'Waiting',
            values: ['±', '-', '±', '±', '-'],
            gwc: ['Y', 'N', 'Y'],
            rating: 'Wrong Person',
            photo: null,
            responsibilities: ['UI/UX Design', 'Design Systems', 'Brand Identity', 'User Research']
        },
    ]);

    const handleLaunch = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleAddEmployee = (newEmpOrEmps) => {
        if (Array.isArray(newEmpOrEmps)) {
            setEmployees([...employees, ...newEmpOrEmps]);
        } else {
            setEmployees([...employees, newEmpOrEmps]);
        }
    };

    const handleUpdateEmployee = (name, updates) => {
        setEmployees(employees.map(emp =>
            emp.name === name ? { ...emp, ...updates } : emp
        ));
    };

    // Configuration Handlers
    const addCoreValue = (val) => setCoreValues([...coreValues, val]);
    const removeCoreValue = (index) => setCoreValues(coreValues.filter((_, i) => i !== index));
    const updateCoreValue = (index, newVal) => {
        const updated = [...coreValues];
        updated[index] = newVal;
        setCoreValues(updated);
    };

    // Organizational Roles Handlers
    const addCustomRole = (roleName) => {
        const updated = {
            ...organizationalRoles,
            custom: [...organizationalRoles.custom, roleName]
        };
        setOrganizationalRoles(updated);
        localStorage.setItem('organizationalRoles', JSON.stringify(updated));
    };

    const removeCustomRole = (index) => {
        const updated = {
            ...organizationalRoles,
            custom: organizationalRoles.custom.filter((_, i) => i !== index)
        };
        setOrganizationalRoles(updated);
        localStorage.setItem('organizationalRoles', JSON.stringify(updated));
    };

    const getAllRoles = () => {
        const predefinedRoles = Object.values(organizationalRoles.predefined).flat();
        return [...predefinedRoles, ...organizationalRoles.custom];
    };

    return (
        <Layout activeTab={activeTab} onTabChange={setActiveTab}>
            {activeTab === 'dashboard' && (
                <DashboardView
                    employees={employees}
                    coreValues={coreValues}
                    currentUser={currentUser}
                />
            )}

            {activeTab === 'admin' && hasPermission(currentUser, PERMISSIONS.MANAGE_EMPLOYEES) && (
                <AdminView
                    employees={employees}
                    onAddEmployee={handleAddEmployee}
                    onLaunch={handleLaunch}
                    coreValues={coreValues}
                    organizationalRoles={organizationalRoles}
                    onAddCustomRole={addCustomRole}
                />
            )}

            {activeTab === 'evaluation' && (
                <EvaluationView onBack={() => setActiveTab('dashboard')} />
            )}

            {activeTab === 'accountability' && hasPermission(currentUser, PERMISSIONS.MANAGE_ACCOUNTABILITY_CHART) && (
                <AccountabilityChartView
                    employees={employees}
                    onUpdateEmployee={handleUpdateEmployee}
                />
            )}

            {activeTab === 'settings' && hasPermission(currentUser, PERMISSIONS.MANAGE_CORE_VALUES) && (
                <ConfigurationView
                    coreValues={coreValues}
                    onAddValue={addCoreValue}
                    onRemoveValue={removeCoreValue}
                    onUpdateValue={updateCoreValue}
                    currentUser={currentUser}
                    organizationalRoles={organizationalRoles}
                    onAddCustomRole={addCustomRole}
                    onRemoveCustomRole={removeCustomRole}
                />
            )}

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-8 duration-300 z-50">
                    <div className="w-8 h-8 bg-brand-green/20 text-brand-green rounded-full flex items-center justify-center">
                        <Mail size={16} />
                    </div>
                    <div>
                        <p className="text-sm font-bold">Evaluations Launched!</p>
                        <p className="text-xs text-gray-400">Invitations sent to {employees.length} employees.</p>
                    </div>
                </div>
            )}
        </Layout>
    );
}
