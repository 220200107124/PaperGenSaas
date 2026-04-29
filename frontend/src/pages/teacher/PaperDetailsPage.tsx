import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ChevronLeft, 
    Download, 
    Printer, 
    Clock, 
    Calendar,
    User,
    Building2,
    BookOpen
} from 'lucide-react';
import { paperService } from '../../api/paperService';
import { toast } from 'react-toastify';
import Badge from '../../components/Badge';

const PaperDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [paper, setPaper] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchPaperDetails(id);
        }
    }, [id]);

    const fetchPaperDetails = async (paperId: string) => {
        setIsLoading(true);
        try {
            const response = await paperService.getPaperById(paperId);
            setPaper(response.data);
        } catch (error) {
            toast.error('Failed to fetch paper details');
            navigate('/teacher/papers');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!id) return;
        try {
            toast.info('Generating your PDF...');
            await paperService.downloadPaper(id);
            toast.success('Download started!');
        } catch (error) {
            toast.error('Failed to download paper');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[600px]">
                <div className="w-16 h-16 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!paper) return null;

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => navigate('/teacher/papers')}
                        className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-brand-blue transition-all shadow-sm active:scale-95"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight font-gujarati uppercase">{paper.title}</h1>
                        <div className="flex items-center gap-4 mt-2">
                           <Badge variant={paper.status === 'PUBLISHED' ? 'success' : 'warning'}>
                               {paper.status}
                           </Badge>
                           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-0.5">ID: GEN-PPR-{paper.id.substring(0, 8)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleDownload}
                        className="flex items-center gap-3 px-8 py-4 bg-brand-blue text-white rounded-2xl text-sm font-black shadow-2xl shadow-brand-blue/40 hover:bg-blue-800 transition-all hover:-translate-y-1 active:scale-95"
                    >
                        <Download className="w-5 h-5" />
                        Download PDF
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Content - Preview */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[800px]">
                        {/* Paper Preview Card */}
                        <div className="p-16 space-y-16">
                             {/* School Header */}
                             <div className="text-center border-b-2 border-gray-100 pb-16">
                                {paper.logo && (
                                    <img src={paper.logo} alt="School Logo" className="w-24 h-24 mx-auto mb-6 object-contain" />
                                )}
                                <h2 className="text-4xl font-black text-gray-900 mb-2 font-gujarati">{paper.schoolName || 'Institution Name'}</h2>
                                <h3 className="text-2xl font-bold text-gray-500 uppercase tracking-[0.2em] font-gujarati italic">{paper.title}</h3>
                             </div>

                             {/* Metadata Grid */}
                             <div className="grid grid-cols-3 gap-10 text-sm font-bold text-gray-700 bg-gray-50/50 p-8 rounded-3xl border border-gray-100">
                                <div className="space-y-3">
                                    <p className="flex items-center gap-3"><span className="text-gray-400 uppercase text-[10px] tracking-widest w-20">Standard:</span> <span className="text-gray-900">{paper.standard?.name}</span></p>
                                    <p className="flex items-center gap-3"><span className="text-gray-400 uppercase text-[10px] tracking-widest w-20">Subject:</span> <span className="text-gray-900">{paper.subject?.name}</span></p>
                                </div>
                                <div className="space-y-3 border-x border-gray-200 px-10 text-center">
                                    <p className="flex items-center gap-3 justify-center"><span className="text-gray-400 uppercase text-[10px] tracking-widest w-20 text-right">Duration:</span> <span className="text-gray-900">{paper.duration}</span></p>
                                    <p className="flex items-center gap-3 justify-center"><span className="text-gray-400 uppercase text-[10px] tracking-widest w-20 text-right">Date:</span> <span className="text-gray-900">{new Date(paper.examDate).toLocaleDateString()}</span></p>
                                </div>
                                <div className="space-y-3 text-right">
                                    <p className="flex items-center gap-3 justify-end"><span className="text-gray-400 uppercase text-[10px] tracking-widest w-20 text-right">Marks:</span> <span className="text-gray-900 text-2xl font-black">{paper.totalMarks}</span></p>
                                    <p className="flex items-center gap-3 justify-end"><span className="text-gray-400 uppercase text-[10px] tracking-widest w-20 text-right">Teacher:</span> <span className="text-gray-900 italic underline underline-offset-4">{paper.teacherName}</span></p>
                                </div>
                             </div>

                             {/* Questions Section */}
                             <div className="space-y-20 pt-10">
                                {['A', 'B', 'C'].map((sec) => {
                                    const sectionQuestions = paper.paperQuestions?.filter((pq: any) => pq.section === sec) || [];
                                    if (sectionQuestions.length === 0) return null;

                                    return (
                                        <div key={sec} className="space-y-12">
                                            <div className="relative">
                                                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gray-200"></div>
                                                <h3 className="relative z-10 font-black text-2xl text-center bg-white w-fit mx-auto px-10 uppercase tracking-[0.5em] text-gray-900">SECTION - {sec}</h3>
                                            </div>

                                            <div className="space-y-12">
                                                {sectionQuestions.sort((a: any, b: any) => a.order - b.order).map((pq: any, idx: number) => (
                                                    <div key={pq.id} className="flex gap-10 group relative">
                                                        <span className="font-black text-gray-400 shrink-0 text-2xl group-hover:text-brand-blue transition-colors">{idx + 1}.</span>
                                                        <div className="flex-1 space-y-6">
                                                            <div 
                                                                className="font-black text-gray-900 text-2xl leading-relaxed font-gujarati"
                                                                dangerouslySetInnerHTML={{ __html: pq.question.questionText }}
                                                            />

                                                            {pq.question.type === 'MCQ' && pq.question.options && (
                                                                <div className="grid grid-cols-2 gap-y-6 gap-x-20 pt-4">
                                                                    {Array.isArray(pq.question.options) && pq.question.options.map((opt: string, i: number) => (
                                                                        <div key={i} className="text-xl font-bold text-gray-600 font-gujarati">({String.fromCharCode(65 + i)}) {opt}</div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span className="font-black text-gray-900 shrink-0 self-start text-xl bg-gray-50 px-4 py-2 rounded-2xl">({(pq.customMarks || pq.question.marks).toString().padStart(2, '0')})</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                             </div>

                             {/* Footer */}
                             {paper.footerText && (
                                <div className="pt-20 text-center border-t-2 border-dashed border-gray-100 opacity-60">
                                    <p className="font-black text-gray-400 uppercase tracking-[0.4em] text-xs font-gujarati italic">{paper.footerText}</p>
                                </div>
                             )}
                        </div>
                    </div>
                </div>

                {/* Sidebar - Paper Info */}
                <div className="space-y-8">
                     <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm space-y-10">
                         <div>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Document Meta</h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-0.5">Created On</p>
                                        <span className="text-sm font-black text-gray-900">{new Date(paper.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-0.5">Author</p>
                                        <span className="text-sm font-black text-gray-900">{paper.teacher?.name}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-0.5">Institution</p>
                                        <span className="text-sm font-black text-gray-900">{paper.schoolName || 'Institution Name'}</span>
                                    </div>
                                </div>
                            </div>
                         </div>

                         <div className="pt-10 border-t border-gray-100">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Configuration</h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-0.5">Standard & Subject</p>
                                        <span className="text-sm font-black text-brand-blue uppercase tracking-tight">{paper.standard?.name} | {paper.subject?.name}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-0.5">Examination Duration</p>
                                        <span className="text-sm font-black text-gray-900 underline decoration-brand-blue/30 decoration-4 underline-offset-4">{paper.duration}</span>
                                    </div>
                                </div>
                            </div>
                         </div>
                     </div>

                     <div className="bg-brand-blue rounded-[2.5rem] p-10 text-white shadow-2xl shadow-brand-blue/30 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/20 transition-all duration-700"></div>
                        <div className="relative z-10 space-y-4">
                            <Printer className="w-10 h-10 mb-4 opacity-40" />
                            <h3 className="text-2xl font-black leading-tight">Professional Paper Layout</h3>
                            <p className="text-xs font-bold text-white/60 leading-relaxed">This paper uses our premium branding engine for maximum institutional impact.</p>
                            <button 
                                onClick={handleDownload}
                                className="w-full py-4 mt-6 bg-white text-brand-blue rounded-xl font-black text-xs hover:bg-gray-50 transition-all shadow-xl shadow-brand-blue/20"
                            >
                                Re-generate Document
                            </button>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default PaperDetailsPage;
