import React from 'react';
import { ArrowLeft, Calendar, Mail, CheckCircle2, AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const IndividualReport = ({ employee, onBack }) => {
    // Mock Data
    const mockEvaluators = [
        { name: 'Direct Manager', role: 'Manager', status: 'completed', date: '2026-01-15' },
        { name: 'Self Review', role: 'Self', status: 'completed', date: '2026-01-14' },
        { name: 'Peer Reviewer 1', role: 'Peer', status: 'pending', date: null },
    ];

    const mockChartData = [
        { name: 'Q1 2025', score: 3.2 },
        { name: 'Q2 2025', score: 3.5 },
        { name: 'Q3 2025', score: 3.8 },
        { name: 'Q4 2025', score: 4.1 },
        { name: 'Q1 2026', score: 4.2 },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900"
                >
                    <ArrowLeft size={24} />
                </button>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">{employee.name} {employee.surname}</h2>
                    <p className="text-gray-500">{employee.role} • {employee.department || 'General'}</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium">
                        <Calendar size={16} />
                        Schedule Feedback
                    </button>
                </div>
            </div>

            {/* Evaluation Status Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Evaluation Status (Q1 2026)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Completed */}
                    <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Completed (2/3)</h4>
                        <div className="space-y-3">
                            {mockEvaluators.filter(e => e.status === 'completed').map((ev, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center text-green-700">
                                            <CheckCircle2 size={14} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{ev.name}</p>
                                            <p className="text-xs text-gray-500">Completed on {ev.date}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pending */}
                    <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Pending (1/3)</h4>
                        <div className="space-y-3">
                            {mockEvaluators.filter(e => e.status === 'pending').map((ev, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-orange-200 flex items-center justify-center text-orange-700">
                                            <AlertCircle size={14} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{ev.name}</p>
                                            <p className="text-xs text-gray-500">Waiting for review</p>
                                        </div>
                                    </div>
                                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white border border-orange-200 text-orange-700 rounded-md hover:bg-orange-50 shadow-sm">
                                        <Mail size={12} />
                                        Remind
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Dashboard Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Evolution</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={mockChartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} domain={[0, 5]} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#2563EB"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#2563EB', strokeWidth: 2, stroke: '#EFF6FF' }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* AI Talking Points Placeholder */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-sm border border-indigo-100 p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <div className="w-32 h-32 bg-indigo-500 rounded-full blur-3xl"></div>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                                ✨ AI Talking Points
                            </h3>
                            <span className="px-2 py-1 bg-white/60 rounded text-xs text-indigo-600 font-medium">EOS Framework</span>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-white/50">
                                <h4 className="text-sm font-semibold text-gray-900 mb-2">🌱 Growth Areas</h4>
                                <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                                    <li>Leadership consistency in cross-functional projects</li>
                                    <li>Proactive communication during blockers</li>
                                </ul>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-white/50">
                                <h4 className="text-sm font-semibold text-gray-900 mb-2">⭐ Acknowledgements (TSP)</h4>
                                <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                                    <li>Outstanding delivery on Project X</li>
                                    <li>Exemplifying 'Help First' core value</li>
                                </ul>
                            </div>
                        </div>

                        <button className="w-full mt-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
                            Generate Full Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
