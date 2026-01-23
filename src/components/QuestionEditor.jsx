import React, { useState } from 'react';
import { Card } from './Card';
import { Plus, Trash2, GripVertical, Edit2, Check, X } from 'lucide-react';

const DEFAULT_QUESTIONS = [
    {
        id: 1,
        category: 'Apoyo de líder',
        text: '¿Qué te resulta más útil de mi acompañamiento hoy?'
    },
    {
        id: 2,
        category: 'Apoyo de líder',
        text: '¿En qué sentís que podría apoyarte mejor?'
    },
    {
        id: 3,
        category: 'Apoyo de líder',
        text: '¿Hay algo que podría hacer distinto para apoyarte mejor?'
    }
];

export const QuestionEditor = ({ questions = [], onUpdate }) => {
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');
    const [editCategory, setEditCategory] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [newQuestion, setNewQuestion] = useState({ category: '', text: '' });

    const handleEdit = (q) => {
        setEditingId(q.id);
        setEditText(q.text);
        setEditCategory(q.category);
    };

    const handleSave = (id) => {
        const updated = questions.map(q =>
            q.id === id ? { ...q, text: editText, category: editCategory } : q
        );
        if (onUpdate) onUpdate(updated);
        setEditingId(null);
    };

    const handleDelete = (id) => {
        const updated = questions.filter(q => q.id !== id);
        if (onUpdate) onUpdate(updated);
    };

    const handleAdd = () => {
        if (newQuestion.text.trim() && newQuestion.category.trim()) {
            const updated = [...questions, {
                id: Date.now(), // Use unique ID
                ...newQuestion
            }];
            if (onUpdate) onUpdate(updated);
            setNewQuestion({ category: '', text: '' });
            setIsAdding(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Evaluation Questions</h3>
                        <p className="text-sm text-gray-500">Customize open-ended questions for evaluations</p>
                    </div>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-brand-blue/20"
                    >
                        <Plus size={18} />
                        Add Question
                    </button>
                </div>

                <div className="space-y-3">
                    {questions.map((q, idx) => (
                        <div key={q.id} className="flex items-start gap-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                            <div className="pt-1 text-gray-400 cursor-move">
                                <GripVertical size={20} />
                            </div>

                            {editingId === q.id ? (
                                <div className="flex-1 space-y-3">
                                    <input
                                        type="text"
                                        value={editCategory}
                                        onChange={(e) => setEditCategory(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                        placeholder="Category"
                                    />
                                    <textarea
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 resize-none"
                                        rows={2}
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleSave(q.id)}
                                            className="px-3 py-1.5 bg-brand-green text-white rounded-lg text-xs font-bold hover:bg-green-600 transition-colors flex items-center gap-1"
                                        >
                                            <Check size={14} /> Save
                                        </button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-300 transition-colors flex items-center gap-1"
                                        >
                                            <X size={14} /> Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{q.category}</p>
                                    <p className="text-sm text-gray-700 font-medium">{q.text}</p>
                                </div>
                            )}

                            {editingId !== q.id && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(q)}
                                        className="p-2 text-gray-400 hover:text-brand-blue hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(q.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}

                    {isAdding && (
                        <div className="p-4 bg-blue-50/50 rounded-xl border-2 border-dashed border-brand-blue/30">
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={newQuestion.category}
                                    onChange={(e) => setNewQuestion(prev => ({ ...prev, category: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                    placeholder="Category (e.g., Apoyo de líder)"
                                />
                                <textarea
                                    value={newQuestion.text}
                                    onChange={(e) => setNewQuestion(prev => ({ ...prev, text: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 resize-none"
                                    rows={2}
                                    placeholder="Question text..."
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleAdd}
                                        className="px-3 py-1.5 bg-brand-blue text-white rounded-lg text-xs font-bold hover:bg-blue-600 transition-colors flex items-center gap-1"
                                    >
                                        <Plus size={14} /> Add
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsAdding(false);
                                            setNewQuestion({ category: '', text: '' });
                                        }}
                                        className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-300 transition-colors flex items-center gap-1"
                                    >
                                        <X size={14} /> Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-xs text-blue-900 font-medium">
                    💡 <strong>Tip:</strong> These questions will appear in all evaluations. Evaluators will provide written responses that will be summarized in manager reports.
                </p>
            </div>
        </div>
    );
};
