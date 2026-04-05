import React, { useEffect, useState } from 'react';
import { 
    FileText, 
    Download, 
    Eye, 
    Clock, 
    ChevronRight, 
    PlusCircle, 
    CheckCircle, 
    Award,
    FileCheck,
    Edit3
} from 'lucide-react';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';
import { paperService } from '../../api/paperService';
import api from '../../lib/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';

const MyPapersPage: React.FC = () => {
    const navigate = useNavigate();
    const [papers, setPapers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

    const [stats, setStats] = useState({
        totalPapers: 0,
        publishedPapers: 0,
        drafts: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [allRes, pubRes, draftRes] = await Promise.all([
                    api.get('/papers?limit=1'),
                    api.get('/papers?status=PUBLISHED&limit=1'),
                    api.get('/papers?status=DRAFT&limit=1')
                ]);
                setStats({
                    totalPapers: allRes.data.pagination.totalRecords,
                    publishedPapers: pubRes.data.pagination.totalRecords,
                    drafts: draftRes.data.pagination.totalRecords,
                });
            } catch (err) {
                console.error('Error fetching paper stats:', err);
            }
        };
        fetchStats();
        fetchPapers(1);
    }, []);

    const fetchPapers = async (p = 1) => {
        setIsLoading(true);
        try {
            const response = await paperService.getPapers({ page: p, limit: 10 });
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
            toast.info('Downloading paper...');
            await paperService.downloadPaper(id);
            toast.success('Download started');
        } catch (error) {
            toast.error('Download failed');
        }
    };

    const columns = [
        {
            header: 'Exam Paper Title',
            accessor: (p: any) => (
                <div className="flex items-center gap-4 py-1">
                    <div className="w-11 h-11 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[15px] font-black text-gray-900 group-hover:text-brand-blue transition-colors leading-tight font-gujarati">{p.title}</span>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded">
                                {p.standard?.name || 'N/A'}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded">
                                {p.subject?.name || 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Generated On',
            accessor: (p: any) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                        {new Date(p.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest pl-0.5">
                        <Clock className="w-3 h-3" />
                        {new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            )
        },
        {
            header: 'Blueprint Details',
            accessor: (p: any) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-gray-800">{p.totalMarks} Marks</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest pl-0.5">
                        Duration: {p.duration}
                    </div>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: (p: any) => (
                <Badge variant={p.status === 'PUBLISHED' ? 'success' : 'warning'}>
                    {p.status}
                </Badge>
            )
        },
        {
            header: 'Actions',
            accessor: (p: any) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigate(`/teacher/papers/${p.id}`)}
                        className="p-3 bg-gray-50/50 hover:bg-brand-blue/5 text-gray-300 hover:text-brand-blue rounded-2xl transition-all border border-transparent hover:border-brand-blue/10 shadow-sm"
                        title="View Paper Details"
                    >
                        <Eye className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => handleDownload(p.id)}
                        className="p-3 bg-gray-50/50 hover:bg-brand-blue/5 text-gray-300 hover:text-brand-blue rounded-2xl transition-all border border-transparent hover:border-brand-blue/10 shadow-sm"
                        title="Download Paper PDF"
                    >
                        <Download className="w-5 h-5" />
                    </button>
                </div>
            ),
            className: "text-right"
        }
    ];

    const teacherStats = [
        { label: 'Total Papers', value: stats.totalPapers.toString(), icon: FileText, color: 'blue' },
        { label: 'Published Papers', value: stats.publishedPapers.toString(), icon: CheckCircle, color: 'green' },
        { label: 'Draft Papers', value: stats.drafts.toString(), icon: Award, color: 'orange' },
    ];

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none uppercase italic underline decoration-brand-blue/30 decoration-8 underline-offset-8">My Repository</h1>
                    <p className="text-gray-500 font-black uppercase tracking-[0.25em] text-[11px] flex items-center gap-2">
                        Exam Archive <ChevronRight className="w-3 h-3" /> <span className="text-brand-blue">All Generated Materials</span>
                    </p>
                </div>

                <div className="flex gap-4">
                    <button onClick={() => navigate('/teacher/create-paper')} className="flex items-center gap-3 px-10 py-5 bg-brand-blue text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest shadow-2xl shadow-brand-blue/40 hover:bg-blue-800 transition-all hover:-translate-y-1 active:scale-95">
                        <PlusCircle className="w-5 h-5" />
                        Create New Blueprint
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {teacherStats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className="bg-white p-10 rounded-[2.75rem] border border-gray-100 shadow-2xl shadow-gray-200/20 hover:shadow-brand-blue/10 transition-all group scale-100 relative overflow-hidden">
                            <div className={clsx(
                                "absolute top-0 right-0 w-32 h-32 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl opacity-5",
                                stat.color === 'blue' ? "bg-brand-blue" : stat.color === 'green' ? "bg-green-500" : "bg-brand-orange"
                            )}></div>
                            <div className={clsx(
                                "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110",
                                stat.color === 'blue' ? "bg-blue-50 text-brand-blue shadow-lg shadow-blue-100" : stat.color === 'green' ? "bg-green-50 text-green-600 shadow-lg shadow-green-100" : "bg-orange-50 text-brand-orange shadow-lg shadow-orange-100"
                            )}>
                                <Icon className="w-7 h-7" />
                            </div>
                            <div className="text-5xl font-black text-gray-900 mb-2 leading-none font-sans">{stat.value}</div>
                            <div className="text-gray-400 font-black text-[11px] uppercase tracking-[0.2em]">{stat.label}</div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                <div className="lg:col-span-3">
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

                <div className="space-y-8">
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8 relative z-10">Productivity Stats</h3>
                        <div className="space-y-8 relative z-10">
                            <div className="flex gap-4">
                                <div className="w-11 h-11 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                                    <FileCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-xl font-black text-gray-900">{stats.publishedPapers}</span>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-0.5 mt-0.5">Published Papers</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-11 h-11 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                                    <Edit3 className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-xl font-black text-gray-900">{stats.drafts}</span>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-0.5 mt-0.5">Active Drafts</p>
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
