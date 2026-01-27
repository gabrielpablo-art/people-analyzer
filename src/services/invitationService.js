import { db } from '../config/firebase';
import { emailService } from './emailService';
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    updateDoc,
    doc,
    serverTimestamp,
    getDoc,
    deleteDoc
} from 'firebase/firestore';

const COLLECTION = 'invitations';

export const invitationService = {
    /**
     * Creates a new invitation.
     * @param {Object} inviteData - { email, roles, organizationId, invitedBy }
     */
    async createInvitation(inviteData) {
        // Generate a simple token (in production use a more secure method or cloud function)
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        const docRef = await addDoc(collection(db, COLLECTION), {
            ...inviteData,
            token,
            status: 'pending',
            createdAt: serverTimestamp(),
            createdAt: serverTimestamp(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        });

        // Simulate sending email
        const inviteLink = `${window.location.origin}/accept-invite?token=${token}`;
        await emailService.sendEmail(inviteData.email, 'perfReviewInvite', {
            name: 'Colleague', // Ideally we'd have the name, but for now generic
            link: inviteLink,
            cycleName: 'Annual Review' // Mock data
        });

        return { id: docRef.id, token };
    },

    /**
     * Validates an invitation token.
     * @param {string} token 
     * @returns {Object|null} The invitation data if valid, throws error otherwise.
     */
    async validateToken(token) {
        const q = query(collection(db, COLLECTION), where('token', '==', token), where('status', '==', 'pending'));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            throw new Error('Invalid or expired invitation token.');
        }

        const inviteDoc = snapshot.docs[0];
        const data = inviteDoc.data();

        // Check expiration
        if (new Date(data.expiresAt) < new Date()) {
            throw new Error('Invitation has expired.');
        }

        return { id: inviteDoc.id, ...data };
    },

    /**
     * Marks an invitation as accepted.
     * @param {string} token 
     */
    async acceptInvitation(token) {
        const q = query(collection(db, COLLECTION), where('token', '==', token));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            const docRef = snapshot.docs[0].ref;
            await updateDoc(docRef, {
                status: 'accepted',
                acceptedAt: serverTimestamp()
            });
        }
    },

    /**
     * Fetches invitations for an organization.
     */
    async getByOrganization(organizationId) {
        const q = query(collection(db, COLLECTION), where('organizationId', '==', organizationId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    /**
     * Deletes an invitation.
     */
    async deleteInvitation(id) {
        await deleteDoc(doc(db, COLLECTION, id));
    }
};
