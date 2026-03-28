import React, { useState, useEffect } from 'react';
import {
    Check,
    ChevronRight,
    ChevronLeft,
    Search,
    Plus,
    Trash2,
    Save,
    Printer,
    BookOpen,
    Clock,
    PlusCircle,
    FileText
} from 'lucide-react';
import Badge from '../../components/Badge';
import { clsx } from 'clsx';
import { Difficulty } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { masterDataService, type Standard, type Subject } from '../../api/masterDataService';
import { questionService } from '../../api/questionService';
import { paperService } from '../../api/paperService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CreatePaper: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [standards, setStandards] = useState<Standard[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [questions, setQuestions] = useState<any[]>([]);
    const [sourceType, setSourceType] = useState<'GLOBAL' | 'SCHOOL'>('GLOBAL');

    const [selectedStd, setSelectedStd] = useState<string>('');
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [title, setTitle] = useState('');
    const [selectedQuestions, setSelectedQuestions] = useState<any[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuthStore();
 
    // Paper Customization States
    const [teacherName, setTeacherName] = useState(user?.name || '');
    const [schoolName, setSchoolName] = useState(user?.schoolName || '');
    const [duration, setDuration] = useState('02:00 Hours');
    const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);
    const [watermark, setWatermark] = useState('OFFICIAL PAPER');
    const [footerText, setFooterText] = useState('Managed by Institution Examination Committee');
    const [logo, setLogo] = useState<string | null>(null);
 
    // Sync with user state if it changes or is initially null
    useEffect(() => {
        if (user) {
            setTeacherName(prev => prev || user.name || '');
            setSchoolName(prev => prev || user.schoolName || '');
        }
    }, [user]);


    const steps = [
        { id: 1, name: 'Standard' },
        { id: 2, name: 'Subject' },
        { id: 3, name: 'Questions' },
        { id: 4, name: 'Layout' },
        { id: 5, name: 'Preview' }
    ];

    useEffect(() => {
        fetchStandards();
    }, []);

    useEffect(() => {
        if (selectedStd) {
            fetchSubjects(selectedStd);
            setStep(2);
        }
    }, [selectedStd]);

    useEffect(() => {
        if (selectedSubject) {
            fetchQuestions();
            setStep(3);
        }
    }, [selectedSubject, sourceType]); // Re-fetch on source type change

    const fetchStandards = async () => {
        try {
            const data = await masterDataService.getStandards();
            setStandards(data);
        } catch (error) {
            toast.error('Failed to fetch standards');
        }
    };

    const fetchSubjects = async (stdId: string) => {
        try {
            const data = await masterDataService.getSubjects(stdId);
            setSubjects(data);
        } catch (error) {
            toast.error('Failed to fetch subjects');
        }
    };


    const fetchQuestions = async () => {
        setIsLoading(true);
        try {
            const response = await questionService.getQuestions({
                standardId: selectedStd,
                subjectId: selectedSubject,
                sourceType: sourceType, // Use selected source type
                limit: 100
            });
            setQuestions(response.data);
        } catch (error) {
            toast.error('Failed to fetch questions');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleQuestion = (q: any) => {
        const index = selectedQuestions.findIndex(sq => sq.questionId === q.id);
        if (index > -1) {
            setSelectedQuestions(selectedQuestions.filter(sq => sq.questionId !== q.id));
        } else {
            setSelectedQuestions([...selectedQuestions, {
                questionId: q.id,
                questionText: q.questionText,
                marks: q.marks,
                type: q.questionType,
                options: q.options,
                section: 'A',
                order: selectedQuestions.length + 1
            }]);
        }
    };

    const handleSave = async (status: 'DRAFT' | 'PUBLISHED' = 'DRAFT') => {
        if (!title) {
            toast.warning('Please enter a title for the paper');
            setStep(4); // Or wherever the title is input
            return;
        }

        setIsSaving(true);
        try {
            const paperData = {
                title,
                standardId: selectedStd,
                subjectId: selectedSubject,
                status,
                paperQuestions: selectedQuestions.map((sq, idx) => ({
                    questionId: sq.questionId,
                    section: sq.section,
                    customMarks: sq.marks,
                    order: idx + 1
                })),
                teacherName,
                schoolName,
                duration,
                examDate,
                watermark,
                footerText,
                logo
            };

            await paperService.createPaper(paperData);
            toast.success(`Exam Paper ${status === 'DRAFT' ? 'Saved' : 'Published'} Successfully!`);
            navigate('/teacher/papers');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to save paper');
        } finally {
            setIsSaving(false);
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 animate-in slide-in-from-right-8 duration-700">
                        {standards.map(std => (
                            <button
                                key={std.id}
                                onClick={() => setSelectedStd(std.id)}
                                className={clsx(
                                    "p-12 rounded-[2.5rem] border-4 transition-all flex flex-col items-center gap-6 relative group overflow-hidden",
                                    selectedStd === std.id
                                        ? "border-brand-blue bg-brand-blue shadow-2xl shadow-brand-blue/30 scale-105"
                                        : "border-gray-50 bg-white hover:border-brand-blue/20 text-gray-400 hover:text-gray-900 shadow-sm"
                                )}
                            >
                                <div className={clsx(
                                    "w-20 h-20 rounded-3xl flex items-center justify-center font-black text-3xl transition-all duration-500",
                                    selectedStd === std.id ? "bg-white text-brand-blue rotate-6" : "bg-gray-50 text-gray-300 group-hover:bg-brand-blue/5 group-hover:text-brand-blue"
                                )}>
                                    {std.name.match(/\d+/)?.[0] || '?'}
                                </div>
                                <span className={clsx("font-black text-xl tracking-tight uppercase", selectedStd === std.id ? "text-white" : "text-gray-900")}>{std.name}</span>
                                {selectedStd === std.id && <Check className="absolute top-6 right-6 text-white w-6 h-6 stroke-[4px]" />}
                            </button>
                        ))}
                    </div>
                );
            case 2:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-right-8 duration-700">
                        {subjects.map(sub => (
                            <button
                                key={sub.id}
                                onClick={() => setSelectedSubject(sub.id)}
                                className={clsx(
                                    "p-10 rounded-[2rem] border-4 transition-all flex items-center gap-8 relative overflow-hidden group",
                                    selectedSubject === sub.id
                                        ? "border-brand-blue bg-brand-blue shadow-2xl shadow-brand-blue/30 scale-[1.03]"
                                        : "border-gray-50 bg-white hover:border-brand-blue/20 text-gray-400 hover:text-gray-900 shadow-sm"
                                )}
                            >
                                <div className={clsx(
                                    "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500",
                                    selectedSubject === sub.id ? "bg-white text-brand-blue rotate-12" : "bg-gray-50 text-gray-300 group-hover:bg-brand-blue/5 group-hover:text-brand-blue"
                                )}>
                                    <BookOpen className="w-8 h-8" />
                                </div>
                                <span className={clsx("font-black text-2xl tracking-tight", selectedSubject === sub.id ? "text-white" : "text-gray-900")}>{sub.name}</span>
                            </button>
                        ))}
                    </div>
                );
            case 3:
                return (
                    <div className="flex flex-col lg:flex-row gap-10 animate-in slide-in-from-right-8 duration-700">
                        <div className="flex-1 space-y-8">
                            <div className="flex items-center gap-4 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                                <div className="flex bg-gray-50 p-1.5 rounded-2xl">
                                    <button 
                                        onClick={() => setSourceType('GLOBAL')}
                                        className={clsx(
                                            "px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                            sourceType === 'GLOBAL' ? "bg-white text-brand-blue shadow-lg" : "text-gray-400 hover:text-gray-600"
                                        )}
                                    >
                                        Global Bank
                                    </button>
                                    <button 
                                        onClick={() => setSourceType('SCHOOL')}
                                        className={clsx(
                                            "px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                            sourceType === 'SCHOOL' ? "bg-white text-brand-blue shadow-lg" : "text-gray-400 hover:text-gray-600"
                                        )}
                                    >
                                        School Bank
                                    </button>
                                </div>
                                <div className="relative flex-1">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                    <input type="text" placeholder="Search Gujarati Question Bank..." className="w-full pl-16 pr-6 py-5 bg-gray-50 border-0 rounded-2xl focus:ring-4 focus:ring-brand-blue/5 text-sm font-bold font-gujarati" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                {questions.map(q => (
                                    <div key={q.id} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-start justify-between gap-8 hover:border-brand-blue/10 transition-all group relative overflow-hidden">
                                        <div className="relative z-10 space-y-4 flex-1">
                                            <div className="flex items-center gap-4">
                                                <Badge variant="info" className="uppercase tracking-[0.2em]">{q.chapter?.name || 'Academic'}</Badge>
                                                <Badge variant={q.difficulty === Difficulty.EASY ? 'success' : q.difficulty === Difficulty.MEDIUM ? 'warning' : 'error'} className="uppercase tracking-[0.2em]">{q.difficulty}</Badge>
                                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] pl-2">{q.marks} Marks</span>
                                            </div>
                                            <p 
                                                className="text-2xl font-bold text-gray-900 leading-relaxed font-gujarati group-hover:text-brand-blue transition-colors q-content"
                                                dangerouslySetInnerHTML={{ __html: q.questionText }}
                                            />
                                        </div>
                                        <button
                                            onClick={() => toggleQuestion(q)}
                                            className={clsx(
                                                "shrink-0 w-16 h-16 rounded-[1.25rem] flex items-center justify-center transition-all duration-300 relative z-10",
                                                selectedQuestions.find(sq => sq.questionId === q.id)
                                                    ? "bg-green-500 text-white shadow-xl shadow-green-500/30 scale-110"
                                                    : "bg-gray-50 text-gray-300 hover:bg-brand-blue hover:text-white"
                                            )}
                                        >
                                            {selectedQuestions.find(sq => sq.questionId === q.id) ? <Check className="w-8 h-8 stroke-[3px]" /> : <Plus className="w-8 h-8" />}
                                        </button>
                                    </div>
                                ))}
                                {questions.length === 0 && !isLoading && <div className="text-center py-20 font-bold text-gray-400">No questions found for this selection.</div>}
                                {isLoading && <div className="text-center py-20 font-bold text-brand-blue">Loading questions...</div>}
                            </div>
                        </div>


                        <div className="w-full lg:w-96 space-y-6">
                            <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-20"><PlusCircle className="w-12 h-12" /></div>
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/50 mb-8 mt-2">Selection Summary</h3>
                                <div className="space-y-10">
                                    <div className="flex justify-between items-end border-b border-white/10 pb-6">
                                        <span className="text-6xl font-black">{selectedQuestions.length}</span>
                                        <span className="text-xs font-black uppercase tracking-widest text-white/40 mb-2">Questions</span>
                                    </div>
                                    <div className="flex justify-between items-end border-b border-white/10 pb-6">
                                        <span className="text-6xl font-black">{selectedQuestions.reduce((acc, q) => acc + q.marks, 0)}</span>
                                        <span className="text-xs font-black uppercase tracking-widest text-white/40 mb-2">Total Marks</span>
                                    </div>
                                    <div className="flex flex-col gap-4 pt-4">
                                        <div className="flex justify-between text-xs font-bold text-white/60">
                                            <span>Target Marks:</span>
                                            <span className="text-white">50</span>
                                        </div>
                                        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-brand-orange shadow-[0_0_20px_rgba(249,115,22,0.5)] transition-all duration-1000"
                                                style={{ width: `${Math.min((selectedQuestions.reduce((acc, q) => acc + q.marks, 0) / 50) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="max-w-5xl mx-auto space-y-10 animate-in slide-in-from-right-8 duration-700">
                        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-8">
                            <h3 className="text-xl font-black text-gray-900 px-2 flex items-center gap-3">
                                <FileText className="w-6 h-6 text-brand-blue" />
                                Paper Title & Branding
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Exam Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g. Summative Assessment - 2024"
                                        className="w-full px-8 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-blue/5 outline-none font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">School Name</label>
                                    <input
                                        type="text"
                                        value={schoolName}
                                        onChange={(e) => setSchoolName(e.target.value)}
                                        readOnly={!!user?.schoolName}
                                        placeholder="Enter Full School Name"
                                        className={clsx(
                                            "w-full px-8 py-4 border-2 rounded-2xl outline-none font-bold transition-all",
                                            user?.schoolName 
                                                ? "bg-gray-100 border-gray-100 opacity-60 cursor-not-allowed" 
                                                : "bg-gray-50 border-gray-100 focus:ring-4 focus:ring-brand-blue/5"
                                        )}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Teacher Name</label>
                                    <input
                                        type="text"
                                        value={teacherName}
                                        onChange={(e) => setTeacherName(e.target.value)}
                                        readOnly
                                        className="w-full px-8 py-4 bg-gray-100 border-2 border-gray-100 rounded-2xl outline-none font-bold opacity-60 cursor-not-allowed"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Duration</label>
                                    <input
                                        type="text"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        className="w-full px-8 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-blue/5 outline-none font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Exam Date</label>
                                    <input
                                        type="date"
                                        value={examDate}
                                        onChange={(e) => setExamDate(e.target.value)}
                                        className="w-full px-8 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-blue/5 outline-none font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Watermark Content</label>
                                    <input
                                        type="text"
                                        value={watermark}
                                        onChange={(e) => setWatermark(e.target.value)}
                                        className="w-full px-8 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-blue/5 outline-none font-bold"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Footer Credits</label>
                                <input
                                    type="text"
                                    value={footerText}
                                    onChange={(e) => setFooterText(e.target.value)}
                                    className="w-full px-8 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-blue/5 outline-none font-bold"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">School Logo URL (Optional)</label>
                                <input
                                    type="text"
                                    value={logo || ''}
                                    onChange={(e) => setLogo(e.target.value)}
                                    placeholder="Paste image link here"
                                    className="w-full px-8 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-blue/5 outline-none font-bold"
                                />
                            </div>
                        </div>

                        <div className="bg-brand-blue rounded-[2.5rem] p-12 text-white shadow-2xl shadow-brand-blue/30 flex items-center justify-between overflow-hidden relative group">
                            <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-all duration-1000"></div>
                            <div className="relative z-10 space-y-2">
                                <h3 className="text-3xl font-black tracking-tight">Exam Blueprint</h3>
                                <p className="text-brand-blue/60 font-black uppercase tracking-[0.2em] text-xs">Section Arrangement Phase</p>
                            </div>
                        </div>

                        <div className="space-y-12">
                            {['Section A', 'Section B', 'Section C'].map((section) => (
                                <div key={section} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden group/sec">
                                    <div className="bg-gray-50/50 p-8 border-b border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-brand-blue text-white flex items-center justify-center font-black">{section.split(' ')[1]}</div>
                                            <h4 className="font-black text-gray-900 uppercase tracking-[0.2em] text-sm">{section}</h4>
                                        </div>
                                    </div>
                                    <div className="p-8 space-y-6">
                                        {selectedQuestions.filter(q => q.section === section.split(' ')[1]).map((q, i) => (
                                            <div key={q.questionId} className="flex items-center gap-8 p-6 rounded-3xl border border-gray-50 bg-gray-50/20 hover:border-brand-blue/20 hover:bg-white transition-all group relative">
                                                <div className="flex-1 flex items-center justify-between">
                                                    <div className="space-y-2">
                                                        <div 
                                                            className="font-black text-gray-900 text-lg font-gujarati leading-snug line-clamp-1 q-content"
                                                            dangerouslySetInnerHTML={{ __html: q.questionText }}
                                                        />
                                                        <div className="flex items-center gap-3">
                                                            <Badge variant="outline" className="scale-75 origin-left">{q.marks} Marks</Badge>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-8">
                                                        <select
                                                            value={q.section}
                                                            onChange={(e) => {
                                                                const newQs = [...selectedQuestions];
                                                                const target = newQs.find(tsq => tsq.questionId === q.questionId);
                                                                if (target) target.section = e.target.value;
                                                                setSelectedQuestions(newQs);
                                                            }}
                                                            className="bg-white border-2 border-gray-100 rounded-xl px-6 py-3 text-xs font-black uppercase tracking-widest outline-none"
                                                        >
                                                            <option value="A">To Sec A</option>
                                                            <option value="B">To Sec B</option>
                                                            <option value="C">To Sec C</option>
                                                        </select>
                                                        <button
                                                            onClick={() => toggleQuestion({ id: q.questionId })}
                                                            className="text-gray-200 hover:text-red-500 transition-colors p-3 rounded-xl hover:bg-red-50 active:scale-90"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {selectedQuestions.filter(q => q.section === section.split(' ')[1]).length === 0 && (
                                            <div className="text-center py-6 text-gray-400 font-bold border-2 border-dashed border-gray-100 rounded-2xl">
                                                No questions in this section
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 5:
                const paperStd = standards.find(s => s.id === selectedStd)?.name || 'N/A';
                const paperSub = subjects.find(s => s.id === selectedSubject)?.name || 'N/A';
                return (
                    <div className="animate-in slide-in-from-right-8 duration-700 perspective-[2000px]">
                        <div className="bg-white p-16 md:p-24 rounded-[3.5rem] border border-gray-200 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] space-y-16 max-w-4xl mx-auto ring-1 ring-gray-100 relative overflow-hidden">
                            {/* Watermark Simulation */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-[-35deg] font-black text-9xl select-none text-center">
                                {watermark}
                            </div>

                            <div className="text-center space-y-10 pb-16 border-b-8 border-double border-gray-900 relative z-10">
                                {logo && <img src={logo} alt="School Logo" className="w-24 h-24 mx-auto object-contain mb-4" />}
                                <div className="space-y-4">
                                    <h1 className="text-5xl font-black text-gray-900 tracking-tight">{schoolName || 'Institution Name'}</h1>
                                    <h2 className="text-3xl font-black uppercase tracking-[0.1em] text-gray-600 italic">{title || 'Academic Assessment'}</h2>
                                </div>

                                <div className="grid grid-cols-3 gap-y-10 px-8 pt-10 text-sm">
                                    <div className="text-left space-y-3 font-bold text-gray-700">
                                        <p>ધોરણ: <span className="text-gray-900">{paperStd}</span></p>
                                        <p>વિષય: <span className="text-gray-900">{paperSub}</span></p>
                                    </div>
                                    <div className="text-center space-y-3 font-bold text-gray-700 border-x border-gray-200">
                                        <p>સમય: <span className="text-gray-900">{duration}</span></p>
                                        <p>તારીખ: <span className="text-gray-900">{new Date(examDate).toLocaleDateString()}</span></p>
                                    </div>
                                    <div className="text-right space-y-3 font-bold text-gray-700">
                                        <p>કુલ ગુણ: <span className="text-gray-900">{selectedQuestions.reduce((acc, q) => acc + q.marks, 0)}</span></p>
                                        <p>શિક્ષક: <span className="text-gray-900">{teacherName}</span></p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-20 min-h-[600px] relative z-10">
                                {['Section A', 'Section B', 'Section C'].map((sec) => {
                                    const sectionQuestions = selectedQuestions.filter(q => q.section === sec.split(' ')[1]);
                                    if (sectionQuestions.length === 0) return null;

                                    return (
                                        <div key={sec} className="space-y-12">
                                            <div className="relative">
                                                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gray-900 opacity-20"></div>
                                                <h3 className="relative z-10 font-black text-2xl text-center bg-white w-fit mx-auto px-10 uppercase tracking-[0.5em] text-gray-900">વિભાગ - {sec.split(' ')[1]}</h3>
                                            </div>

                                            <div className="space-y-12 px-8">
                                                {sectionQuestions.map((q, qIdx) => (
                                                    <div key={q.questionId} className="flex gap-10 group relative">
                                                        <span className="font-black text-gray-900 shrink-0 text-2xl">પ્રશ્ન {qIdx + 1}:</span>
                                                        <div className="flex-1 space-y-6">
                                                            <div 
                                                                className="font-black text-gray-900 text-2xl leading-relaxed font-gujarati underline decoration-gray-100 underline-offset-8 transition-all hover:decoration-brand-blue/30 q-content"
                                                                dangerouslySetInnerHTML={{ __html: q.questionText }}
                                                            />

                                                            {q.type === 'MCQ' && q.options && (
                                                                <div className="grid grid-cols-2 gap-y-6 gap-x-20 pt-4">
                                                                    {Array.isArray(q.options) && q.options.map((opt: string, i: number) => (
                                                                        <div key={i} className="text-xl font-bold text-gray-600 font-gujarati">({String.fromCharCode(65 + i)}) {opt}</div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span className="font-black text-gray-900 shrink-0 self-start text-xl bg-gray-50 px-3 py-1 rounded-lg">({q.marks.toString().padStart(2, '૦')})</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="pt-20 text-center border-t-4 border-dotted border-gray-200 opacity-80">
                                <div className="flex items-center justify-center gap-6 mb-4">
                                    <div className="h-px w-20 bg-gray-300"></div>
                                    <p className="font-black text-gray-600 uppercase tracking-[0.4em] text-xs font-gujarati">{footerText}</p>
                                    <div className="h-px w-20 bg-gray-300"></div>
                                </div>
                                <p className="font-black text-gray-400 text-[10px] tracking-widest uppercase">Exam Documentation ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-1000">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-gray-100 pb-10">
                <div className="space-y-4">
                    <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-none">Paper Builder</h1>
                    <div className="flex items-center gap-4">
                        <p className="text-gray-400 font-black uppercase tracking-[0.25em] text-[11px] flex items-center gap-2">
                            Academic Module <ChevronRight className="w-3 h-3" /> <span className="text-brand-blue">Workflow Active</span>
                        </p>
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    </div>
                </div>

                <div className="flex gap-4">
                    {step === 5 && (
                        <>
                            <button
                                onClick={() => handleSave('DRAFT')}
                                disabled={isSaving}
                                className="flex items-center gap-4 px-10 py-5 bg-white border border-gray-200 rounded-[1.5rem] text-sm font-black text-gray-700 hover:bg-gray-50 transition-all shadow-xl shadow-gray-200/40 hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                            >
                                {isSaving ? <Clock className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                                Save as Draft
                            </button>
                            <button
                                onClick={() => handleSave('PUBLISHED')}
                                disabled={isSaving}
                                className="flex items-center gap-4 px-10 py-5 bg-brand-blue text-white rounded-[1.5rem] text-sm font-black shadow-xl shadow-brand-blue/40 hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                            >
                                {isSaving ? <Clock className="w-6 h-6 animate-spin" /> : <Printer className="w-6 h-6" />}
                                Publish Paper
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Premium Stepper */}
            <div className="bg-white px-12 py-10 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/40 overflow-x-auto no-scrollbar relative">
                <div className="flex items-center justify-between min-w-[800px] relative z-10">
                    {steps.map((s, i) => (
                        <React.Fragment key={s.id}>
                            <button
                                onClick={() => step > s.id && setStep(s.id)}
                                disabled={step < s.id}
                                className="flex flex-col items-center gap-6 group"
                            >
                                <div className={clsx(
                                    "w-16 h-16 rounded-[1.75rem] flex items-center justify-center font-black text-xl transition-all duration-700 relative",
                                    step >= s.id
                                        ? "bg-brand-blue text-white shadow-2xl shadow-brand-blue/40 scale-110"
                                        : "bg-gray-50 text-gray-300 border border-gray-100"
                                )}>
                                    {step > s.id ? <Check className="w-8 h-8 stroke-[4px]" /> : s.id}
                                    {step === s.id && (
                                        <div className="absolute -inset-2 bg-brand-blue/10 rounded-[2rem] animate-ping opacity-30"></div>
                                    )}
                                </div>
                                <span className={clsx(
                                    "text-xs font-black uppercase tracking-[0.25em] transition-all duration-500",
                                    step >= s.id ? "text-gray-900 opacity-100" : "text-gray-300 opacity-50"
                                )}>
                                    {s.name}
                                </span>
                            </button>
                            {i < steps.length - 1 && (
                                <div className={clsx(
                                    "h-1 flex-1 mx-4 rounded-full transition-all duration-1000",
                                    step > s.id ? "bg-brand-blue shadow-[0_0_15px_rgba(30,58,138,0.3)]" : "bg-gray-50"
                                )}></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <main className="min-h-[600px] py-6 mb-20">
                {renderStepContent()}
            </main>

            {/* Footer Navigation */}
            <div className="fixed bottom-0 left-64 right-0 bg-white/80 backdrop-blur-3xl border-t border-gray-100 p-8 z-50 flex items-center justify-between px-16 shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
                <button
                    disabled={step === 1}
                    onClick={() => setStep(prev => prev - 1)}
                    className="flex items-center gap-4 px-10 py-5 rounded-2xl text-sm font-black text-gray-500 hover:bg-gray-50 transition-all disabled:opacity-30 active:scale-95 border-2 border-transparent"
                >
                    <ChevronLeft className="w-6 h-6" />
                    Previous Stage
                </button>

                <div className="flex-1 max-w-2xl px-12 hidden lg:block">
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-blue transition-all duration-1000 ease-out" style={{ width: `${(step / 5) * 100}%` }}></div>
                    </div>
                </div>

                <button
                    onClick={() => {
                        if (step === 4 && !title) {
                            toast.warning('Please enter a title for the paper');
                            return;
                        }
                        setStep(prev => Math.min(prev + 1, 5));
                    }}
                    className="flex items-center gap-4 px-12 py-5 bg-brand-blue text-white rounded-[1.5rem] text-sm font-black shadow-2xl shadow-brand-blue/40 hover:bg-blue-800 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
                    disabled={step === 5 || (step === 1 && !selectedStd) || (step === 2 && !selectedSubject)}
                >
                    {step === 4 ? 'Review Document' : 'Next Stage'}
                    <ChevronRight className="w-6 h-6 ml-2" />
                </button>
            </div>
        </div>
    );
};

export default CreatePaper;
