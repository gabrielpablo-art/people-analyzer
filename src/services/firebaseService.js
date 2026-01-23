import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    onSnapshot,
    serverTimestamp,
    addDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Helper to get organization ID from current user
const getOrgId = () => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return user.organizationId || 'default-org';
};

// ==================== EMPLOYEES ====================

export const employeesService = {
    // Get all employees
    async getAll() {
        const orgId = getOrgId();
        const employeesRef = collection(db, 'organizations', orgId, 'employees');
        const snapshot = await getDocs(employeesRef);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // Get single employee
    async getById(employeeId) {
        const orgId = getOrgId();
        const employeeRef = doc(db, 'organizations', orgId, 'employees', employeeId);
        const snapshot = await getDoc(employeeRef);
        return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    },

    // Create employee
    async create(employeeData) {
        const orgId = getOrgId();
        const employeesRef = collection(db, 'organizations', orgId, 'employees');
        const docRef = await addDoc(employeesRef, {
            ...employeeData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return { id: docRef.id, ...employeeData };
    },

    // Update employee
    async update(employeeId, updates) {
        const orgId = getOrgId();
        const employeeRef = doc(db, 'organizations', orgId, 'employees', employeeId);
        await updateDoc(employeeRef, {
            ...updates,
            updatedAt: serverTimestamp()
        });
        return { id: employeeId, ...updates };
    },

    // Delete employee
    async delete(employeeId) {
        const orgId = getOrgId();
        const employeeRef = doc(db, 'organizations', orgId, 'employees', employeeId);
        await deleteDoc(employeeRef);
    },

    // Real-time listener
    subscribe(callback) {
        const orgId = getOrgId();
        const employeesRef = collection(db, 'organizations', orgId, 'employees');
        return onSnapshot(employeesRef, (snapshot) => {
            const employees = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(employees);
        });
    }
};

// ==================== EVALUATIONS ====================

export const evaluationsService = {
    // Get all evaluations
    async getAll() {
        const orgId = getOrgId();
        const evalsRef = collection(db, 'organizations', orgId, 'evaluations');
        const snapshot = await getDocs(evalsRef);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // Get evaluations for a specific employee
    async getByEmployee(employeeId) {
        const orgId = getOrgId();
        const evalsRef = collection(db, 'organizations', orgId, 'evaluations');
        const q = query(evalsRef, where('evaluatedId', '==', employeeId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // Create evaluation
    async create(evaluationData) {
        const orgId = getOrgId();
        const evalsRef = collection(db, 'organizations', orgId, 'evaluations');
        const docRef = await addDoc(evalsRef, {
            ...evaluationData,
            status: 'pending',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return { id: docRef.id, ...evaluationData };
    },

    // Update evaluation
    async update(evaluationId, updates) {
        const orgId = getOrgId();
        const evalRef = doc(db, 'organizations', orgId, 'evaluations', evaluationId);
        await updateDoc(evalRef, {
            ...updates,
            updatedAt: serverTimestamp()
        });
    },

    // Submit evaluation
    async submit(evaluationId) {
        const orgId = getOrgId();
        const evalRef = doc(db, 'organizations', orgId, 'evaluations', evaluationId);
        await updateDoc(evalRef, {
            status: 'completed',
            submittedAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
    }
};

// ==================== SETTINGS ====================

export const settingsService = {
    // Get organization settings
    async get() {
        const orgId = getOrgId();
        const settingsRef = doc(db, 'organizations', orgId, 'settings', 'config');
        const snapshot = await getDoc(settingsRef);

        if (snapshot.exists()) {
            return snapshot.data();
        }

        // Return defaults if not exists
        return {
            coreValues: ['Humble', 'Hungry', 'Smart', 'Compass', 'Transp'],
            questions: [
                { id: 1, category: 'Apoyo de líder', text: '¿Qué te resulta más útil de mi acompañamiento hoy?' },
                { id: 2, category: 'Apoyo de líder', text: '¿En qué sentís que podría apoyarte mejor?' },
                { id: 3, category: 'Apoyo de líder', text: '¿Hay algo que podría hacer distinto para apoyarte mejor?' }
            ],
            organizationalRoles: {
                predefined: {
                    'C-Suite': ['CEO', 'CTO', 'CFO', 'COO'],
                    'Directors': ['Director of Technology', 'Director of Finance', 'Director of Operations', 'Director of HR'],
                    'Analysts': ['Technology Analyst', 'Finance Analyst', 'Operations Analyst', 'HR Analyst']
                },
                custom: []
            }
        };
    },

    // Update settings
    async update(updates) {
        const orgId = getOrgId();
        const settingsRef = doc(db, 'organizations', orgId, 'settings', 'config');
        await setDoc(settingsRef, {
            ...updates,
            updatedAt: serverTimestamp()
        }, { merge: true });
    },

    // Update core values
    async updateCoreValues(coreValues) {
        await this.update({ coreValues });
    },

    // Update questions
    async updateQuestions(questions) {
        await this.update({ questions });
    },

    // Update organizational roles
    async updateOrganizationalRoles(organizationalRoles) {
        await this.update({ organizationalRoles });
    }
};

// ==================== USERS ====================

export const usersService = {
    // Get user by ID
    async getById(userId) {
        const userRef = doc(db, 'users', userId);
        const snapshot = await getDoc(userRef);
        return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    },

    // Create or update user
    async upsert(userId, userData) {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
            ...userData,
            updatedAt: serverTimestamp()
        }, { merge: true });
    },

    // Get user by email
    async getByEmail(email) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', email));
        const snapshot = await getDocs(q);
        return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    }
};

export default {
    employees: employeesService,
    evaluations: evaluationsService,
    settings: settingsService,
    users: usersService
};
