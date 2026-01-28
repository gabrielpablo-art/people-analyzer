import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/ui/Logo';
import { User, Lock, Camera, Save, ArrowLeft, Mail } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { db, storage } from '../config/firebase';
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function ProfilePage() {
    const { currentUser, userProfile: authUserProfile } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // Note: Real password change requires Auth API
    const [avatar, setAvatar] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (authUserProfile) {
            setName(authUserProfile.name || '');
            setEmail(authUserProfile.email || currentUser?.email || '');
            // Password usually isn't stored in plain text in profile, leaving blank or placeholder
            setAvatar(authUserProfile.avatar || authUserProfile.photoURL || null);
        } else if (currentUser) {
            setEmail(currentUser.email || '');
        }
    }, [authUserProfile, currentUser]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            // Preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            let photoURL = avatar;

            // Upload image if selected
            if (imageFile && currentUser) {
                const storageRef = ref(storage, `profile_photos/${currentUser.uid}/${imageFile.name}`);
                await uploadBytes(storageRef, imageFile);
                photoURL = await getDownloadURL(storageRef);
            }

            // Update Firestore User Profile
            if (currentUser) {
                const userRef = doc(db, 'users', currentUser.uid);
                const updates = {
                    name,
                    avatar: photoURL,
                    photoURL: photoURL, // Standard field
                };
                await updateDoc(userRef, updates);

                // Update localStorage to reflect changes immediately in Sidebar
                const stored = localStorage.getItem('currentUser');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    const updatedUser = { ...parsed, ...updates };
                    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

                    // Dispatch storage event to notify listeners (Sidebar)
                    window.dispatchEvent(new Event('storage'));
                }

                // Sync with Employee Record if available (so it shows in Dashboard/OrgChart)
                if (authUserProfile?.organizationId) {
                    try {
                        const employeesRef = collection(db, 'organizations', authUserProfile.organizationId, 'employees');
                        // Try to find employee by email (standard link) or uid if available
                        const q = query(employeesRef, where('email', '==', currentUser.email));
                        const querySnapshot = await getDocs(q);

                        if (!querySnapshot.empty) {
                            const employeeDoc = querySnapshot.docs[0];
                            await updateDoc(doc(db, 'organizations', authUserProfile.organizationId, 'employees', employeeDoc.id), {
                                name, // Sync name too
                                avatar: photoURL,
                                photoURL: photoURL
                            });
                        }
                    } catch (syncErr) {
                        console.error("Error syncing with employee record:", syncErr);
                        // Don't fail the whole operation if just sync fails
                    }
                }
            }

            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage('Error updating profile: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6 flex flex-col items-center sm:items-start">
                    <div className="w-full flex justify-between items-center mb-6">
                        <Link to="/app" className="inline-flex items-center text-gray-500 hover:text-gray-900 transition-colors">
                            <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
                        </Link>
                        <Logo iconSize="w-6 h-6" textSize="text-base" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                    <p className="text-gray-500">Manage your account details and preferences.</p>
                </div>

                <Card className="bg-white p-8 shadow-sm border border-gray-100">
                    <form onSubmit={handleSave} className="space-y-8">

                        {/* Avatar Section */}
                        <div className="flex flex-col items-center justify-center">
                            <div className="relative group cursor-pointer">
                                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                                    {avatar ? (
                                        <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={40} className="text-gray-400" />
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 bg-brand-blue text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors shadow-sm">
                                    <Camera size={14} />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">Click icon to upload new photo</p>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue transition-colors"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        value={email}
                                        disabled
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1 ml-1">Email cannot be changed.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="password"
                                        value={password}
                                        disabled
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1 ml-1">Password change not yet supported.</p>
                            </div>
                        </div>

                        {message && (
                            <div className={`text-sm font-semibold text-center animate-in fade-in slide-in-from-bottom-2 ${message.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
                                {message}
                            </div>
                        )}

                        <Button type="submit" variant="primary" className="w-full h-12 text-lg shadow-lg shadow-brand-blue/20" disabled={loading}>
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            ) : (
                                <Save size={18} className="mr-2" />
                            )}
                            Save Changes
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}


