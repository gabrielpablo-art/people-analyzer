import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { ClipboardList, CheckCircle, Clock, UserCheck, ChevronRight, Play } from 'lucide-react';
import { useEvaluations } from '../hooks/useFirestore';
import { hasPermission, PERMISSIONS } from '../utils/permissions';

export const EvaluationDashboard = ({ employees, currentUser, onEvaluate }) => {
    const [activeTab, setActiveTab] = useState('pending');
    const { getEvaluationsByEvaluator, getEvaluationsForEmployee } = useEvaluations();

    const [completedEvaluations, setCompletedEvaluations] = useState([]);
    const [receivedEvaluations, setReceivedEvaluations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (currentUser?.uid) {
                setLoading(true);
                try {
                    // Fetch completed evaluations (where I am the evaluator)
                    const completed = await getEvaluationsByEvaluator(currentUser.uid);
                    setCompletedEvaluations(completed);

                    // Fetch received evaluations (where I am the evaluated)
                    // Note: In a real app we might want to filter only completed ones or show status
                    const received = await getEvaluationsForEmployee(currentUser.uid);
                    setReceivedEvaluations(received);
                } catch (error) {
                    console.error("Error fetching evaluations:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [currentUser?.uid, activeTab]);

    // Pending Evaluations Logic
    // "Pending" means:
    // 1. People I manage (manager === currentUser.uid OR manager === currentUser.email)
    // 2. EXCLUDING people I have ALREADY evaluated in this current cycle (assuming simplified logic: evaluated recently)
    // For now, we'll list all direct reports and show status based on whether a completed evaluation exists in 'completedEvaluations'.

    // Normalize current user ID/Email for matching
    const myId = currentUser?.uid;
    const myEmail = currentUser?.email;

    // Determine who I can evaluate
    // If Admin/HR, I can evaluate everyone (matching DashboardView logic for visibility)
    // If Manager, only direct reports
    const canViewAll = hasPermission(currentUser, PERMISSIONS.MANAGE_EMPLOYEES) || currentUser?.role === 'admin' || currentUser?.role === 'hr';

    const candidates = canViewAll ? employees : employees.filter(emp => {
        // Check if I am their manager
        const managerId = emp.manager;
        // Manager field might be ID or Email or Name. Assuming robust matching needed but let's try direct match first.
        // If manager field stores email:
        if (managerId === myEmail) return true;
        // If manager field stores UID (less likely in current data model but possible):
        if (managerId === myId) return true;

        return false;
    });

    // Helper to check if a report is already evaluated
    const isEvaluated = (employeeId) => {
        // Check if there is a COMPLETED evaluation for this employee in the completedEvaluations list
        // Simplified: just check if ANY evaluation exists for now. 
        // Ideal: Check "Cycle" or specific time window.
        return completedEvaluations.some(ev =>
            (ev.evaluatedId === employeeId || ev.evaluatedId === employees.find(e => e.id === employeeId)?.email)
            && ev.status === 'completed'
        );
    };

    const pendingEvaluations = candidates.filter(emp => !isEvaluated(emp.id));

    const tabs = [
        { id: 'pending', label: 'Pending', icon: Clock, count: pendingEvaluations.length },
        { id: 'completed', label: 'Completed', icon: CheckCircle, count: completedEvaluations.length },
        { id: 'received', label: 'Received', icon: UserCheck, count: receivedEvaluations.length }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin" />
            </div>
        );
    }

    const formatDate = (dateVal) => {
        if (!dateVal) return 'Unknown date';
        // Handle Firestore Timestamp
        if (dateVal.seconds) return new Date(dateVal.seconds * 1000).toLocaleDateString();
        // Handle JS Date or String
        return new Date(dateVal).toLocaleDateString();
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <header className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Evaluation Dashboard</h2>
                <p className="text-gray-500">Manage your team's evaluations and view your own progress.</p>
            </header>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-100 pb-1">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            flex items-center gap-2 px-6 py-3 font-bold text-sm rounded-t-xl border-b-2 transition-all
                            ${activeTab === tab.id
                                ? 'text-brand-blue border-brand-blue bg-blue-50/50'
                                : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'}
                        `}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                        {tab.count > 0 && (
                            <span className={`
                                ml-1 px-2 py-0.5 rounded-full text-xs
                                ${activeTab === tab.id ? 'bg-brand-blue text-white' : 'bg-gray-200 text-gray-600'}
                            `}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="min-h-[400px]">
                {activeTab === 'pending' && (
                    <div className="grid gap-4">
                        {pendingEvaluations.length === 0 ? (
                            <EmptyState
                                title="No Pending Evaluations"
                                message="You're all caught up! All your direct reports have been evaluated."
                            />
                        ) : (
                            pendingEvaluations.map(employee => (
                                <Card key={employee.id} className="hover:shadow-md transition-shadow group">
                                    <div className="flex items-center justify-between p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold text-lg">
                                                {employee.name?.[0] || employee.email?.[0] || '?'}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{employee.name || employee.email}</h3>
                                                <p className="text-sm text-gray-500">{employee.role || 'Team Member'}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => onEvaluate(employee)}
                                            className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg font-bold text-sm hover:bg-blue-600 transition-colors shadow-lg shadow-brand-blue/20"
                                        >
                                            <Play size={14} />
                                            Start Evaluation
                                        </button>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'completed' && (
                    <div className="grid gap-4">
                        {completedEvaluations.length === 0 ? (
                            <EmptyState
                                title="No Completed Evaluations"
                                message="You haven't completed any evaluations yet."
                            />
                        ) : (
                            completedEvaluations.map(evalItem => {
                                // Find employee details
                                // Note: evalItem.evaluatedId might be ID or Email.
                                const employee = employees.find(e => e.id === evalItem.evaluatedId || e.email === evalItem.evaluatedId)
                                    || { name: evalItem.evaluatedId, role: 'Unknown' }; // Fallback

                                return (
                                    <Card key={evalItem.id} className="hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold">
                                                    <CheckCircle size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900">{employee.name || employee.email}</h3>
                                                    <p className="text-xs text-gray-500">
                                                        Submitted on {formatDate(evalItem.submittedAt)}
                                                    </p>
                                                </div>
                                            </div>
                                            <button className="text-gray-400 hover:text-brand-blue transition-colors">
                                                <ChevronRight size={20} />
                                            </button>
                                        </div>
                                    </Card>
                                );
                            })
                        )}
                    </div>
                )}

                {activeTab === 'received' && (
                    <div className="grid gap-4">
                        {receivedEvaluations.length === 0 ? (
                            <EmptyState
                                title="No Received Evaluations"
                                message="No evaluations received yet or they are still pending."
                            />
                        ) : (
                            receivedEvaluations.map(evalItem => (
                                <Card key={evalItem.id} className="hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold">
                                                <UserCheck size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">Performance Review</h3>
                                                <p className="text-xs text-gray-500">
                                                    Received on {formatDate(evalItem.submittedAt)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`
                                                px-3 py-1 rounded-full text-xs font-bold uppercase
                                                ${evalItem.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                                            `}>
                                                {evalItem.status}
                                            </span>
                                            <button className="text-gray-400 hover:text-brand-blue transition-colors">
                                                <ChevronRight size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const EmptyState = ({ title, message }) => (
    <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3">
            <ClipboardList size={24} />
        </div>
        <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500 max-w-sm">{message}</p>
    </div>
);
