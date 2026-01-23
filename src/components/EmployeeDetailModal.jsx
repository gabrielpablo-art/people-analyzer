import React from 'react';
import { X, Sparkles, MessageSquare } from 'lucide-react';

export const EmployeeDetailModal = ({ employee, onClose }) => {
    if (!employee) return null;

    // Simulated AI Synthesis
    const aiSummary = employee.feedback && employee.feedback.length > 0
        ? `Based on ${employee.feedback.length} peer reviews, ${employee.name} is perceived as a ${employee.values.filter(v => v === '+').length > 2 ? 'strong culture carrier' : 'developing team member'}. Key strengths include technical execution and reliability. Areas for improvement noted in recent feedback highlight communication cadence and delegation.`
        : "Not enough feedback data to generate an AI synthesis yet.";

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl scale-100 animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand-blue rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{employee.name}</h3>
                            <p className="text-sm text-gray-500">{employee.role} • Managed by {employee.manager}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-8">

                    {/* AI Synthesis Section */}
                    <div className="bg-brand-blue/5 border border-brand-blue/10 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Sparkles size={100} className="text-brand-blue" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3 text-brand-blue font-bold text-sm uppercase tracking-wide">
                                <Sparkles size={16} />
                                AI Performance Synthesis
                            </div>
                            <p className="text-gray-700 leading-relaxed font-medium">
                                {aiSummary}
                            </p>
                        </div>
                    </div>

                    {/* Raw Feedback List */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <MessageSquare size={18} className="text-gray-400" />
                            Recent Peer Feedback
                        </h4>

                        {employee.feedback && employee.feedback.length > 0 ? (
                            <div className="space-y-3">
                                {employee.feedback.map((fb, i) => (
                                    <div key={i} className="p-4 bg-gray-50 rounded-xl text-sm text-gray-600 italic border border-gray-100">
                                        "{fb}"
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                No feedback collected yet for this cycle.
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors text-sm shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
