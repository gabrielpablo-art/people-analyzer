import React, { useState, useMemo } from 'react';
import { Card } from './Card';
import { Target, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { EmployeeDetailModal } from './EmployeeDetailModal';
import { hasPermission, PERMISSIONS, isEmployee } from '../utils/permissions';

export const DashboardView = ({ employees, coreValues, currentUser, onViewReport, onEvaluate }) => {
    const [filterRating, setFilterRating] = useState('ALL'); // ALL, RIGHT_PERSON, WRONG_SEAT, WRONG_PERSON
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // Calculate Stats
    const stats = useMemo(() => {
        const visibleEmployees = isEmployee(currentUser)
            ? employees.filter(e => e.email === currentUser.email)
            : employees;

        const total = visibleEmployees.length;
        const rightPerson = visibleEmployees.filter(e => e.rating === 'Right Employee').length;
        const wrongSeat = visibleEmployees.filter(e => e.rating === 'Wrong Seat').length;
        const wrongPerson = visibleEmployees.filter(e => e.rating === 'Wrong Person').length;

        return { total, rightPerson, wrongSeat, wrongPerson };
    }, [employees, currentUser]);

    // Filter Employees
    const filteredEmployees = useMemo(() => {
        let baseList = employees;
        if (isEmployee(currentUser)) {
            baseList = employees.filter(e => e.email === currentUser.email);
        }

        if (filterRating === 'ALL') return baseList;
        if (filterRating === 'RIGHT_PERSON') return baseList.filter(e => e.rating === 'Right Employee');
        if (filterRating === 'WRONG_SEAT') return baseList.filter(e => e.rating === 'Wrong Seat');
        if (filterRating === 'WRONG_PERSON') return baseList.filter(e => e.rating === 'Wrong Person');
        return baseList;
    }, [employees, filterRating, currentUser]);

    const getRatingColor = (rating) => {
        if (rating === 'Right Employee') return 'text-brand-green bg-green-50';
        if (rating === 'Wrong Seat') return 'text-amber-600 bg-amber-50';
        return 'text-red-600 bg-red-50';
    };

    const getValColor = (val) => {
        if (val === '+') return 'text-brand-green';
        if (val === '±') return 'text-amber-500';
        return 'text-red-500';
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card
                    className={`flex flex-col gap-2 cursor-pointer transition-all ${filterRating === 'ALL' ? 'ring-2 ring-brand-blue shadow-lg scale-[1.02]' : 'hover:bg-gray-50'}`}
                    onClick={() => setFilterRating('ALL')}
                >
                    <div className="flex justify-between items-start">
                        <span className="text-gray-500 text-sm font-medium">Total Talent</span>
                        <Users className="text-brand-blue" size={20} />
                    </div>
                    <span className="text-3xl font-bold text-gray-900">{stats.total}</span>
                    <span className="text-gray-400 text-xs mt-2">Team Size</span>
                </Card>

                <Card
                    className={`flex flex-col gap-2 border-l-4 border-l-brand-green cursor-pointer transition-all ${filterRating === 'RIGHT_PERSON' ? 'ring-2 ring-brand-green shadow-lg scale-[1.02]' : 'hover:bg-gray-50'}`}
                    onClick={() => setFilterRating('RIGHT_PERSON')}
                >
                    <div className="flex justify-between items-start">
                        <span className="text-gray-500 text-sm font-medium">Right Person / Seat</span>
                        <Target className="text-brand-green" size={20} />
                    </div>
                    <span className="text-3 shadow-sm text-3xl font-bold text-gray-900">{stats.rightPerson}</span>
                    <span className="text-brand-green text-xs font-semibold mt-2">
                        {Math.round((stats.rightPerson / stats.total) * 100) || 0}% Alignment
                    </span>
                </Card>

                <Card
                    className={`flex flex-col gap-2 border-l-4 border-l-amber-400 cursor-pointer transition-all ${filterRating === 'WRONG_SEAT' ? 'ring-2 ring-amber-400 shadow-lg scale-[1.02]' : 'hover:bg-gray-50'}`}
                    onClick={() => setFilterRating('WRONG_SEAT')}
                >
                    <div className="flex justify-between items-start">
                        <span className="text-gray-500 text-sm font-medium">Wrong Seat</span>
                        <TrendingUp className="text-amber-500" size={20} />
                    </div>
                    <span className="text-3xl font-bold text-gray-900">{stats.wrongSeat}</span>
                    <span className="text-amber-500 text-xs font-semibold mt-2">Immediate Coaching</span>
                </Card>

                <Card
                    className={`flex flex-col gap-2 border-l-4 border-l-red-400 cursor-pointer transition-all ${filterRating === 'WRONG_PERSON' ? 'ring-2 ring-red-400 shadow-lg scale-[1.02]' : 'hover:bg-gray-50'}`}
                    onClick={() => setFilterRating('WRONG_PERSON')}
                >
                    <div className="flex justify-between items-start">
                        <span className="text-gray-500 text-sm font-medium">Wrong Person</span>
                        <AlertCircle className="text-red-500" size={20} />
                    </div>
                    <span className="text-3xl font-bold text-gray-900">{stats.wrongPerson}</span>
                    <span className="text-red-500 text-xs font-semibold mt-2">Replacement Plan</span>
                </Card>
            </div>

            <Card className="p-0 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">People Analyzer™ Result</h3>
                        <p className="text-sm text-gray-500">
                            {filterRating === 'ALL' ? 'Viewing all employees' :
                                filterRating === 'RIGHT_PERSON' ? 'Viewing Right Person / Right Seat' :
                                    filterRating === 'WRONG_SEAT' ? 'Viewing employees in Wrong Seat' :
                                        'Viewing potential Wrong Person issues'}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                            <span className="w-3 h-3 rounded-full bg-brand-green" /> Values Target: 3+, 2±
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white border-b border-gray-100">
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</th>
                                {coreValues.map((cv, i) => (
                                    <th key={i} className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">{cv}</th>
                                ))}
                                <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">G</th>
                                <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">W</th>
                                <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">C</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Rating Final</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredEmployees.length > 0 ? (
                                filteredEmployees.map((p, i) => (
                                    <tr
                                        key={i}
                                        onClick={() => setSelectedEmployee(p)}
                                        className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-sm text-gray-900 group-hover:text-brand-blue transition-colors">
                                                {p.name}
                                            </span>
                                        </td>
                                        {p.values.slice(0, coreValues.length).map((v, idx) => (
                                            <td key={idx} className={`px-4 py-4 text-center font-bold text-lg ${getValColor(v)}`}>{v}</td>
                                        ))}
                                        {Array.from({ length: Math.max(0, coreValues.length - p.values.length) }).map((_, idx) => (
                                            <td key={`empty-${idx}`} className="px-4 py-4 text-center text-gray-300">-</td>
                                        ))}

                                        {p.gwc.map((g, idx) => (
                                            <td key={idx} className={`px-4 py-4 text-center font-bold text-sm ${g === 'Y' ? 'text-brand-green' : 'text-red-500'}`}>{g}</td>
                                        ))}
                                        <td className="px-6 py-4 text-right">
                                            <span className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider ${getRatingColor(p.rating)}`}>
                                                {p.rating}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {onEvaluate && !isEmployee(currentUser) && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onEvaluate(p);
                                                        }}
                                                        className="px-3 py-1.5 bg-brand-green/10 text-brand-green rounded-lg text-xs font-bold hover:bg-brand-green hover:text-white transition-all"
                                                    >
                                                        Evaluate
                                                    </button>
                                                )}
                                                {onViewReport && !isEmployee(currentUser) && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onViewReport(p);
                                                        }}
                                                        className="px-3 py-1.5 bg-brand-blue/10 text-brand-blue rounded-lg text-xs font-bold hover:bg-brand-blue hover:text-white transition-all"
                                                    >
                                                        View Report
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={coreValues.length + 6} className="px-6 py-8 text-center text-gray-500 text-sm">
                                        No employees found matching this filter.
                                    </td>
                                </tr>
                            )}
                            {/* THE BAR ROW */}
                            <tr className="bg-brand-blue/5 border-t-2 border-brand-blue/10">
                                <td className="px-6 py-4 font-bold text-xs text-brand-blue uppercase tracking-widest italic">The Bar (Min)</td>
                                {coreValues.map((_, i) => (
                                    <td key={i} className="px-4 py-4 text-center font-bold text-brand-blue/50 text-lg">+</td>
                                ))}
                                <td className="px-4 py-4 text-center font-bold text-brand-blue/50 text-sm">Y</td>
                                <td className="px-4 py-4 text-center font-bold text-brand-blue/50 text-sm">Y</td>
                                <td className="px-4 py-4 text-center font-bold text-brand-blue/50 text-sm">Y</td>
                                <td className="px-6 py-4"></td>
                                <td className="px-6 py-4"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Employee Detail Modal */}
            {selectedEmployee && (
                <EmployeeDetailModal
                    employee={selectedEmployee}
                    onClose={() => setSelectedEmployee(null)}
                />
            )}
        </div>
    );
};
