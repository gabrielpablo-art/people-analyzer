import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { usersService, settingsService } from './firebaseService';

export const authService = {
    // Sign in
    async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Get user data from Firestore
            const userData = await usersService.getById(user.uid);

            const completeUser = {
                uid: user.uid,
                email: user.email,
                ...userData
            };

            // Sync with localStorage for quick access if needed (optional, but good for backward compatibility)
            localStorage.setItem('currentUser', JSON.stringify(completeUser));

            return completeUser;
        } catch (error) {
            console.error('Sign in error:', error);
            throw error;
        }
    },

    // Register
    async register(email, password, userData) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Generate a unique organization ID if not provided
            const organizationId = userData.organizationId || `org_${Date.now()}`;

            // Create user document in Firestore
            const completeUser = {
                uid: user.uid,
                email: user.email,
                ...userData,
                organizationId,
                createdAt: new Date().toISOString()
            };

            await usersService.upsert(user.uid, completeUser);

            // Seed default settings for the new organization
            const defaultSettings = {
                organizationId,
                coreValues: ['Humble', 'Hungry', 'Smart'],
                organizationalRoles: {
                    predefined: {
                        'C-Suite': ['CEO', 'CTO', 'CFO', 'COO'],
                        'Directors': ['Director of Technology', 'Director of Finance', 'Director of Operations', 'Director of HR'],
                        'Analysts': ['Technology Analyst', 'Finance Analyst', 'Operations Analyst', 'HR Analyst']
                    },
                    custom: []
                },
                questions: [
                    { id: 1, category: 'Growth', text: 'What is one thing this person did well this quarter?' },
                    { id: 2, category: 'Growth', text: 'What is one area where this person can improve?' },
                    { id: 3, category: 'Support', text: 'How can I support you better in your role?' }
                ]
            };

            await settingsService.update(defaultSettings);

            // Sync with localStorage
            localStorage.setItem('currentUser', JSON.stringify(completeUser));

            return completeUser;
        } catch (error) {
            console.error('Sign up error:', error);
            throw error;
        }
    },

    // Sign out
    async signOut() {
        try {
            await signOut(auth);
            localStorage.removeItem('currentUser');
        } catch (error) {
            console.error('Sign out error:', error);
            throw error;
        }
    },

    // Reset password
    async resetPassword(email) {
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error) {
            console.error('Reset password error:', error);
            throw error;
        }
    },

    // Auth state observer
    onAuthStateChange(callback) {
        return onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userData = await usersService.getById(user.uid);
                callback({
                    uid: user.uid,
                    email: user.email,
                    ...userData
                });
            } else {
                callback(null);
            }
        });
    },

    // Get current user
    getCurrentUser() {
        return auth.currentUser;
    }
};

export default authService;
