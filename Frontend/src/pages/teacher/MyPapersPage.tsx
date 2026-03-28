import React, { useEffect, useState } from 'react';
import { FileText, Download, Edit3, Trash2, Eye, Share2, Plus, Clock, FileCheck, ChevronRight } from 'lucide-react';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';
import { paperService } from '../../api/paperService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const MyPapersPage: React.FC = () => {
    const navigate = useNavigate();
    const [papers, setPapers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

    useEffect(() => {
        fetchPapers(1);
    }, []);

    const fetchPapers = async (page: number) => {
        setIsLoading(true);
        try {
            const response = await paperService.getPapers({ page, limit: 10 });
            setPapers(response.data);
            setPagination({
                page: response.pagination.page,
                totalPages: response.pagination.totalPages
            });
        } catch (error) {
            toast.error('Failed to fetch papers');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = async (id: string) => {
        try {
            await paperService.downloadPaper(id);
            toast.success('Download started');
        } catch (error) {
            toast.error('Download failed');
        }
    };

    const columns = [
        {
            header: 'Exam Paper Details',
            accessor: (p: any) => (
                <div className="flex items-center gap-5 py-2">
                    <div className="w-14 h-14 rounded-3xl bg-brand-blue/10 text-brand-blue flex items-center justify-center shrink-0 shadow-lg shadow-brand-blue/5 border border-brand-blue/10">
                        <FileText className="w-7 h-7" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <span className="text-xl font-black text-gray-900 leading-tight font-gujarati group-hover:text-brand-blue transition-colors">{p.title}</span>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-0.5">ID: GEN-PPR-{p.id.substring(0, 8)}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Metadata',
            accessor: (p: any) => (
                <div className="flex flex-col gap-2">
                    <div className="text-sm font-black text-gray-700">{p.standard?.name || 'N/A'} • {p.subject?.name || 'N/A'}</div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(p.createdAt).toLocaleDateString()}
                    </div>
                </div>
            )
        },
        {
            header: 'Configuration',
            accessor: (p: any) => (
                <div className="flex flex-col gap-2">
                    <Badge variant={p.status === 'PUBLISHED' ? 'success' : 'warning'}>
                        {p.status}
                    </Badge>
                </div>
            )
        },
        {
            header: 'Actions',
            accessor: (p: any) => (
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => navigate(`/teacher/papers/${p.id}`)}
                        className="p-3 rounded-2xl border border-gray-100 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/5 transition-all shadow-sm active:scale-95"
                    >
                        <Eye className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => handleDownload(p.id)}
                        className="p-3 rounded-2xl border border-gray-100 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/5 transition-all shadow-sm active:scale-95"
                    >
                        <Download className="w-5 h-5" />
                    </button>
                    <button className="p-3 rounded-2xl border border-gray-100 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/5 transition-all shadow-sm active:scale-95">
                        <Share2 className="w-5 h-5" />
                    </button>
                    <div className="w-px h-8 bg-gray-100 mx-2"></div>
                    <button className="p-3 rounded-2xl border border-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm active:scale-95">
                        <Trash2 className="w-5 h-5" />
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
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">My Generated Papers</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.15em] text-[10px] flex items-center gap-2">
                        Official Archive <ChevronRight className="w-3 h-3" /> <span className="text-brand-blue">Drafts & Published Works</span>
                    </p>
                </div>

                <button
                    onClick={() => navigate('/teacher/create-paper')}
                    className="flex items-center gap-3 px-10 py-4 bg-brand-blue text-white rounded-2xl text-sm font-black shadow-2xl shadow-brand-blue/40 hover:bg-blue-800 transition-all hover:-translate-y-1 active:translate-y-0"
                >
                    <Plus className="w-5 h-5 stroke-[3px]" />
                    Build New Exam
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3">
                    <DataTable
                        columns={columns}
                        data={papers}
                        isLoading={isLoading}
                        pagination={{ 
                            currentPage: pagination.page, 
                            totalPages: pagination.totalPages, 
                            onPageChange: (p) => fetchPapers(p) 
                        }}
                    />
                </div>
                <div className="space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8 relative z-10">Productivity Stats</h3>
                        <div className="space-y-8 relative z-10">
                            <div className="flex gap-4">
                                <div className="w-11 h-11 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                                    <FileCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-xl font-black text-gray-900">124</span>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-0.5 mt-0.5">Published Papers</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-11 h-11 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                                    <Edit3 className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-xl font-black text-gray-900">42</span>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-0.5 mt-0.5">Active Drafts</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center shrink-0">
                                    <Download className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-xl font-black text-gray-900">8,450</span>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-0.5 mt-0.5">Total Downloads</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-brand-blue rounded-[2.5rem] p-10 text-white shadow-2xl shadow-brand-blue/30 relative overflow-hidden">
                        <div className="relative z-10 space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] opacity-60">Pro Feature</h4>
                            <h3 className="text-2xl font-black leading-tight">Export all papers to Google Drive.</h3>
                            <button className="w-full py-4 bg-white text-brand-blue rounded-xl font-black text-xs hover:bg-gray-50 transition-all shadow-xl shadow-brand-blue/40">Connect Drive</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPapersPage;
