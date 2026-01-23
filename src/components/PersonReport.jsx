import React from 'react';
import { Card } from './Card';
import { ArrowLeft, Download, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const CORE_VALUES = ['Humble', 'Hungry', 'Smart'];

export const PersonReport = ({ person, onBack, evaluations = [], coreValues = ['Humble', 'Hungry', 'Smart'], questions = [] }) => {
    const getScoreColor = (score) => {
        if (score === '+') return 'text-brand-green';
        if (score === '±') return 'text-amber-500';
        return 'text-red-500';
    };

    const calculateOverallRating = () => {
        if (evaluations.length === 0) return { text: 'No Data', color: 'bg-gray-400 text-white' };

        const allGWC = evaluations.every(e => e.gwc?.get === 'Y' && e.gwc?.want === 'Y' && e.gwc?.capacity === 'Y');
        const avgValues = coreValues.map(cv => {
            const scores = evaluations.map(e => e.values?.[cv]);
            const plusCount = scores.filter(s => s === '+').length;
            return plusCount >= scores.length * 0.6 ? '+' : '±';
        });
        const goodValues = avgValues.filter(v => v === '+').length >= Math.ceil(coreValues.length * 0.7);

        if (allGWC && goodValues) return { text: 'The Right Person', color: 'bg-brand-green text-white' };
        if (allGWC && !goodValues) return { text: 'Wrong Seat', color: 'bg-amber-500 text-white' };
        return { text: 'Needs Attention', color: 'bg-red-500 text-white' };
    };

    const generateQuestionSummary = (questionId) => {
        const responses = evaluations.map(e => e.questions?.[questionId]).filter(Boolean);
        if (responses.length === 0) return 'No hay suficientes respuestas para generar un resumen.';
        return `✅ Resumen de ${responses.length} respuestas: ${responses[0].substring(0, 100)}...`;
    };

    const rating = calculateOverallRating();

    return (
        <div className="max-w-6xl mx-auto pb-10">
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
                        {person?.name?.split(' ').map(n => n[0]).join('') || 'JP'}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{person?.name || 'Juan Perez'}</h2>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mt-1 ${rating.color}`}>
                            {rating.text}
                        </span>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                    <Download size={18} />
                    Export PDF
                </button>
            </header>

            <div className="space-y-6">
                {/* Core Values & GWC Summary */}
                <Card>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">EOS Scores Summary</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-gray-100">
                                <tr>
                                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Evaluator</th>
                                    {coreValues.map(cv => (
                                        <th key={cv} className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">{cv}</th>
                                    ))}
                                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">G</th>
                                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">W</th>
                                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">C</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {evaluations.length > 0 ? evaluations.map((evalItem, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50/50">
                                        <td className="py-3 font-semibold text-gray-700">Evaluation {idx + 1}</td>
                                        {coreValues.map(cv => (
                                            <td key={cv} className={`py-3 text-center font-bold text-lg ${getScoreColor(evalItem.values?.[cv])}`}>
                                                {evalItem.values?.[cv] || '-'}
                                            </td>
                                        ))}
                                        <td className={`py-3 text-center font-bold ${evalItem.gwc?.get === 'Y' ? 'text-brand-green' : 'text-red-500'}`}>
                                            {evalItem.gwc?.get || '-'}
                                        </td>
                                        <td className={`py-3 text-center font-bold ${evalItem.gwc?.want === 'Y' ? 'text-brand-green' : 'text-red-500'}`}>
                                            {evalItem.gwc?.want || '-'}
                                        </td>
                                        <td className={`py-3 text-center font-bold ${evalItem.gwc?.capacity === 'Y' ? 'text-brand-green' : 'text-red-500'}`}>
                                            {evalItem.gwc?.capacity || '-'}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={coreValues.length + 4} className="py-8 text-center text-gray-400">No evaluations yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Question Responses with AI Summary */}
                {questions.length > 0 && (
                    <Card>
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Feedback Summary</h3>

                        <div className="space-y-8">
                            {questions.map((q) => (
                                <div key={q.id} className="border-l-4 border-brand-blue pl-6">
                                    <div className="mb-4">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{q.category}</span>
                                        <p className="text-sm font-bold text-gray-900 mt-1">{q.text}</p>
                                    </div>

                                    {/* AI Summary */}
                                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-brand-blue/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <TrendingUp size={16} className="text-brand-blue" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-bold text-brand-blue uppercase tracking-wider mb-1">AI Summary</p>
                                                <p className="text-sm text-gray-700 leading-relaxed">{generateQuestionSummary(q.id)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Individual Responses */}
                                    <div className="space-y-3">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Individual Responses</p>
                                        {evaluations.map((evalItem, idx) => (
                                            evalItem.questions?.[q.id] && (
                                                <div key={idx} className="bg-gray-50 rounded-lg p-4">
                                                    <p className="text-xs font-bold text-gray-500 mb-2">Anonymous Evaluator</p>
                                                    <p className="text-sm text-gray-700 italic">"{evalItem.questions[q.id]}"</p>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Action Items */}
                <Card className="border-l-4 border-l-amber-400">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="text-amber-500 flex-shrink-0" size={24} />
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Recommended Actions</h3>
                            <p className="text-sm text-gray-600 mb-4">Based on the feedback analysis, consider these next steps:</p>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-brand-blue font-bold">•</span>
                                    <span>Review goals and expectations for the next quarter.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-brand-blue font-bold">•</span>
                                    <span>Schedule a feedback session to discuss specific comments.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
