import { db } from '../config/firebase';
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    updateDoc,
    doc,
    orderBy,
    onSnapshot,
    writeBatch
} from 'firebase/firestore';

const NOTIFICATIONS_COLLECTION = 'notifications';

export const notificationService = {
    /**
     * Create a new notification
     * @param {string} organizationId - Organization ID
     * @param {string} userId - Target user ID
     * @param {object} notificationData - Notification data
     */
    async create(organizationId, userId, notificationData) {
        try {
            const notificationRef = collection(db, NOTIFICATIONS_COLLECTION);
            const newNotification = {
                organizationId,
                userId,
                type: notificationData.type,
                title: notificationData.title,
                message: notificationData.message,
                link: notificationData.link || null,
                read: false,
                createdAt: new Date().toISOString(),
                ...notificationData
            };

            const docRef = await addDoc(notificationRef, newNotification);
            return { id: docRef.id, ...newNotification };
        } catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        }
    },

    /**
     * Get all notifications for a user
     * @param {string} organizationId - Organization ID
     * @param {string} userId - User ID
     */
    async getByUser(organizationId, userId) {
        try {
            const notificationsRef = collection(db, NOTIFICATIONS_COLLECTION);
            const q = query(
                notificationsRef,
                where('organizationId', '==', organizationId),
                where('userId', '==', userId),
                orderBy('createdAt', 'desc')
            );

            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    },

    /**
     * Subscribe to real-time notifications for a user
     * @param {string} organizationId - Organization ID
     * @param {string} userId - User ID
     * @param {function} callback - Callback function with notifications data
     */
    subscribe(organizationId, userId, callback) {
        try {
            const notificationsRef = collection(db, NOTIFICATIONS_COLLECTION);
            const q = query(
                notificationsRef,
                where('organizationId', '==', organizationId),
                where('userId', '==', userId),
                orderBy('createdAt', 'desc')
            );

            return onSnapshot(q, (snapshot) => {
                const notifications = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                callback(notifications);
            });
        } catch (error) {
            console.error('Error subscribing to notifications:', error);
            throw error;
        }
    },

    /**
     * Mark a notification as read
     * @param {string} notificationId - Notification ID
     */
    async markAsRead(notificationId) {
        try {
            const notificationRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
            await updateDoc(notificationRef, { read: true });
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    },

    /**
     * Mark all notifications as read for a user
     * @param {string} organizationId - Organization ID
     * @param {string} userId - User ID
     */
    async markAllAsRead(organizationId, userId) {
        try {
            const notificationsRef = collection(db, NOTIFICATIONS_COLLECTION);
            const q = query(
                notificationsRef,
                where('organizationId', '==', organizationId),
                where('userId', '==', userId),
                where('read', '==', false)
            );

            const snapshot = await getDocs(q);
            const batch = writeBatch(db);

            snapshot.docs.forEach((document) => {
                batch.update(document.ref, { read: true });
            });

            await batch.commit();
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            throw error;
        }
    },

    /**
     * Helper: Create evaluation pending notification
     */
    async notifyEvaluationPending(organizationId, userId, employeeName) {
        return this.create(organizationId, userId, {
            type: 'evaluation_pending',
            title: 'Pending Evaluation',
            message: `You have a pending evaluation for ${employeeName}`,
            link: '/app?tab=evaluation'
        });
    },

    /**
     * Helper: Create feedback received notification
     */
    async notifyFeedbackReceived(organizationId, userId, fromName) {
        return this.create(organizationId, userId, {
            type: 'feedback_received',
            title: 'New Feedback',
            message: `You received feedback from ${fromName}`,
            link: '/app?tab=feedback'
        });
    },

    /**
     * Helper: Create team update notification
     */
    async notifyTeamUpdate(organizationId, userId, updateMessage) {
        return this.create(organizationId, userId, {
            type: 'team_update',
            title: 'Team Update',
            message: updateMessage,
            link: '/app?tab=team'
        });
    },

    /**
     * Helper: Create system announcement
     */
    async notifySystemAnnouncement(organizationId, userId, title, message) {
        return this.create(organizationId, userId, {
            type: 'system_announcement',
            title: title,
            message: message,
            link: null
        });
    }
};

export default notificationService;
