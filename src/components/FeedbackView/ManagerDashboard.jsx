import React from 'react';
import { User, ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const ManagerDashboard = ({ employees, onSelectReport }) => {
    // Filter logic would go here. For now, we assume all passed employees are relevant or we filter them if we have manager info.
    // Since we might not have real manager relationships yet, we'll display all for MVP or filter if 'manager' field exists.

    // Mock data for card display
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'text-green-600 bg-green-50';
            case 'pending': return 'text-orange-600 bg-orange-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div className="space-y-8">
            {/* Global Metrics Panel */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 font-medium">Total Direct Reports</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{employees.length}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 font-medium">Evaluations Completed</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">0% (0/0)</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 font-medium">Pending Reviews</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 font-medium">Team Average</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">-</p>
                </div>
            </div>

            {/* Reports Grid */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">My Direct Reports</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {employees.map(emp => (
                        <button
                            key={emp.id}
                            onClick={() => onSelectReport(emp)}
                            className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-blue/30 transition-all text-left group w-full"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden">
                                        {emp.photoUrl ? (
                                            <img src={emp.photoUrl} alt={emp.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <User size={20} />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 group-hover:text-brand-blue transition-colors">
                                            {emp.name} {emp.surname}
                                        </h4>
                                        <p className="text-xs text-gray-500">{emp.role || 'No Role'}</p>
                                    </div>
                                </div>
                                <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor('pending')}`}>
                                    Pending
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-500">Evaluation Progress</span>
                                        <span className="text-gray-700 font-medium">0%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                        <div className="bg-brand-blue h-full rounded-full w-0" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">Avg Score</span>
                                        <span className="font-semibold text-gray-900">-</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">Trend</span>
                                        <span className="text-gray-400 flex items-center gap-1 text-xs">
                                            <Minus size={12} /> Stable
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
