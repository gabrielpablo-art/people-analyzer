import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { DashboardView } from '../components/DashboardView';
import { EvaluationView } from '../components/EvaluationView';
import { EvaluationDashboard } from '../components/EvaluationDashboard';
import { AdminView } from '../components/AdminView';
import { ConfigurationView } from '../components/ConfigurationView';
import { AccountabilityChartView } from '../components/AccountabilityChartView';
import { QuestionEditor } from '../components/QuestionEditor';
import { PersonReport } from '../components/PersonReport';
import Logo from '../components/ui/Logo';
import { Mail, LayoutDashboard, Users, MessageSquare, ClipboardList, Network, BookOpen, Clock, CreditCard } from 'lucide-react';
import { hasPermission, PERMISSIONS } from '../utils/permissions';
import { useEmployees, useSettings, useEvaluations, useOrganization } from '../hooks/useFirestore';
import { authService } from '../services/authService';
import { invitationService } from '../services/invitationService';
import { employeesService } from '../services/firebaseService';
import { ResourcesView } from '../components/ResourcesView';
import { FeedbackView } from '../components/FeedbackView';
import { transformEvaluationData, calculateRating } from '../utils/evaluationUtils';


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
    const { organization, updateOrganization } = useOrganization();
    const { createEvaluation } = useEvaluations();
    const navigate = useNavigate();

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

    const processAddEmployee = async (newEmpOrEmps) => {
        // Single Add - Treat as Invitation if email exists
        if (newEmpOrEmps.email) {
            // Map systemRole to roles array
            const roles = [];
            if (newEmpOrEmps.systemRole === 'admin') roles.push('admin');
            else if (newEmpOrEmps.systemRole === 'hr') roles.push('hr');
            else roles.push('employee'); // Default

            // Create Invitation with full metadata
            await invitationService.createInvitation({
                email: newEmpOrEmps.email,
                organizationId: currentUser.organizationId,
                roles: roles,
                invitedBy: currentUser.uid,
                // Metadata for when they accept or for display
                name: newEmpOrEmps.name,
                lastName: newEmpOrEmps.lastName,
                jobRole: newEmpOrEmps.role, // "role" in form is Job Title
                manager: newEmpOrEmps.manager,
                responsibilities: newEmpOrEmps.responsibilities
            });
            return true; // Sent invite
        } else {
            // No email (placeholder?), create directly
            await addEmployee(newEmpOrEmps);
            return false; // Direct add
        }
    };

    const handleAddEmployee = async (newEmpOrEmps) => {
        try {
            if (Array.isArray(newEmpOrEmps)) {
                // Bulk import logic - Loop and process each
                for (const emp of newEmpOrEmps) {
                    await processAddEmployee(emp);
                }
            } else {
                await processAddEmployee(newEmpOrEmps);
            }

            // Refresh invitations (common for both)
            const invites = await invitationService.getByOrganization(currentUser.organizationId);
            setInvitations(invites.filter(i => i.status === 'pending').map(inv => ({
                ...inv,
                id: inv.id,
                name: inv.name || inv.email?.split('@')[0], // Use metadata name if available
                lastName: inv.lastName || '',
                email: inv.email,
                role: inv.jobRole || inv.roles?.[0] || 'TBD', // Use metadata jobRole
                manager: inv.manager || '',
                systemRole: (inv.roles?.includes('admin') ? 'admin' : (inv.roles?.includes('hr') ? 'hr' : 'employee')),
                status: inv.status || 'Pending',
                rating: inv.rating || 'Pending',
                values: inv.values || [],
                gwc: inv.gwc || [],
                isInvitation: true
            })));

        } catch (err) {
            console.error('Error adding employee:', err);
            // Re-throw to show error in UI if needed
            throw err;
        }
    };

    const handleUpdateEmployee = async (employeeId, updates) => {
        try {
            await updateEmployee(employeeId, updates);
            await updateEmployee(employeeId, updates);
        } catch (err) {
            console.error('Error updating employee:', err);
        }
    };



    // TEMPORARY: Pass a delete handler that handles both.
    const onRemovePerson = async (person) => {
        if (window.confirm(`Are you sure you want to remove ${person.name || person.email}?`)) {
            try {
                if (person.isInvitation) {
                    // Delete invitation
                    // We need to implement delete in invitationService
                    await invitationService.deleteInvitation(person.id);
                    setInvitations(prev => prev.filter(i => i.id !== person.id));
                } else {
                    // Delete employee
                    await employeesService.delete(person.id);
                }
                setShowToast(true); // Reusing toast for success
            } catch (e) {
                console.error("Delete failed", e);
                alert("Failed to delete. Please try again.");
            }
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

    // Invitations State
    const [invitations, setInvitations] = useState([]);

    // Additional Firebase Hooks
    const { getEvaluationsForEmployee } = useEvaluations();

    // Fetch Invitations
    useEffect(() => {
        if (currentUser?.organizationId) {
            invitationService.getByOrganization(currentUser.organizationId)
                .then(invites => {
                    setInvitations(invites.filter(i => i.status === 'pending').map(inv => ({
                        ...inv,
                        id: inv.id,
                        token: inv.token, // Ensure token is passed
                        name: inv.name || inv.email?.split('@')[0], // Use metadata name if available
                        email: inv.email,
                        role: inv.jobRole || inv.roles?.[0] || 'TBD', // Use metadata jobRole
                        manager: inv.manager || '',
                        systemRole: (inv.roles?.includes('admin') ? 'admin' : (inv.roles?.includes('hr') ? 'hr' : 'employee')),
                        status: inv.status || 'Pending',
                        rating: inv.rating || 'Pending', // For dashboard stats
                        values: inv.values || [],
                        gwc: inv.gwc || [],
                        isInvitation: true
                    })));
                })
                .catch(console.error);
        }
    }, [currentUser?.organizationId, showToast]); // Re-fetch on toast/update? Ideally listen to realtime but one-off for now

    const allPeople = [...employees, ...invitations];

    useEffect(() => {
        if (selectedPerson) {
            getEvaluationsForEmployee(selectedPerson.id || selectedPerson.email)
                .then(setEvaluationsForReport)
                .catch(err => console.error('Error fetching evaluations:', err));
        }
    }, [selectedPerson]);




    const handleEvaluationSubmit = async (evalData) => {
        try {
            // 1. Create the evaluation record
            await createEvaluation({
                evaluatedId: personToEvaluate.id || personToEvaluate.email,
                evaluatorId: currentUser.uid,
                organizationId: currentUser.organizationId || 'default',
                ...evalData,
                status: 'completed',
                submittedAt: new Date()
            });

            // 2. Update the Employee record with latest ratings
            // Transform data for Employee model
            const { values, gwc } = transformEvaluationData(
                evalData.values,
                evalData.gwc,
                coreValues
            );

            const rating = calculateRating(values, gwc);

            // Add fields to update
            const updates = {
                values,
                gwc,
                rating,
                lastEvaluated: new Date()
            };

            // Determine if it's a real employee or invitation to invoke correct update method
            if (personToEvaluate.id && !personToEvaluate.isInvitation) {
                await updateEmployee(personToEvaluate.id, updates);
            } else if (personToEvaluate.isInvitation && personToEvaluate.id) {
                // Also update the invitation
                await invitationService.updateInvitation(personToEvaluate.id, updates);

                // Update local state for invitations to reflect change immediately
                setInvitations(prev => prev.map(inv =>
                    inv.id === personToEvaluate.id
                        ? { ...inv, ...updates }
                        : inv
                ));
            } else {
                console.warn("Cannot update stats on non-employee record", personToEvaluate);
            }

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

    // Trial Expiration Check
    if (organization?.subscription_status === 'trialing' && organization?.trial_end) {
        const trialEndDate = new Date(organization.trial_end);
        const now = new Date();

        if (now > trialEndDate) {
            return (
                <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 text-center border border-gray-100">
                        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Clock size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Free Trial Has Ended</h1>
                        <p className="text-gray-500 mb-8">
                            We hope you enjoyed using People Analyzer. To continue managing your team and accessing evaluations, please upgrade to a paid plan.
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/checkout?plan=Growth')}
                                className="w-full py-3 bg-brand-blue text-white rounded-xl font-bold shadow-lg shadow-brand-blue/20 hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                            >
                                <CreditCard size={18} />
                                Upgrade Now
                            </button>
                            <button
                                onClick={() => window.location.href = 'mailto:support@peopleanalyzer.com'}
                                className="w-full py-3 bg-gray-50 text-gray-600 rounded-xl font-semibold hover:bg-gray-100 transition-all"
                            >
                                Contact Support
                            </button>
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <p className="text-xs text-gray-400">
                                Need more time? <a href="#" onClick={(e) => { e.preventDefault(); alert("Please contact support to extend your trial."); }} className="text-brand-blue hover:underline">Request an extension</a>
                            </p>
                        </div>
                    </div>
                </div>
            );
        }
    }

    return (
        <Layout
            activeTab={activeTab}
            onTabChange={setActiveTab}
            companyDetails={organization}
            items={[
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                // Consolidated "Team" and "Admin" into one "Team Management" tab
                ...((hasPermission(currentUser, PERMISSIONS.MANAGE_EMPLOYEES) || hasPermission(currentUser, PERMISSIONS.VIEW_USERS) || currentUser?.role === 'hr') ? [
                    { id: 'admin', label: 'Team Management', icon: Users }
                ] : []),
                { id: 'feedback', label: 'Feedback (Manager)', icon: MessageSquare },
                { id: 'evaluation', label: 'Evaluation', icon: ClipboardList },
                ...((hasPermission(currentUser, PERMISSIONS.MANAGE_ACCOUNTABILITY_CHART)) ? [
                    { id: 'accountability', label: 'Accountability Chart', icon: Network }
                ] : []),
                ...((hasPermission(currentUser, PERMISSIONS.MANAGE_ORGANIZATION)) ? [
                    { id: 'resources', label: 'Resources', icon: BookOpen }
                ] : []),
            ]}
        >
            {activeTab === 'dashboard' && !selectedPerson && (
                <DashboardView
                    employees={allPeople}
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

            {activeTab === 'admin' && (hasPermission(currentUser, PERMISSIONS.MANAGE_EMPLOYEES) || hasPermission(currentUser, PERMISSIONS.VIEW_USERS) || currentUser?.role === 'hr') && (
                <AdminView
                    employees={allPeople}
                    onAddEmployee={handleAddEmployee}
                    onUpdateEmployee={handleUpdateEmployee}
                    onDeleteEmployee={onRemovePerson}
                    onLaunch={handleLaunch}
                    coreValues={coreValues}
                    organizationalRoles={organizationalRoles}
                    onAddCustomRole={addCustomRole}
                    currentUser={currentUser}
                />
            )}

            {activeTab === 'feedback' && (
                <FeedbackView
                    employees={allPeople}
                    currentUser={currentUser}
                />
            )}

            {activeTab === 'evaluation' && (
                personToEvaluate ? (
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
                ) : (
                    <EvaluationDashboard
                        employees={allPeople}
                        currentUser={currentUser}
                        onEvaluate={(person) => {
                            setPersonToEvaluate(person);
                            // Stay on this tab
                        }}
                    />
                )
            )}

            {activeTab === 'accountability' && hasPermission(currentUser, PERMISSIONS.MANAGE_ACCOUNTABILITY_CHART) && (
                <AccountabilityChartView
                    employees={allPeople}
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
                        companyDetails={organization}
                        onUpdateOrganization={updateOrganization}
                    />
                    <QuestionEditor
                        questions={settings?.questions || []}
                        onUpdate={(updatedQuestions) => updateSettings({ questions: updatedQuestions })}
                    />
                </div>
            )}

            {/* Removed UserManagement */}

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

