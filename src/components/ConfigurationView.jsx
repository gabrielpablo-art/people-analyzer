import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Plus, X, Settings, Building, Upload, Loader } from 'lucide-react';
import { hasPermission, PERMISSIONS } from '../utils/permissions';
import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const ConfigurationView = ({
    coreValues,
    onAddValue,
    onRemoveValue,
    onUpdateValue,
    currentUser,
    organizationalRoles,
    onAddCustomRole,
    onRemoveCustomRole,
    companyDetails,
    onUpdateOrganization
}) => {
    const canEdit = hasPermission(currentUser, PERMISSIONS.MANAGE_CORE_VALUES);
    const [newValue, setNewValue] = useState('');
    const [newRole, setNewRole] = useState('');

    // Company Details State
    const [companyName, setCompanyName] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // Initialize state from props
    useEffect(() => {
        if (companyDetails) {
            setCompanyName(companyDetails.name || '');
            setLogoUrl(companyDetails.logoUrl || '');
        }
    }, [companyDetails]);

    const handleAdd = () => {
        if (newValue.trim()) {
            onAddValue(newValue.trim());
            setNewValue('');
        }
    };

    const handleAddRole = () => {
        if (newRole.trim()) {
            onAddCustomRole(newRole.trim());
            setNewRole('');
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        console.log("Starting logo upload...", file.name);
        setIsUploading(true);
        try {
            // Upload to company_logos/{orgId}/{filename}
            const orgId = companyDetails?.id || currentUser?.organizationId || 'default-org';
            console.log("Target Org ID for storage:", orgId);

            const storageRef = ref(storage, `company_logos/${orgId}/${file.name}`);
            console.log("Uploading bytes to:", storageRef.fullPath);

            const snapshot = await uploadBytes(storageRef, file);
            console.log("Upload completed, getting download URL...", snapshot);

            const downloadUrl = await getDownloadURL(storageRef);
            console.log("Download URL received:", downloadUrl);

            setLogoUrl(downloadUrl);
            if (onUpdateOrganization) {
                console.log("Calling onUpdateOrganization...");
                await onUpdateOrganization({ logoUrl: downloadUrl });
                console.log("Organization update completed.");
            } else {
                console.warn("onUpdateOrganization prop is missing!");
            }
        } catch (error) {
            console.error("Error uploading logo:", error);
            alert(`Failed to upload logo: ${error.message}`);
        } finally {
            console.log("Upload process finished, resetting state.");
            setIsUploading(false);
        }
    };

    const handleNameChange = (e) => {
        setCompanyName(e.target.value);
    };

    const handleNameBlur = () => {
        if (companyDetails && companyName !== companyDetails.name) {
            if (onUpdateOrganization) {
                onUpdateOrganization({ name: companyName });
            }
        }
    };


    return (
        <div className="space-y-6">
            <Card className="bg-white border-0 shadow-sm">
                <CardContent className="flex items-center gap-4 p-6">
                    <div className="p-3 bg-brand-blue/10 rounded-xl text-brand-blue">
                        <Settings size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Configuration</h3>
                        <p className="text-sm text-gray-500">Customize your People Analyzer parameters.</p>
                    </div>
                </CardContent>
            </Card>

            {/* Company Details Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building size={20} className="text-gray-400" />
                        Company Details
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                        Configure your company branding and details.
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6 max-w-xl">
                        {/* Company Logo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden">
                                    {logoUrl ? (
                                        <img src={logoUrl} alt="Company Logo" className="w-full h-full object-contain p-1" />
                                    ) : (
                                        <Building size={24} className="text-gray-300" />
                                    )}
                                </div>
                                <div>
                                    <label className={`inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors ${!canEdit || isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                        {isUploading ? <Loader size={16} className="animate-spin" /> : <Upload size={16} />}
                                        {isUploading ? 'Uploading...' : 'Upload Logo'}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} disabled={!canEdit || isUploading} />
                                    </label>
                                    <p className="text-xs text-gray-400 mt-1">Recommended size: 200x200px. Max 2MB.</p>
                                </div>
                            </div>
                        </div>

                        {/* Company Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                            <input
                                type="text"
                                value={companyName}
                                onChange={handleNameChange}
                                onBlur={handleNameBlur}
                                disabled={!canEdit}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                                placeholder="Enter company name..."
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Core Values</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                        Define the core values that will be used to evaluate all employees.
                        These will appear as columns in the People Analyzer table.
                    </p>
                </CardHeader>

                <CardContent>
                    <div className="space-y-4 max-w-xl">
                        {coreValues.map((value, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <input
                                    type="text"
                                    value={value}
                                    onChange={(e) => onUpdateValue(index, e.target.value)}
                                    disabled={!canEdit}
                                    className={`flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all ${!canEdit ? 'bg-gray-100 cursor-not-allowed opacity-70' : 'bg-gray-50'}`}
                                    placeholder="Value name"
                                />
                                {canEdit && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onRemoveValue(index)}
                                        className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                                    >
                                        <X size={18} />
                                    </Button>
                                )}
                            </div>
                        ))}

                        {canEdit && (
                            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                <input
                                    type="text"
                                    value={newValue}
                                    onChange={(e) => setNewValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                                    className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                                    placeholder="Add new core value..."
                                />
                                <Button
                                    onClick={handleAdd}
                                    variant="secondary"
                                    className="gap-2"
                                >
                                    <Plus size={18} />
                                    Add
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Organizational Roles</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                        Define the roles that can be assigned to employees. Predefined roles cannot be removed.
                    </p>
                </CardHeader>

                <CardContent>
                    <div className="space-y-6 max-w-2xl">
                        {/* Predefined Roles by Category */}
                        {organizationalRoles && Object.entries(organizationalRoles.predefined).map(([category, roles]) => (
                            <div key={category} className="space-y-3">
                                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{category}</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {roles.map((role, index) => (
                                        <div
                                            key={index}
                                            className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-lg text-sm text-gray-700 font-medium"
                                        >
                                            {role}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Custom Roles */}
                        {organizationalRoles && organizationalRoles.custom.length > 0 && (
                            <div className="space-y-3 pt-4 border-t border-gray-100">
                                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Custom Roles</h4>
                                <div className="space-y-2">
                                    {organizationalRoles.custom.map((role, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="flex-1 px-4 py-2 bg-purple-50 border border-purple-100 rounded-lg text-sm text-gray-700 font-medium">
                                                {role}
                                            </div>
                                            {canEdit && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => onRemoveCustomRole(index)}
                                                    className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                                                >
                                                    <X size={18} />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Add Custom Role */}
                        {canEdit && (
                            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                <input
                                    type="text"
                                    value={newRole}
                                    onChange={(e) => setNewRole(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddRole()}
                                    className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                                    placeholder="Add custom role (e.g., VP of Marketing)..."
                                />
                                <Button
                                    onClick={handleAddRole}
                                    variant="secondary"
                                    className="gap-2"
                                >
                                    <Plus size={18} />
                                    Add
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
