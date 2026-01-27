import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { DashboardView } from '../components/DashboardView';
import { EvaluationView } from '../components/EvaluationView';
import { AdminView } from '../components/AdminView';
import { ConfigurationView } from '../components/ConfigurationView';
import { AccountabilityChartView } from '../components/AccountabilityChartView';
import { QuestionEditor } from '../components/QuestionEditor';
import { PersonReport } from '../components/PersonReport';
import Logo from '../components/ui/Logo';
import { Mail } from 'lucide-react';
import { hasPermission, PERMISSIONS } from '../utils/permissions';
import { useEmployees, useSettings, useEvaluations } from '../hooks/useFirestore';
import { authService } from '../services/authService';
import { ResourcesView } from '../components/ResourcesView';
import { FeedbackView } from '../components/FeedbackView';
import UserManagement from '../components/UserManagement';

export default function DashboardApp() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showToast, setShowToast] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const getInitialUser = () => {
        try {
            const stored = localStorage.getItem('currentUser');
            if (!stored || stored === 'undefined') return {};
            return JSON.parse(stored);
        } catch (e) {
            console.error("Error parsing currentUser from localStorage:", e);
            return {};
        }
    };

    const [currentUser, setCurrentUser] = useState(getInitialUser());

    // Firebase Hooks
    const { employees, loading: employeesLoading, addEmployee, updateEmployee } = useEmployees();
    const { settings, loading: settingsLoading, updateSettings } = useSettings();
    const { createEvaluation } = useEvaluations();

    useEffect(() => {
        const unsubscribe = authService.onAuthStateChange((userData) => {
            if (userData) {
                // Merge local data with auth data if needed
                setCurrentUser(prev => ({ ...prev, ...userData }));
                if (userData.uid) {
                    // Force refresh user data from Firestore if we only have the auth part
                    authService.usersService.getById(userData.uid).then(fullData => {
                        if (fullData) {
                            setCurrentUser(prev => ({ ...prev, ...fullData }));
                            localStorage.setItem('currentUser', JSON.stringify({ ...userData, ...fullData }));
                        }
                    }).catch(err => console.error("Error fetching full user data:", err));
                }
            } else {
                // FALLBACK: Check if we have a valid local session (e.g. from Super Admin created user)
                // This prevents redirecting if the user logged in via the local fallback mechanism
                const localSession = localStorage.getItem('currentUser');
                if (localSession && localSession !== 'undefined') {
                    try {
                        const parsedUser = JSON.parse(localSession);
                        if (parsedUser.email) {
                            console.log("Restoring local session for:", parsedUser.email);
                            setCurrentUser(parsedUser);
                            return; // Don't redirect
                        }
                    } catch (e) {
                        console.error("Invalid local session", e);
                    }
                }

                // Only redirect if NO Firebase user AND NO local session
                window.location.href = '/login';
            }
        });
        return () => unsubscribe();
    }, []);

    const coreValues = settings?.coreValues || ['Humble', 'Hungry', 'Smart', 'Compass', 'Transp'];
    const organizationalRoles = settings?.organizationalRoles || {
        predefined: {
            'C-Suite': ['CEO', 'CTO', 'CFO', 'COO'],
            'Directors': ['Director of Technology', 'Director of Finance', 'Director of Operations', 'Director of HR'],
            'Analysts': ['Technology Analyst', 'Finance Analyst', 'Operations Analyst', 'HR Analyst']
        },
        custom: []
    };

    const handleLaunch = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleAddEmployee = async (newEmpOrEmps) => {
        try {
            if (Array.isArray(newEmpOrEmps)) {
                for (const emp of newEmpOrEmps) {
                    await addEmployee(emp);
                }
            } else {
                await addEmployee(newEmpOrEmps);
            }
        } catch (err) {
            console.error('Error adding employee:', err);
        }
    };

    const handleUpdateEmployee = async (employeeId, updates) => {
        try {
            await updateEmployee(employeeId, updates);
        } catch (err) {
            console.error('Error updating employee:', err);
        }
    };

    // Configuration Handlers
    const addCoreValue = (val) => {
        const updated = [...coreValues, val];
        updateSettings({ coreValues: updated });
    };

    const removeCoreValue = (index) => {
        const updated = coreValues.filter((_, i) => i !== index);
        updateSettings({ coreValues: updated });
    };

    const updateCoreValue = (index, newVal) => {
        const updated = [...coreValues];
        updated[index] = newVal;
        updateSettings({ coreValues: updated });
    };

    const addCustomRole = (roleName) => {
        const updatedRoles = {
            ...organizationalRoles,
            custom: [...organizationalRoles.custom, roleName]
        };
        updateSettings({ organizationalRoles: updatedRoles });
    };

    const removeCustomRole = (index) => {
        const updatedRoles = {
            ...organizationalRoles,
            custom: organizationalRoles.custom.filter((_, i) => i !== index)
        };
        updateSettings({ organizationalRoles: updatedRoles });
    };

    // State for Evaluation Mode
    const [personToEvaluate, setPersonToEvaluate] = useState(null);
    const [evaluationsForReport, setEvaluationsForReport] = useState([]);

    // Additional Firebase Hooks
    // Merging useEvaluations usage here or just calling it again is fine, but must be top level.
    // Ideally we merge with line 39, but for minimal diff we just move it up.
    const { getEvaluationsForEmployee } = useEvaluations();

    useEffect(() => {
        if (selectedPerson) {
            getEvaluationsForEmployee(selectedPerson.id || selectedPerson.email)
                .then(setEvaluationsForReport)
                .catch(err => console.error('Error fetching evaluations:', err));
        }
    }, [selectedPerson]);


    const handleEvaluationSubmit = async (evalData) => {
        try {
            await createEvaluation({
                employeeId: personToEvaluate.id || personToEvaluate.email,
                evaluatorId: currentUser.uid,
                organizationId: currentUser.organizationId || 'default',
                ...evalData,
                status: 'completed',
                submittedAt: new Date().toISOString()
            });

            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            setPersonToEvaluate(null);
            setActiveTab('dashboard');
        } catch (err) {
            console.error('Error submitting evaluation:', err);
        }
    };

    if (employeesLoading || settingsLoading) {
        return (
            <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <Logo iconSize="w-16 h-16" textSize="text-3xl" />
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin" />
                        <p className="text-gray-500 font-medium">Loading your dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Layout activeTab={activeTab} onTabChange={setActiveTab}>
            {activeTab === 'dashboard' && !selectedPerson && (
                <DashboardView
                    employees={employees}
                    coreValues={coreValues}
                    currentUser={currentUser}
                    onViewReport={(person) => setSelectedPerson(person)}
                    onEvaluate={(person) => {
                        setPersonToEvaluate(person);
                        setActiveTab('evaluation');
                    }}
                />
            )}

            {activeTab === 'dashboard' && selectedPerson && (
                <PersonReport
                    person={selectedPerson}
                    evaluations={evaluationsForReport}
                    coreValues={coreValues}
                    questions={settings?.questions || []}
                    onBack={() => setSelectedPerson(null)}
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

            {activeTab === 'feedback' && (
                <FeedbackView
                    employees={employees}
                    currentUser={currentUser}
                />
            )}

            {activeTab === 'evaluation' && (
                <EvaluationView
                    employee={personToEvaluate}
                    coreValues={coreValues}
                    questions={settings?.questions || []}
                    onBack={() => {
                        setPersonToEvaluate(null);
                        setActiveTab('dashboard');
                    }}
                    onSubmit={handleEvaluationSubmit}
                />
            )}

            {activeTab === 'accountability' && hasPermission(currentUser, PERMISSIONS.MANAGE_ACCOUNTABILITY_CHART) && (
                <AccountabilityChartView
                    employees={employees}
                    onUpdateEmployee={handleUpdateEmployee}
                />
            )}

            {activeTab === 'resources' && (
                <ResourcesView />
            )}

            {activeTab === 'settings' && hasPermission(currentUser, PERMISSIONS.MANAGE_CORE_VALUES) && (
                <div className="space-y-6">
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
                    <QuestionEditor
                        questions={settings?.questions || []}
                        onUpdate={(updatedQuestions) => updateSettings({ questions: updatedQuestions })}
                    />
                </div>
            )}

            {activeTab === 'team' && (
                <UserManagement />
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

