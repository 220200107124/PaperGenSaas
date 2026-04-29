import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, Loader2, Save, Trash2, Plus } from 'lucide-react';

import { questionService } from '../api/questionService';
import { toast } from 'react-toastify';
import { Difficulty, QuestionType } from '../types';

interface BulkQuestionEditorProps {
    onComplete: () => void;
    standardId: string;
    subjectId: string;
}

const BulkQuestionEditor: React.FC<BulkQuestionEditorProps> = ({ onComplete, standardId, subjectId }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isExtracting, setIsExtracting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [extractedQuestions, setExtractedQuestions] = useState<any[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleExtract = async () => {
        if (!file) return;
        setIsExtracting(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('standardId', standardId);
            formData.append('subjectId', subjectId);
            
            const questions = await questionService.extractFromPdf(formData);
            const sanitizedQuestions = questions.map(q => {
                const { type, ...rest } = q;
                return {
                    ...rest,
                    questionType: q.questionType || type || QuestionType.SHORT,
                    difficulty: q.difficulty || Difficulty.MEDIUM,
                    marks: q.marks || 1,
                };
            });
            setExtractedQuestions(sanitizedQuestions);
            toast.success(`Extracted ${sanitizedQuestions.length} questions successfully!`);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to extract questions');
        } finally {
            setIsExtracting(false);
        }
    };

    const handleUpdateQuestion = (index: number, updates: any) => {
        const updated = [...extractedQuestions];
        updated[index] = { ...updated[index], ...updates };
        setExtractedQuestions(updated);
    };

    const handleRemoveQuestion = (index: number) => {
        setExtractedQuestions(prev => prev.filter((_, i) => i !== index));
    };

    const handleAddBlank = () => {
        setExtractedQuestions(prev => [
            ...prev,
            {
                questionText: '',
                questionType: QuestionType.MCQ,
                difficulty: Difficulty.MEDIUM,
                marks: 1,
                options: ['', '', '', ''],
                answer: '',
                standardId,
                subjectId
            }
        ]);
    };

    const handleSaveAll = async () => {
        if (extractedQuestions.length === 0) return;
        setIsSaving(true);
        try {
            // Ensure standardId and subjectId are set for all
            const toSave = extractedQuestions.map(q => ({
                ...q,
                standardId,
                subjectId
            }));
            await questionService.bulkCreate(toSave);
            toast.success('All questions saved to bank!');
            onComplete();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to save questions');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8">
            {extractedQuestions.length === 0 ? (
                <div className="bg-white p-10 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
                        <Upload className="w-10 h-10 text-brand-blue" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">AI Question Extraction</h3>
                        <p className="text-gray-500 max-w-sm">Upload a PDF containing questions in Gujarati. Our AI will automatically extract and categorize them for you.</p>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                        <input 
                            type="file" 
                            accept=".pdf" 
                            onChange={handleFileChange} 
                            id="pdf-upload" 
                            className="hidden" 
                        />
                        <label 
                            htmlFor="pdf-upload" 
                            className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm cursor-pointer hover:bg-black transition-all flex items-center gap-3 shadow-lg"
                        >
                            <FileText className="w-4 h-4" />
                            {file ? file.name : 'Select PDF File'}
                        </label>
                        {file && (
                            <button 
                                onClick={handleExtract}
                                disabled={isExtracting}
                                className="px-10 py-4 bg-brand-blue text-white rounded-xl font-bold text-sm hover:bg-blue-800 transition-all flex items-center gap-3 shadow-xl shadow-brand-blue/20 disabled:opacity-70"
                            >
                                {isExtracting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                Start AI Extraction
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-6 pt-4 text-xs font-bold text-gray-400 border-t border-gray-50 w-full justify-center">
                        <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Gujarati Support</span>
                        <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> MCQ & Subjective</span>
                        <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Auto-Categorization</span>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between sticky top-0 bg-bg-gray/80 backdrop-blur-md py-4 z-10">
                        <div className="flex items-center gap-4">
                            <div className="px-5 py-2 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none">Draft Questions</span>
                                <span className="text-xl font-black text-brand-blue leading-none">{extractedQuestions.length}</span>
                            </div>
                            <button 
                                onClick={handleAddBlank}
                                className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-all"
                                title="Add Manual Question"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setExtractedQuestions([])}
                                className="px-6 py-3 text-gray-500 font-bold hover:text-gray-700 transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveAll}
                                disabled={isSaving}
                                className="px-8 py-3 bg-brand-blue text-white rounded-xl font-bold text-sm shadow-xl shadow-brand-blue/30 flex items-center gap-3 hover:bg-blue-800 transition-all disabled:opacity-70"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Approve & Save to Bank
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {extractedQuestions.map((q, index) => (
                            <div key={index} className="bg-white rounded-3xl border border-gray-100 shadow-md p-8 group transition-all hover:border-brand-blue/30 hover:shadow-xl space-y-6 relative">
                                <button 
                                    onClick={() => handleRemoveQuestion(index)}
                                    className="absolute top-6 right-6 p-2 text-gray-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>

                                <div className="space-y-4">
                                    <textarea 
                                        value={q.questionText}
                                        onChange={(e) => handleUpdateQuestion(index, { questionText: e.target.value })}
                                        className="w-full bg-gray-50 border-0 rounded-2xl p-6 text-lg font-bold font-gujarati focus:ring-4 focus:ring-brand-blue/5 min-h-[120px] transition-all"
                                        placeholder="Enter question text in Gujarati..."
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Type</label>
                                            <select 
                                                value={q.questionType}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    const updates: any = { questionType: val };
                                                    if (val === QuestionType.MCQ && (!q.options || !Array.isArray(q.options))) {
                                                        updates.options = ['', '', '', ''];
                                                    }
                                                    handleUpdateQuestion(index, updates);
                                                }}
                                                className="w-full bg-gray-50 border-0 rounded-xl px-4 py-2 text-xs font-bold"
                                            >
                                                {Object.values(QuestionType).map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Difficulty</label>
                                            <select 
                                                value={q.difficulty}
                                                onChange={(e) => handleUpdateQuestion(index, { difficulty: e.target.value })}
                                                className="w-full bg-gray-50 border-0 rounded-xl px-4 py-2 text-xs font-bold"
                                            >
                                                {Object.values(Difficulty).map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Marks</label>
                                            <input 
                                                type="number"
                                                value={q.marks}
                                                onChange={(e) => handleUpdateQuestion(index, { marks: Number(e.target.value) })}
                                                className="w-full bg-gray-50 border-0 rounded-xl px-4 py-2 text-xs font-bold"
                                            />
                                        </div>
                                    </div>

                                    {q.questionType === QuestionType.MCQ && q.options && (
                                        <div className="pt-6 space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Options & Answer</label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {q.options.map((opt: string, i: number) => (
                                                    <div key={i} className="relative group/opt">
                                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-gray-300">({String.fromCharCode(65 + i)})</div>
                                                        <input 
                                                            value={opt}
                                                            onChange={(e) => {
                                                                const newOpts = [...q.options];
                                                                newOpts[i] = e.target.value;
                                                                handleUpdateQuestion(index, { options: newOpts });
                                                            }}
                                                            className={`w-full bg-gray-50 border-2 pl-10 pr-12 py-3 rounded-xl text-sm font-gujarati transition-all ${q.answer === opt ? 'border-green-500 bg-green-50/30' : 'border-transparent focus:border-brand-blue'}`}
                                                            placeholder={`Option ${String.fromCharCode(65 + i)}`}
                                                        />
                                                        <button 
                                                            onClick={() => handleUpdateQuestion(index, { answer: opt })}
                                                            className={`absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all ${q.answer === opt ? 'bg-green-500 text-white ring-4 ring-green-100' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                                                        >
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BulkQuestionEditor;
