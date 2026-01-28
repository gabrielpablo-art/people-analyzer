import { useState, useEffect } from 'react';
import { employeesService, evaluationsService, settingsService } from '../services/firebaseService';

// Hook for employees
export const useEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let unsubscribe;

        const loadEmployees = async () => {
            try {
                setLoading(true);
                // Subscribe to real-time updates
                unsubscribe = employeesService.subscribe((data) => {
                    setEmployees(data);
                    setLoading(false);
                });
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        loadEmployees();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    const addEmployee = async (employeeData) => {
        try {
            await employeesService.create(employeeData);
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    const updateEmployee = async (employeeId, updates) => {
        try {
            await employeesService.update(employeeId, updates);
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    const deleteEmployee = async (employeeId) => {
        try {
            await employeesService.delete(employeeId);
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    return {
        employees,
        loading,
        error,
        addEmployee,
        updateEmployee,
        deleteEmployee
    };
};

// Hook for settings with caching
let settingsCache = null;
let settingsCacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useSettings = () => {
    const [settings, setSettings] = useState(settingsCache);
    const [loading, setLoading] = useState(!settingsCache);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                // Check if cache is still valid
                if (settingsCache && settingsCacheTime && Date.now() - settingsCacheTime < CACHE_DURATION) {
                    setSettings(settingsCache);
                    setLoading(false);
                    return;
                }

                setLoading(true);
                const data = await settingsService.get();
                settingsCache = data;
                settingsCacheTime = Date.now();
                setSettings(data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        loadSettings();
    }, []);

    const updateSettings = async (updates) => {
        try {
            await settingsService.update(updates);
            const updatedSettings = { ...settings, ...updates };
            settingsCache = updatedSettings;
            settingsCacheTime = Date.now();
            setSettings(updatedSettings);
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    return {
        settings,
        loading,
        error,
        updateSettings
    };
};

// Hook for evaluations
export const useEvaluations = (employeeId = null) => {
    const [evaluations, setEvaluations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadEvaluations = async () => {
            try {
                setLoading(true);
                const data = employeeId
                    ? await evaluationsService.getByEmployee(employeeId)
                    : await evaluationsService.getAll();
                setEvaluations(data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        loadEvaluations();
    }, [employeeId]);

    const createEvaluation = async (evaluationData) => {
        try {
            const newEval = await evaluationsService.create(evaluationData);
            setEvaluations([...evaluations, newEval]);
            return newEval;
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    const submitEvaluation = async (evaluationId) => {
        try {
            await evaluationsService.submit(evaluationId);
            setEvaluations(evaluations.map(e =>
                e.id === evaluationId ? { ...e, status: 'completed' } : e
            ));
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    const getEvaluationsForEmployee = async (employeeId) => {
        try {
            const data = await evaluationsService.getByEmployee(employeeId);
            return data;
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    const getEvaluationsByEvaluator = async (evaluatorId) => {
        try {
            const data = await evaluationsService.getByEvaluator(evaluatorId);
            return data;
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    return {
        evaluations,
        loading,
        error,
        createEvaluation,
        submitEvaluation,
        getEvaluationsForEmployee,
        getEvaluationsByEvaluator
    };
};

// Hook for organization details
export const useOrganization = () => {
    const [organization, setOrganization] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let unsubscribe;

        const loadOrganization = async () => {
            try {
                // Get current user to find orgId
                const stored = localStorage.getItem('currentUser');
                if (!stored || stored === 'undefined') {
                    setLoading(false);
                    return;
                }
                const user = JSON.parse(stored);
                const orgId = user.organizationId;

                if (!orgId) {
                    setLoading(false);
                    return;
                }

                setLoading(true);
                // Subscribe to real-time updates for organization
                // We need to use onSnapshot on the specific doc
                const { doc, onSnapshot } = await import('firebase/firestore');
                const { db } = await import('../config/firebase');

                const orgRef = doc(db, 'organizations', orgId);

                unsubscribe = onSnapshot(orgRef, (docSnapshot) => {
                    if (docSnapshot.exists()) {
                        setOrganization({ id: docSnapshot.id, ...docSnapshot.data() });
                    } else {
                        setOrganization(null);
                    }
                    setLoading(false);
                }, (err) => {
                    console.error("Error fetching organization:", err);
                    setError(err);
                    setLoading(false);
                });

            } catch (err) {
                console.error("Error setting up organization listener:", err);
                setError(err);
                setLoading(false);
            }
        };

        loadOrganization();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    const updateOrganization = async (updates) => {
        try {
            const { organizationsService } = await import('../services/firebaseService');

            let orgId = organization?.id;
            if (!orgId) {
                // Fallback to localStorage if state not yet populated
                try {
                    const stored = localStorage.getItem('currentUser');
                    if (stored && stored !== 'undefined') {
                        const user = JSON.parse(stored);
                        orgId = user.organizationId;
                    }
                } catch (e) {
                    // Ignore parsing error
                }
            }

            if (!orgId) {
                throw new Error("Organization ID not found. Cannot update.");
            }

            await organizationsService.update(orgId, updates);

            // Optimistically update local state
            if (organization) {
                setOrganization({ ...organization, ...updates });
            }
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    return {
        organization,
        loading,
        error,
        updateOrganization
    };
};
