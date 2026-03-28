import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, Edit3, Trash2, GraduationCap, ChevronRight, Inbox, PlusCircle, Building, Save, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import { usePagination } from '../../hooks/usePagination';
import type { Question } from '../../types';
import { SourceType, Difficulty, QuestionType } from '../../types';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface Standard { id: string; name: string; }
interface Subject { id: string; name: string; }
interface Chapter { id: string; name: string; }

const SchoolQuestionsPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [standards, setStandards] = useState<Standard[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [chapters, setChapters] = useState<Chapter[]>([]);

    const [filterStandard, setFilterStandard] = useState('');
    const [filterSubject, setFilterSubject] = useState('');
    const [filterChapter, setFilterChapter] = useState('');

    // States for Bulk Add
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [modalStandard, setModalStandard] = useState('');
    const [modalSubject, setModalSubject] = useState('');
    const [modalChapter, setModalChapter] = useState('');

    interface BulkQuestionState {
        questionText: string;
        questionType: QuestionType;
        difficulty: Difficulty;
        marks: number;
        options: string[];
        answer: string;
        status?: 'pending' | 'saving' | 'saved' | 'error';
    }

    const createEmptyQuestion = (): BulkQuestionState => ({
        questionText: '',
        questionType: QuestionType.SHORT,
        difficulty: Difficulty.MEDIUM,
        marks: 1,
        options: ['', '', '', ''],
        answer: '',
        status: 'pending'
    });

    const [newQuestions, setNewQuestions] = useState<BulkQuestionState[]>([createEmptyQuestion()]);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [publishing, setPublishing] = useState(false);

    const {
        data,
        loading,
        setSearch,
        page,
        setPage,
        limit,
        setLimit,
        pagination,
        refresh,
    } = usePagination<Question>({
        url: `http://localhost:3000/questions?sourceType=SCHOOL${filterStandard ? `&standardId=${filterStandard}` : ''}${filterSubject ? `&subjectId=${filterSubject}` : ''}${filterChapter ? `&chapterId=${filterChapter}` : ''}`,
        initialLimit: 10,
    });

    const [modalData, setModalData] = useState<Partial<Question>>({
        questionText: '',
        questionType: QuestionType.MCQ,
        difficulty: Difficulty.MEDIUM,
        marks: 1,
        sourceType: SourceType.SCHOOL,
    });

    useEffect(() => {
        fetchStandards();
    }, []);

    useEffect(() => {
        if (filterStandard || modalData.standardId || modalStandard) {
            fetchSubjects(filterStandard || modalData.standardId || modalStandard || '');
        }
    }, [filterStandard, modalData.standardId, modalStandard]);

    useEffect(() => {
        if (filterSubject || modalData.subjectId || modalSubject) {
            fetchChapters(filterSubject || modalData.subjectId || modalSubject || '');
        }
    }, [filterSubject, modalData.subjectId, modalSubject]);

    const fetchStandards = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:3000/standards?limit=100', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStandards(res.data.data);
        } catch (err) { console.error(err); }
    };

    const fetchSubjects = async (stdId: string) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:3000/subjects?limit=100&standardId=${stdId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSubjects(res.data.data);
        } catch (err) { console.error(err); }
    };

    const fetchChapters = async (subId: string) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:3000/chapters?limit=100&subjectId=${subId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setChapters(res.data.data);
        } catch (err) { console.error(err); }
    };

    const saveQuestion = async (index: number) => {
        const q = newQuestions[index];
        if (!q.questionText || q.questionText === '<p><br></p>') return;
        if (!modalStandard || !modalSubject || !modalChapter) {
            toast.warning('Please select Standard, Subject and Chapter');
            return;
        }

        const updated = [...newQuestions];
        updated[index].status = 'saving';
        setNewQuestions(updated);

        try {
            const token = localStorage.getItem('token');
            let qOptions = undefined;
            let qAnswer = {};
            if (q.questionType === QuestionType.MCQ) {
                qOptions = { a: q.options[0] || '', b: q.options[1] || '', c: q.options[2] || '', d: q.options[3] || '' };
                qAnswer = { correctOption: ['a','b','c','d'][parseInt(q.answer) || 0] };
            } else {
                qAnswer = { text: q.answer || '' };
            }

            await axios.post('http://localhost:3000/questions', {
                questionText: q.questionText,
                standardId: modalStandard,
                subjectId: modalSubject,
                chapterId: modalChapter,
                questionType: q.questionType,
                difficulty: q.difficulty,
                marks: q.marks,
                options: qOptions,
                answer: qAnswer,
                sourceType: SourceType.SCHOOL
            }, { headers: { Authorization: `Bearer ${token}` } });

            const finish = [...newQuestions];
            finish[index].status = 'saved';
            setNewQuestions(finish);
        } catch (err) {
            const error = [...newQuestions];
            error[index].status = 'error';
            setNewQuestions(error);
            throw err;
        }
    };

    const handleBulkPublish = async () => {
        if (!modalStandard || !modalSubject || !modalChapter) {
            toast.warning('Please select Standard, Subject and Chapter');
            return;
        }
        setPublishing(true);
        let successCount = 0;
        try {
            for (let i = 0; i < newQuestions.length; i++) {
                if (newQuestions[i].status === 'saved') continue;
                if (!newQuestions[i].questionText || newQuestions[i].questionText === '<p><br></p>') continue;
                await saveQuestion(i);
                successCount++;
            }
            if (successCount > 0) {
                toast.success(`${successCount} questions published successfully`);
                refresh();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to publish all questions');
        } finally {
            setPublishing(false);
        }
    };

    const handleSave = async () => {
        if (!modalData.standardId || !modalData.subjectId || !modalData.chapterId || !modalData.questionText) {
            toast.warning('Please fill all required fields');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            if (editingQuestion) {
                await axios.patch(`http://localhost:3000/questions/${editingQuestion.id}`, modalData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Question updated');
            } else {
                await axios.post('http://localhost:3000/questions', {
                    ...modalData,
                    questionType: modalData.questionType, // Redundant but safe
                    marks: modalData.marks,
                    answer: {}, // Ensure it's sent
                    sourceType: SourceType.SCHOOL
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Question added to repository');
            }
            setIsModalOpen(false);
            setEditingQuestion(null);
            refresh();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error occurred');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this question?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/questions/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Deleted');
            refresh();
        } catch (err) { toast.error('Failed to delete'); }
    };

    const columns = [
        {
            header: 'Question Repository',
            accessor: (q: Question) => (
                <div className="flex flex-col gap-3 py-2">
                    <div dangerouslySetInnerHTML={{ __html: q.questionText }} className="text-lg font-bold text-gray-900 leading-relaxed font-gujarati group-hover:text-brand-blue transition-all" />
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-[10px] uppercase">{q.questionType}</Badge>
                        <span className="text-[10px] font-black text-brand-orange uppercase tracking-widest bg-brand-orange/5 px-2 py-1 rounded flex items-center gap-1">
                            <Building className="w-3 h-3" />
                            Institutional Repository
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: 'Mapping',
            accessor: (q: any) => (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="w-3.5 h-3.5 text-brand-blue" />
                        <span className="text-sm font-bold text-gray-700">{q.standard?.name || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        <BookOpen className="w-3.5 h-3.5 text-gray-300" />
                        {q.subject?.name || 'N/A'} • {q.chapter?.name || 'N/A'}
                    </div>
                </div>
            )
        },
        {
            header: 'Complexity',
            accessor: (q: Question) => (
                <div className="flex flex-col gap-2 items-start">
                    <Badge variant={q.difficulty === Difficulty.EASY ? 'success' : q.difficulty === Difficulty.MEDIUM ? 'warning' : 'error'}>
                        {q.difficulty}
                    </Badge>
                    <span className="text-[10px] font-black text-gray-400">{q.marks} Marks Point</span>
                </div>
            )
        },
        {
            header: 'Actions',
            accessor: (q: Question) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            setEditingQuestion(q);
                            setModalData(q);
                            setIsModalOpen(true);
                        }}
                        className="p-2.5 rounded-xl border border-gray-100 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/5 transition-all shadow-sm"
                    >
                        <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(q.id)} className="p-2.5 rounded-xl border border-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ),
            className: "text-right"
        }
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">Institutional Bank</h1>
                    <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
                        Gujarat Board <ChevronRight className="w-3 h-3" /> <span className="text-brand-blue uppercase">School Private Syllabus</span>
                    </p>
                </div>

{/* 
                <div className="flex gap-4">
                    <button
                        onClick={() => {
                            setEditingQuestion(null);
                            setModalData({
                                questionText: '',
                                questionType: QuestionType.MCQ,
                                difficulty: Difficulty.MEDIUM,
                                marks: 1,
                                sourceType: SourceType.SCHOOL,
                            });
                            setIsModalOpen(true);
                        }}
                        className="px-10 py-4 bg-brand-orange text-white rounded-2xl font-black text-sm shadow-xl shadow-brand-orange/30 flex items-center gap-3 active:scale-95 transition-all hover:bg-orange-600"
                    >
                        <Plus className="w-5 h-5 flex-shrink-0 stroke-[3px]" />
                        New Private Item
                    </button>
 
                    <button
                        onClick={() => setIsBulkModalOpen(true)}
                        className="px-8 py-4 bg-brand-blue text-white rounded-2xl font-black text-sm shadow-xl shadow-brand-blue/20 flex items-center gap-3 active:scale-95 transition-all hover:bg-blue-800"
                    >
                        <PlusCircle className="w-5 h-5 flex-shrink-0" />
                        Bulk Submission
                    </button>
                </div>
                */}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/20 items-end">
                <div className="lg:col-span-3 space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Standard</label>
                    <select
                        value={filterStandard}
                        onChange={(e) => { setFilterStandard(e.target.value); setFilterSubject(''); setFilterChapter(''); }}
                        className="w-full px-4 py-3.5 bg-gray-50 border-0 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-brand-blue/5 transition-all"
                    >
                        <option value="">All Standards</option>
                        {standards.map(std => <option key={std.id} value={std.id}>{std.name}</option>)}
                    </select>
                </div>
                <div className="lg:col-span-3 space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Subject Area</label>
                    <select
                        value={filterSubject}
                        onChange={(e) => { setFilterSubject(e.target.value); setFilterChapter(''); }}
                        className="w-full px-4 py-3.5 bg-gray-50 border-0 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-brand-blue/5 transition-all"
                    >
                        <option value="">All Subjects</option>
                        {subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                    </select>
                </div>
                <div className="lg:col-span-3 space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Chapter</label>
                    <select
                        value={filterChapter}
                        onChange={(e) => setFilterChapter(e.target.value)}
                        className="w-full px-4 py-3.5 bg-gray-50 border-0 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-brand-blue/5 transition-all"
                    >
                        <option value="">All Chapters</option>
                        {chapters.map(ch => <option key={ch.id} value={ch.id}>{ch.name}</option>)}
                    </select>
                </div>
                <div className="lg:col-span-3">
                    <button
                        onClick={() => { setFilterStandard(''); setFilterSubject(''); setFilterChapter(''); }}
                        className="w-full py-3.5 bg-gray-100 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                    >
                        Reset Index
                    </button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={data}
                isLoading={loading}
                onSearch={setSearch}
                onRefresh={refresh}
                pagination={pagination ? {
                    currentPage: page,
                    totalPages: pagination.totalPages,
                    onPageChange: setPage,
                    pageSize: limit,
                    onPageSizeChange: setLimit,
                    totalRecords: pagination.totalRecords,
                } : undefined}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingQuestion ? 'Update Question' : 'Manual Item Entry'}
                size="xl"
                footer={
                    <>
                        <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-black text-gray-400 hover:bg-gray-50 transition-all">Cancel</button>
                        <button onClick={handleSave} className="px-12 py-3 bg-brand-orange text-white rounded-2xl font-black text-sm shadow-xl shadow-brand-orange/20 hover:bg-orange-600 transition-all">
                            {editingQuestion ? 'Sync Changes' : 'Publish to Bank'}
                        </button>
                    </>
                }
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Rich Text Question Content</label>
                            <div className="bg-white border-2 border-gray-50 rounded-[2rem] overflow-hidden">
                                <ReactQuill
                                    theme="snow"
                                    value={modalData.questionText}
                                    onChange={(v) => setModalData(prev => ({ ...prev, questionText: v }))}
                                    placeholder="Enter Gujarati/English content here..."
                                    className="h-[300px] font-gujarati"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Assessment Type</label>
                                <select
                                    value={modalData.questionType}
                                    onChange={(e) => setModalData(prev => ({ ...prev, questionType: e.target.value as QuestionType }))}
                                    className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl font-bold text-sm focus:ring-4 focus:ring-brand-blue/5"
                                >
                                    {Object.values(QuestionType).map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cognitive Complexity</label>
                                <select
                                    value={modalData.difficulty}
                                    onChange={(e) => setModalData(prev => ({ ...prev, difficulty: e.target.value as Difficulty }))}
                                    className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl font-bold text-sm focus:ring-4 focus:ring-brand-blue/5"
                                >
                                    {Object.values(Difficulty).map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 bg-gray-100/30 p-8 rounded-[2.5rem] border border-gray-100">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                                <GraduationCap className="w-3 h-3" /> Standard
                            </label>
                            <select value={modalData.standardId} onChange={(e) => setModalData(prev => ({ ...prev, standardId: e.target.value }))} className="w-full px-5 py-3.5 bg-white border border-gray-100 rounded-2xl font-bold text-sm shadow-sm outline-none">
                                <option value="">Select</option>
                                {standards.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                                <BookOpen className="w-3 h-3" /> Subject
                            </label>
                            <select value={modalData.subjectId} onChange={(e) => setModalData(prev => ({ ...prev, subjectId: e.target.value }))} className="w-full px-5 py-3.5 bg-white border border-gray-100 rounded-2xl font-bold text-sm shadow-sm outline-none">
                                <option value="">Select</option>
                                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                                <Inbox className="w-3 h-3" /> Chapter
                            </label>
                            <select value={modalData.chapterId} onChange={(e) => setModalData(prev => ({ ...prev, chapterId: e.target.value }))} className="w-full px-5 py-3.5 bg-white border border-gray-100 rounded-2xl font-bold text-sm shadow-sm outline-none">
                                <option value="">Select</option>
                                {chapters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Assigned Marks</label>
                            <input
                                type="number"
                                value={modalData.marks}
                                onChange={(e) => setModalData(prev => ({ ...prev, marks: parseInt(e.target.value) }))}
                                className="w-full px-5 py-3.5 bg-white border border-gray-100 rounded-2xl font-bold text-sm shadow-sm outline-none"
                            />
                        </div>

                        <div className="pt-6 border-t border-gray-200 flex flex-col items-center gap-2 text-center">
                            <Badge variant="warning">Private Listing</Badge>
                            <p className="text-[9px] font-bold text-gray-400 leading-relaxed uppercase tracking-widest">Only visible to your institution staff</p>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal
                isOpen={isBulkModalOpen}
                onClose={() => setIsBulkModalOpen(false)}
                title="Bulk Institutional Entry"
                size="xl"
                footer={
                    <>
                        <button onClick={() => setIsBulkModalOpen(false)} className="px-8 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-black text-gray-400 hover:bg-gray-50 transition-all">Cancel</button>
                        <button
                            disabled={publishing}
                            onClick={handleBulkPublish}
                            className="px-12 py-3 bg-brand-blue text-white rounded-2xl font-black text-sm shadow-xl shadow-brand-blue/20 hover:bg-blue-800 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            <PlusCircle className={clsx("w-5 h-5", publishing && "animate-spin")} />
                            {publishing ? 'Publishing...' : 'Complete Institutional Submission'}
                        </button>
                    </>
                }
            >
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-3xl">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Standard</label>
                            <select value={modalStandard} onChange={(e) => setModalStandard(e.target.value)} className="w-full bg-white border-0 px-4 py-3 rounded-xl font-bold text-xs focus:ring-4 focus:ring-brand-blue/5 outline-none">
                                <option value="">Select Standard</option>
                                {standards.map(std => <option key={std.id} value={std.id}>{std.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Subject</label>
                            <select value={modalSubject} onChange={(e) => setModalSubject(e.target.value)} className="w-full bg-white border-0 px-4 py-3 rounded-xl font-bold text-xs focus:ring-4 focus:ring-brand-blue/5 outline-none">
                                <option value="">Select Subject</option>
                                {subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Chapter</label>
                            <select value={modalChapter} onChange={(e) => setModalChapter(e.target.value)} className="w-full bg-white border-0 px-4 py-3 rounded-xl font-bold text-xs focus:ring-4 focus:ring-brand-blue/5 outline-none">
                                <option value="">Select Chapter</option>
                                {chapters.map(ch => <option key={ch.id} value={ch.id}>{ch.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Type</label>
                            <select value={newQuestions[activeQuestionIndex]?.questionType || ''} onChange={(e) => {
                                const updated = [...newQuestions];
                                updated[activeQuestionIndex].questionType = e.target.value as QuestionType;
                                setNewQuestions(updated);
                            }} className="w-full bg-gray-50 border-0 px-4 py-3 rounded-xl font-bold text-xs outline-none">
                                {Object.values(QuestionType).map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Level</label>
                            <select value={newQuestions[activeQuestionIndex]?.difficulty || ''} onChange={(e) => {
                                const updated = [...newQuestions];
                                updated[activeQuestionIndex].difficulty = e.target.value as Difficulty;
                                setNewQuestions(updated);
                            }} className="w-full bg-gray-50 border-0 px-4 py-3 rounded-xl font-bold text-xs outline-none">
                                {Object.values(Difficulty).map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Marks</label>
                            <input type="number" value={newQuestions[activeQuestionIndex]?.marks || 1} onChange={(e) => {
                                const updated = [...newQuestions];
                                updated[activeQuestionIndex].marks = parseInt(e.target.value) || 1;
                                setNewQuestions(updated);
                            }} className="w-full bg-gray-50 border-0 px-4 py-3 rounded-xl font-bold text-xs outline-none" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[400px]">
                        <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                            {newQuestions.map((q, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setActiveQuestionIndex(idx)}
                                    className={clsx(
                                        "p-4 rounded-2xl border transition-all cursor-pointer relative",
                                        activeQuestionIndex === idx ? "bg-brand-blue text-white shadow-lg" : "bg-white border-gray-100 text-gray-600 hover:border-brand-blue/30",
                                        q.status === 'saved' && "opacity-60 grayscale-[0.5]"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={clsx("w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0", activeQuestionIndex === idx ? "bg-white/20" : "bg-gray-100")}>{idx + 1}</span>
                                        <div className="flex flex-col overflow-hidden flex-1">
                                            <p className="text-xs font-bold truncate font-gujarati">{q.questionText?.replace(/<[^>]*>/g, '') || "Empty Content"}</p>
                                            <p className="text-[9px] font-bold opacity-70 uppercase tracking-wider">{q.questionType} • {q.marks}M</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {q.status === 'saving' && <Loader2 className="w-4 h-4 animate-spin text-brand-orange" />}
                                            {q.status === 'saved' && <CheckCircle className="w-4 h-4 text-green-500" />}
                                            {q.status === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                                            {q.status !== 'saved' && q.status !== 'saving' && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); saveQuestion(idx); }}
                                                    disabled={!modalStandard || !modalSubject || !modalChapter}
                                                    title="Save single question"
                                                    className={clsx(
                                                        "p-1.5 rounded-lg transition-all",
                                                        activeQuestionIndex === idx ? "hover:bg-white/10" : "hover:bg-gray-100"
                                                    )}
                                                >
                                                    <Save className={clsx("w-4 h-4", activeQuestionIndex === idx ? "text-white" : "text-gray-400 hover:text-brand-blue")} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {newQuestions.length > 1 && q.status !== 'saved' && (
                                        <Trash2
                                            onClick={(e) => { e.stopPropagation(); setNewQuestions(prev => prev.filter((_, i) => i !== idx)); setActiveQuestionIndex(0); }}
                                            className="absolute -right-2 -top-2 w-7 h-7 bg-white p-1.5 rounded-full border border-red-100 text-red-400 hover:bg-red-50 hover:text-red-600 shadow-sm"
                                        />
                                    )}
                                </div>
                            ))}
                            <button
                                onClick={() => { setNewQuestions([...newQuestions, createEmptyQuestion()]); setActiveQuestionIndex(newQuestions.length); }}
                                className="w-full py-4 bg-gray-50 border-2 border-dashed border-gray-100 rounded-2xl text-[10px] font-black text-gray-400 hover:text-brand-blue hover:bg-brand-blue/5 hover:border-brand-blue/20 transition-all uppercase tracking-widest"
                            >
                                Add Row
                            </button>
                        </div>
                        <div className="lg:col-span-8 space-y-4">
                            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden flex flex-col">
                                <ReactQuill
                                    theme="snow"
                                    value={newQuestions[activeQuestionIndex]?.questionText || ''}
                                    onChange={(val) => {
                                        const updated = [...newQuestions];
                                        updated[activeQuestionIndex] = { ...updated[activeQuestionIndex], questionText: val };
                                        setNewQuestions(updated);
                                    }}
                                    className="h-[300px] font-gujarati"
                                />
                            </div>
                            
                            {newQuestions[activeQuestionIndex]?.questionType === QuestionType.MCQ ? (
                                <div className="bg-gray-50 p-6 rounded-3xl space-y-4 border border-gray-100">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Multiple Choice Options</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {['A', 'B', 'C', 'D'].map((opt, i) => (
                                            <div key={i} className="flex gap-3 items-center">
                                                <div className="w-10 h-10 shrink-0 bg-white border border-gray-200 rounded-xl flex items-center justify-center font-black text-gray-400 text-xs">
                                                    {opt}
                                                </div>
                                                <input 
                                                    type="text" 
                                                    placeholder={`Option ${opt}`}
                                                    value={newQuestions[activeQuestionIndex]?.options[i] || ''}
                                                    onChange={(e) => {
                                                        const updated = [...newQuestions];
                                                        updated[activeQuestionIndex].options[i] = e.target.value;
                                                        setNewQuestions(updated);
                                                    }}
                                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold font-gujarati focus:ring-4 focus:ring-brand-blue/10 outline-none"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-2 border-t border-gray-200/60 flex items-center gap-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Correct Answer</label>
                                        <select 
                                            value={newQuestions[activeQuestionIndex]?.answer || '0'}
                                            onChange={(e) => {
                                                const updated = [...newQuestions];
                                                updated[activeQuestionIndex].answer = e.target.value;
                                                setNewQuestions(updated);
                                            }}
                                            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-brand-blue/10"
                                        >
                                            <option value="0">Option A</option>
                                            <option value="1">Option B</option>
                                            <option value="2">Option C</option>
                                            <option value="3">Option D</option>
                                        </select>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-50 p-6 rounded-3xl space-y-2 border border-gray-100">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Correct Answer / Solution</label>
                                    <textarea
                                        placeholder="Enter the correct answer or a brief solution..."
                                        value={newQuestions[activeQuestionIndex]?.answer || ''}
                                        onChange={(e) => {
                                            const updated = [...newQuestions];
                                            updated[activeQuestionIndex].answer = e.target.value;
                                            setNewQuestions(updated);
                                        }}
                                        className="w-full h-24 px-5 py-4 bg-white border border-gray-200 rounded-2xl text-xs font-bold font-gujarati focus:ring-4 focus:ring-brand-blue/10 outline-none resize-none"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default SchoolQuestionsPage;

