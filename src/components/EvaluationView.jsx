import React, { useState } from 'react';
import { Card } from './Card';
import { ChevronLeft, Check, X, Minus } from 'lucide-react';

const CORE_VALUES = ['Humble', 'Hungry', 'Smart', 'Compassionate', 'Transparent'];

export const EvaluationView = ({ onBack }) => {
    const [evaluations, setEvaluations] = useState([
        { id: 1, name: 'Self (HR Manager)', type: 'Self', values: {}, gwc: {} },
        { id: 2, name: 'CEO (Manager)', type: 'Manager', values: {}, gwc: {} },
        { id: 3, name: 'Juan Perez (Peer)', type: 'Peer', values: {}, gwc: {} },
        { id: 4, name: 'Carlos Ruiz (Report)', type: 'Report', values: {}, gwc: {} },
    ]);

    const [selectedPerson, setSelectedPerson] = useState(null);

    const updateValue = (personId, valueIndex, rating) => {
        setEvaluations(prev => prev.map(p => {
            if (p.id === personId) {
                const newValues = { ...p.values, [valueIndex]: rating };
                return { ...p, values: newValues };
            }
            return p;
        }));
    };

    const updateGWC = (personId, key, rating) => {
        setEvaluations(prev => prev.map(p => {
            if (p.id === personId) {
                const newGWC = { ...p.gwc, [key]: rating };
                return { ...p, gwc: newGWC };
            }
            return p;
        }));
    };

    const getRatingSummary = (p) => {
        const valuesCount = Object.values(p.values).length === CORE_VALUES.length;
        const gwcCount = Object.values(p.gwc).length === 3;
        if (valuesCount && gwcCount) return 'Completed';
        return i === 0 && !valuesCount ? 'Pending' : 'In Progress';
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-colors">
                    <ChevronLeft size={20} />
                </button>
                <h3 className="text-xl font-bold text-gray-900">Quarterly Evaluation - Q1 2026</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Selection List */}
                <div className="lg:col-span-1 space-y-3">
                    <p className="text-sm font-semibold text-gray-500 px-1 uppercase tracking-wider mb-2">People to Evaluate</p>
                    {evaluations.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => setSelectedPerson(p)}
                            className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${selectedPerson?.id === p.id
                                    ? 'bg-white border-brand-blue shadow-lg shadow-brand-blue/5 ring-4 ring-brand-blue/5'
                                    : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-md'
                                }`}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${selectedPerson?.id === p.id ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                        {p.name[0]}
                                    </div>
                                    <div>
                                        <p className={`font-bold text-sm ${selectedPerson?.id === p.id ? 'text-gray-900' : 'text-gray-700'}`}>{p.name}</p>
                                        <p className="text-xs text-gray-500">{p.type}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    {Object.values(p.values).length === CORE_VALUES.length && Object.values(p.gwc).length === 3 ? (
                                        <div className="w-5 h-5 bg-brand-green/20 text-brand-green rounded-full flex items-center justify-center">
                                            <Check size={12} strokeWidth={3} />
                                        </div>
                                    ) : (
                                        <div className="text-[10px] font-bold text-gray-400 uppercase">Pending</div>
                                    )}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Evaluation Card */}
                <div className="lg:col-span-2">
                    {selectedPerson ? (
                        <Card className="p-8 border-t-4 border-t-brand-blue animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="mb-8">
                                <h4 className="text-xl font-bold text-gray-900">Evaluating {selectedPerson.name}</h4>
                                <p className="text-sm text-gray-500 mt-1">Please be honest and constructive according to EOS guidelines.</p>
                            </div>

                            {/* Core Values Section */}
                            <div className="mb-10">
                                <div className="flex items-center justify-between mb-4">
                                    <h5 className="font-bold text-gray-900">Core Values</h5>
                                    <div className="flex gap-4 text-[10px] font-bold text-gray-400">
                                        <span>+ Always</span>
                                        <span>± Mostly</span>
                                        <span>- Rarely</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {CORE_VALUES.map((cv, idx) => (
                                        <div key={cv} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                                            <span className="font-medium text-gray-700">{cv}</span>
                                            <div className="flex gap-2">
                                                {['+', '±', '-'].map(rating => (
                                                    <button
                                                        key={rating}
                                                        onClick={() => updateValue(selectedPerson.id, idx, rating)}
                                                        className={`w-10 h-10 rounded-lg font-bold transition-all ${selectedPerson.values[idx] === rating
                                                                ? rating === '+' ? 'bg-brand-green text-white scale-110 shadow-lg shadow-brand-green/20' :
                                                                    rating === '±' ? 'bg-amber-400 text-white scale-110 shadow-lg shadow-amber-400/20' :
                                                                        'bg-red-500 text-white scale-110 shadow-lg shadow-red-500/20'
                                                                : 'bg-white text-gray-400 border border-gray-200 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        {rating}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* GWC Section */}
                            <div>
                                <h5 className="font-bold text-gray-900 mb-4">GWC (Get it, Want it, Capacity)</h5>
                                <div className="space-y-4">
                                    {[
                                        { key: 'get', label: 'Does this person "Get" it?' },
                                        { key: 'want', label: 'Does this person "Want" it?' },
                                        { key: 'capacity', label: 'Does this person have the "Capacity"?' },
                                    ].map(item => (
                                        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                                            <span className="font-medium text-gray-700">{item.label}</span>
                                            <div className="flex gap-2">
                                                {['Y', 'N'].map(rating => (
                                                    <button
                                                        key={rating}
                                                        onClick={() => updateGWC(selectedPerson.id, item.key, rating)}
                                                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${selectedPerson.gwc[item.key] === rating
                                                                ? rating === 'Y' ? 'bg-brand-green text-white scale-105 shadow-md shadow-brand-green/10' :
                                                                    'bg-red-500 text-white scale-105 shadow-md shadow-red-500/10'
                                                                : 'bg-white text-gray-400 border border-gray-200 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        {rating === 'Y' ? 'Yes' : 'No'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    ) : (
                        <Card className="h-full flex flex-col items-center justify-center p-20 text-center text-gray-400 border-dashed border-2 border-gray-200 bg-transparent card-shadow-none">
                            <div className="w-16 h-16 rounded-full border-2 border-gray-200 flex items-center justify-center mb-4">
                                <ChevronRight size={32} />
                            </div>
                            <p className="font-medium">Select a person from the list to start evaluation</p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

const ChevronRight = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m9 18 6-6-6-6" />
    </svg>
);
