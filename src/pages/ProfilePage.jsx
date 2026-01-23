import React, { useState, useEffect } from 'react';
import { User, Lock, Camera, Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button'; // Assuming Button component exists based on other files
import { Card } from '../components/ui/Card';     // Assuming Card component exists

export default function ProfilePage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const storedUserJSON = localStorage.getItem('currentUser');
        if (storedUserJSON) {
            const user = JSON.parse(storedUserJSON);
            setName(user.name || '');
            setEmail(user.email || '');
            setPassword(user.password || '');
            setAvatar(user.avatar || null);
        }
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        const updatedUser = {
            name,
            email, // Email usually immutable or requires re-verification, keeping it editable for mock
            password,
            avatar
        };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        setMessage('Profile updated successfully!');

        // Clear message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <Link to="/app" className="inline-flex items-center text-gray-500 hover:text-gray-900 transition-colors mb-4">
                        <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
                    </Link>
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
                                        type="text" // Using text to see password for edit simplicity in this mock
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue transition-colors"
                                        placeholder="New Password"
                                    />
                                </div>
                            </div>
                        </div>

                        {message && (
                            <div className="text-green-600 text-sm font-semibold text-center animate-in fade-in slide-in-from-bottom-2">
                                {message}
                            </div>
                        )}

                        <Button type="submit" variant="primary" className="w-full h-12 text-lg shadow-lg shadow-brand-blue/20">
                            <Save size={18} className="mr-2" /> Save Changes
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}

// Simple fallback internal components if imports fail or differ
function Mail({ className, size }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>;
}
