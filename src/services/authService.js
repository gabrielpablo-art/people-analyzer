import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { usersService, settingsService, organizationsService } from './firebaseService';
import { invitationService } from './invitationService';

const googleProvider = new GoogleAuthProvider();

export const authService = {
    usersService,
    settingsService,
    organizationsService,

    // NEW: Register new Organization (Admin)
    async registerAdmin(email, password, userData, orgData) {
        try {
            // 1. Create Auth User
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Create Organization
            const organizationId = `org_${Date.now()}`;
            const newOrg = {
                name: orgData.name,
                plan_type: orgData.plan || 'starter',
                subscription_status: orgData.plan === 'free_trial' ? 'trialing' : 'active',
                employee_limit: orgData.plan === 'free_trial' ? 10 : (orgData.plan === 'starter' ? 10 : (orgData.plan === 'growth' ? 50 : null)),
                trial_end: orgData.plan === 'free_trial' ? new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() : null,
                createdBy: user.uid
            };
            await organizationsService.create(organizationId, newOrg);

            // 3. Create User Profile (Admin)
            const completeUser = {
                uid: user.uid,
                email: user.email,
                name: userData.fullName,
                roles: ['admin', 'hr', 'evaluator'], // Admin gets all roles by default? Or just admin? Prompt says "Admin", user mentions "Access total".
                organizationId,
                status: 'active',
                company: orgData.name, // Add company name for display purposes
                createdAt: new Date().toISOString()
            };
            await usersService.upsert(user.uid, completeUser);

            // 4. Seed Default Settings
            const defaultSettings = {
                anonymize_responses: false,
                allow_self_evaluation: true,
                coreValues: ['Humble', 'Hungry', 'Smart'],
                organizationalRoles: {
                    predefined: {
                        'C-Suite': ['CEO', 'CTO', 'CFO', 'COO'],
                        'Directors': ['Director of Technology', 'Director of Finance', 'Director of Operations', 'Director of HR'],
                        'Analysts': ['Technology Analyst', 'Finance Analyst', 'Operations Analyst', 'HR Analyst']
                    },
                    custom: []
                }
            };
            await settingsService.update(defaultSettings, organizationId);

            return completeUser;
        } catch (error) {
            console.error('Register Admin error:', error);
            throw error;
        }
    },

    // NEW: Register Invited User
    async registerInvitedUser(email, password, token, name) {
        try {
            // 1. Validate Token & Get Invite Details
            const invitation = await invitationService.validateToken(token);

            // 2. Create Auth User
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 3. Create User Profile
            const completeUser = {
                uid: user.uid,
                email: user.email,
                name: name,
                roles: invitation.roles || ['evaluator'],
                organizationId: invitation.organizationId,
                status: 'active',
                createdAt: new Date().toISOString()
            };

            await usersService.upsert(user.uid, completeUser);

            // 4. Mark invitation as accepted
            await invitationService.acceptInvitation(token);

            // 5. Update local storage for immediate access if needed
            localStorage.setItem('currentUser', JSON.stringify(completeUser));

            return completeUser;
        } catch (error) {
            console.error('Register Invited User error:', error);
            throw error;
        }
    },

    // Sign in
    async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            return user;
        } catch (error) {
            console.warn('Firebase login failed, checking local users...', error.code);

            // Fallback: Check local storage for Super Admin created users
            const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
            const localUser = localUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

            if (localUser) {
                console.log('Found matching local user, simulating login:', localUser.email);

                // Construct a user object that mimics Firebase auth user + profile data
                const mockUser = {
                    uid: localUser.id || `local_${Date.now()}`,
                    email: localUser.email,
                    displayName: localUser.name,
                    isAnonymous: false,
                    ...localUser
                };

                // Save to current session
                localStorage.setItem('currentUser', JSON.stringify(mockUser));
                return mockUser;
            }

            // If no local user found, re-throw original error
            console.error('Sign in error:', error);
            throw error;
        }
    },

    // Sign out
    async signOut() {
        try {
            await signOut(auth);
            localStorage.removeItem('currentUser'); // Legacy cleanup
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

    // Login with Google (Admin registration or generic login?)
    // If used for registration, needs to know if creating Org or Joining
    async loginWithGoogle() {
        try {
            const userCredential = await signInWithPopup(auth, googleProvider);
            const user = userCredential.user;

            // Fetch user profile from Firestore
            const userData = await usersService.getById(user.uid);

            const completeUser = {
                uid: user.uid,
                email: user.email,
                name: user.displayName,
                ...userData
            };

            localStorage.setItem('currentUser', JSON.stringify(completeUser));
            return completeUser;
        } catch (error) {
            console.error('Google login error:', error);
            throw error;
        }
    },

    // Subscribe to auth state changes
    onAuthStateChange(callback) {
        return onAuthStateChanged(auth, callback);
    },

    // Get current user
    getCurrentUser() {
        return auth.currentUser;
    }
};

export default authService;
