import React, { useState } from 'react';
import { Card } from './Card';
import { ArrowLeft, Check, UserCircle } from 'lucide-react';

export const EvaluationView = ({ onBack, onSubmit, coreValues = ['Humble', 'Hungry', 'Smart'] }) => {
    // Mock data - in real app would come from props/context
    const employee = { name: "Juan Perez", role: "Peer", initials: "JP" };
    const [evalData, setEvalData] = useState({
        values: {},
        gwc: {},
        feedback: ''
    });

    const handleValueChange = (val, score) => {
        setEvalData(prev => ({ ...prev, values: { ...prev.values, [val]: score } }));
    };

    const handleSubmit = () => {
        if (onSubmit) onSubmit(evalData);
    };

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-400 hover:text-gray-600 font-bold text-sm mb-6 transition-colors"
            >
                <ArrowLeft size={16} />
                Back to Dashboard
            </button>

            <header className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {employee.initials}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Evaluating {employee.name}</h2>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase tracking-wide">
                            {employee.role} Review
                        </span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold text-gray-400">Progress</p>
                    <p className="text-2xl font-bold text-brand-blue">0%</p>
                </div>
            </header>

            <div className="space-y-8">
                {/* Core Values Section */}
                <Card>
                    <div className="border-b border-gray-100 pb-4 mb-6 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Core Values</h3>
                            <p className="text-sm text-gray-500">Rate based on company values.</p>
                        </div>
                        <div className="flex gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <span>+ Always</span>
                            <span>± Mostly</span>
                            <span>- Rarely</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {coreValues.map((val) => (
                            <div key={val} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors">
                                <span className="font-bold text-gray-700">{val}</span>
                                <div className="flex gap-3">
                                    {['+', '±', '-'].map((score) => (
                                        <button
                                            key={score}
                                            onClick={() => handleValueChange(val, score)}
                                            className={`w-10 h-10 rounded-lg font-bold text-lg border transition-all ${evalData.values[val] === score
                                                    ? 'bg-brand-blue text-white border-brand-blue shadow-lg shadow-brand-blue/30 scale-110'
                                                    : 'bg-white text-gray-300 border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            {score}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* GWC Section */}
                <Card>
                    <div className="border-b border-gray-100 pb-4 mb-6">
                        <h3 className="text-lg font-bold text-gray-900">GWC (Get it, Want it, Capacity)</h3>
                    </div>
                    <div className="space-y-6">
                        {[
                            { id: 'get', label: 'Does this person "Get" it?' },
                            { id: 'want', label: 'Does this person "Want" it?' },
                            { id: 'capacity', label: 'Does this person have the "Capacity"?' }
                        ].map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors">
                                <span className="font-bold text-gray-700">{item.label}</span>
                                <div className="flex gap-3">
                                    {['Yes', 'No'].map((opt) => (
                                        <button
                                            key={opt}
                                            className="px-6 py-2 rounded-lg font-bold text-sm border bg-white text-gray-400 border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-brand-blue focus:text-brand-blue"
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Feedback Section */}
                <Card>
                    <div className="border-b border-gray-100 pb-4 mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Performance Feedback</h3>
                        <p className="text-sm text-gray-500">
                            Please provide constructive feedback about {employee.name}'s performance.
                            This will be synthesized for their manager.
                        </p>
                    </div>
                    <textarea
                        className="w-full h-32 p-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 resize-none"
                        placeholder="Write your feedback here..."
                        value={evalData.feedback}
                        onChange={(e) => setEvalData({ ...evalData, feedback: e.target.value })}
                    />
                </Card>

                <div className="flex justify-end pt-4">
                    <button
                        onClick={handleSubmit}
                        className="flex items-center gap-2 px-8 py-3 bg-brand-blue text-white rounded-xl font-bold hover:bg-blue-600 transition-all shadow-xl shadow-brand-blue/20 hover:scale-[1.02]"
                    >
                        <Check size={20} />
                        Submit Evaluation
                    </button>
                </div>
            </div>
        </div>
    );
};
