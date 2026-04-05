import React, { useState, useEffect } from 'react';
import { Search, Globe, School, GraduationCap, PlusCircle, ChevronRight } from 'lucide-react';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';
import { SourceType, Difficulty } from '../../types';
import { usePagination } from '../../hooks/usePagination';
import { masterDataService, type Standard, type Subject } from '../../api/masterDataService';
import { useNavigate } from 'react-router-dom';

import BulkQuestionEditor from '../../components/BulkQuestionEditor';
import { toast } from 'react-toastify';

const TeacherQuestionsPage: React.FC = () => {
    const navigate = useNavigate();
    const [standards, setStandards] = useState<Standard[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [selectedStd, setSelectedStd] = useState<string>('');
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [isBulkMode, setIsBulkMode] = useState(false);

    const {
        data: questions,
        loading,
        setSearch,
        page,
        setPage,
        pagination,
        refresh,
        setFilters
    } = usePagination<any>({
        url: `${import.meta.env.VITE_API_URL}/questions`,
        initialLimit: 10,
    });

    useEffect(() => {
        const fetchMasters = async () => {
            try {
                const stds = await masterDataService.getStandards();
                setStandards(stds);
                if (stds.length > 0 && !selectedStd) setSelectedStd(stds[0].id);
            } catch (error) {
                console.error('Error fetching master data:', error);
            }
        };
        fetchMasters();
    }, []);

    useEffect(() => {
        if (selectedStd) {
            const fetchSubs = async () => {
                try {
                    const subs = await masterDataService.getSubjects(selectedStd);
                    setSubjects(subs);
                    if (subs.length > 0) setSelectedSubject(subs[0].id);
                    else setSelectedSubject('');
                } catch (error) {
                    console.error('Error fetching subjects:', error);
                }
            };
            fetchSubs();
        } else {
            setSubjects([]);
            setSelectedSubject('');
        }
    }, [selectedStd]);

    useEffect(() => {
        setFilters({
            standardId: selectedStd,
            subjectId: selectedSubject
        });
    }, [selectedStd, selectedSubject, setFilters]);

    const handleBulkStart = () => {
        if (!selectedStd || !selectedSubject) {
            toast.error('Please select Standard and Subject first');
            return;
        }
        setIsBulkMode(true);
    };

    const handleBulkComplete = () => {
        setIsBulkMode(false);
        refresh();
    };

    const columns = [
        {
            header: 'Library Content',
            accessor: (q: any) => (
                <div className="flex flex-col gap-3 py-2">
                    <p 
                        className="text-lg font-bold text-gray-900 font-gujarati group-hover:text-brand-blue transition-colors max-w-2xl leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: q.questionText }}
                    />
                    <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${q.sourceType === SourceType.GLOBAL ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                            {q.sourceType === SourceType.GLOBAL ? <Globe className="w-3 h-3" /> : <School className="w-3 h-3" />}
                            {q.sourceType} BANK
                        </div>
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Added: {new Date(q.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Category',
            accessor: (q: any) => (
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-brand-blue" />
                        <span className="text-sm font-bold text-gray-700">{q.standard?.name || q.standardId || 'Std'}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-6">{q.subject?.name || q.subjectId || 'Subject'}</span>
                </div>
            )
        },
        {
            header: 'Complexity',
            accessor: (q: any) => (
                <div className="flex flex-col gap-2">
                    <Badge variant={q.difficulty === Difficulty.EASY ? 'success' : q.difficulty === Difficulty.MEDIUM ? 'warning' : 'error'}>
                        {q.difficulty}
                    </Badge>
                    <span className="text-xs font-bold text-gray-400 pl-1">{q.marks} Marks Point</span>
                </div>
            )
        },
        {
            header: '',
            accessor: () => (
                <button 
                    onClick={() => navigate('/teacher/create-paper')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-all shadow-sm active:scale-95 group/btn"
                >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Use in Paper
                </button>
            ),
            className: "text-right"
        }
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight uppercase italic underline decoration-brand-blue/30 decoration-8 underline-offset-8">Question Library</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.15em] text-[10px] flex items-center gap-2">
                        Academic Resources <ChevronRight className="w-3 h-3" /> <span className="text-brand-blue">Gujarat Board Syllabus</span>
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                    <button 
                        onClick={handleBulkStart}
                        className="px-6 py-3 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-3 transition-all hover:bg-black"
                    >
                        <Globe className="w-4 h-4" />
                        AI Bulk Extract
                    </button>
                    <button 
                        onClick={() => navigate('/teacher/create-paper')}
                        className="px-8 py-3 bg-brand-blue text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-brand-blue/30 flex items-center gap-3 active:scale-95 transition-all"
                    >
                        <PlusCircle className="w-4 h-4" />
                        Create Paper
                    </button>
                </div>
            </div>

            {isBulkMode ? (
                <BulkQuestionEditor 
                    onComplete={handleBulkComplete}
                    standardId={selectedStd}
                    subjectId={selectedSubject}
                />
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 items-center">
                        <div className="md:col-span-3 space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Standard Filter</label>
                            <select 
                                value={selectedStd}
                                onChange={(e) => setSelectedStd(e.target.value)}
                                className="w-full px-5 py-3.5 bg-gray-50 border-0 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-brand-blue/5"
                            >
                                <option value="">Select Standard</option>
                                {standards.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-3 space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Subject Area</label>
                            <select 
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                className="w-full px-5 py-3.5 bg-gray-50 border-0 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-brand-blue/5"
                            >
                                <option value="">Select Subject</option>
                                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-6 flex items-end">
                            <div className="relative w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                <input 
                                    type="text" 
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search for keywords or concepts in Gujarati..." 
                                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-0 rounded-2xl focus:ring-4 focus:ring-brand-blue/5 text-sm font-bold transition-all" 
                                />
                            </div>
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={questions}
                        isLoading={loading}
                        onRefresh={refresh}
                        pagination={pagination ? {
                            currentPage: page,
                            totalPages: pagination.totalPages,
                            onPageChange: setPage,
                            totalRecords: pagination.totalRecords,
                        } : undefined}
                    />
                </>
            )}
        </div>
    );
};


export default TeacherQuestionsPage;
