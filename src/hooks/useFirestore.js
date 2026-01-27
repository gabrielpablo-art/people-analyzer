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
