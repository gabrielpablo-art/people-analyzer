import {
    collection,
    doc,
    getDocs,
    getDoc,
    setDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    serverTimestamp,
    orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ==================== PLANS ====================

export const getPlans = async () => {
    const plansRef = collection(db, 'subscription_plans');
    const q = query(plansRef, orderBy('price', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const createPlan = async (planData) => {
    const plansRef = collection(db, 'subscription_plans');
    const docRef = await addDoc(plansRef, {
        ...planData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...planData };
};

export const updatePlan = async (planId, updates) => {
    const planRef = doc(db, 'subscription_plans', planId);
    await updateDoc(planRef, {
        ...updates,
        updatedAt: serverTimestamp()
    });
    return { id: planId, ...updates };
};

export const deletePlan = async (planId) => {
    const planRef = doc(db, 'subscription_plans', planId);
    await deleteDoc(planRef);
};

// ==================== COUPONS ====================

export const getCoupons = async () => {
    const couponsRef = collection(db, 'coupons');
    const q = query(couponsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const createCoupon = async (couponData) => {
    const couponsRef = collection(db, 'coupons');
    // couponData should include: code, discountPercent, startDate, endDate, maxUses (optional)
    const docRef = await addDoc(couponsRef, {
        ...couponData,
        usageCount: 0,
        usedBy: [], // Array of orgIds
        createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...couponData };
};

export const updateCoupon = async (couponId, updates) => {
    const couponRef = doc(db, 'coupons', couponId);
    await updateDoc(couponRef, {
        ...updates
    });
    return { id: couponId, ...updates };
};

export const deleteCoupon = async (couponId) => {
    const couponRef = doc(db, 'coupons', couponId);
    await deleteDoc(couponRef);
};

// ==================== SUBSCRIPTION MANAGEMENT ====================

// Update an organization's subscription details
export const updateOrganizationSubscription = async (orgId, subscriptionData) => {
    // subscriptionData: planId, startDate, endDate, status, autoRenew, etc.
    const orgRef = doc(db, 'organizations', orgId);
    await updateDoc(orgRef, {
        subscription: {
            ...subscriptionData,
            updatedAt: serverTimestamp()
        }
    });
};

// Record that a company used a coupon
export const recordCouponUsage = async (couponId, orgId) => {
    const couponRef = doc(db, 'coupons', couponId);
    const couponSnap = await getDoc(couponRef);

    if (!couponSnap.exists()) throw new Error("Coupon not found");

    const couponData = couponSnap.data();
    const usedBy = couponData.usedBy || [];

    if (!usedBy.includes(orgId)) {
        await updateDoc(couponRef, {
            usedBy: [...usedBy, orgId],
            usageCount: (couponData.usageCount || 0) + 1
        });
    }
};

export const subscriptionService = {
    getPlans,
    createPlan,
    updatePlan,
    deletePlan,
    getCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    updateOrganizationSubscription,
    recordCouponUsage
};

export default subscriptionService;
