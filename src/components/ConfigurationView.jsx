import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Plus, X, Settings } from 'lucide-react';
import { hasPermission, PERMISSIONS } from '../utils/permissions';

export const ConfigurationView = ({
    coreValues,
    onAddValue,
    onRemoveValue,
    onUpdateValue,
    currentUser,
    organizationalRoles,
    onAddCustomRole,
    onRemoveCustomRole
}) => {
    const canEdit = hasPermission(currentUser, PERMISSIONS.MANAGE_CORE_VALUES);
    const [newValue, setNewValue] = useState('');
    const [newRole, setNewRole] = useState('');

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
