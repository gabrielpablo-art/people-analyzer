import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase'; // Adjust path if needed

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [organization, setOrganization] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                try {
                    // Fetch user profile from Firestore
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUserProfile(userData);

                        // If user belongs to an organization, fetch it
                        if (userData.organizationId) {
                            const orgDocRef = doc(db, 'organizations', userData.organizationId);
                            const orgDoc = await getDoc(orgDocRef);
                            if (orgDoc.exists()) {
                                setOrganization(orgDoc.data());
                            }
                        }
                    } else {
                        // Handle case where auth exists but firestore doc doesn't (registration in progress)
                        console.log('User document not found (yet).');
                        setUserProfile(null);
                        setOrganization(null);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    // Optionally set an error state here
                }
            } else {
                setCurrentUser(null);
                setUserProfile(null);
                setOrganization(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userProfile,
        organization,
        loading,
        userRoles: userProfile?.roles || [], // Helper to access roles directly
        isAuthenticated: !!currentUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
