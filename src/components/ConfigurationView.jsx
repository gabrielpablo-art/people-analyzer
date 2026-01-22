import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Plus, X, Settings } from 'lucide-react';

export const ConfigurationView = ({
    coreValues,
    onAddValue,
    onRemoveValue,
    onUpdateValue
}) => {
    const [newValue, setNewValue] = useState('');

    const handleAdd = () => {
        if (newValue.trim()) {
            onAddValue(newValue.trim());
            setNewValue('');
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
                                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                                    placeholder="Value name"
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onRemoveValue(index)}
                                    className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                                >
                                    <X size={18} />
                                </Button>
                            </div>
                        ))}

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
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
