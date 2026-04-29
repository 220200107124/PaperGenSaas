import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, PlusCircle, CheckCircle2, Clock, Star, Users, Trash2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Badge from '../../components/Badge';
import api from '../../lib/axios';

const TeacherDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalPapers: 0,
        totalQuestions: 0,
        publishedPapers: 0,
    });
    const [recentPapers, setRecentPapers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [papersRes, questionsRes, allPapersRes] = await Promise.all([
                    api.get('/papers?limit=5&sortBy=createdAt&order=DESC'),
                    api.get('/questions?limit=1'),
                    api.get('/papers?status=PUBLISHED&limit=1')
                ]);

                setRecentPapers(papersRes.data?.data || []);
                setStats({
                    totalPapers: papersRes.data?.pagination?.totalRecords || 0,
                    totalQuestions: questionsRes.data?.pagination?.totalRecords || 0,
                    publishedPapers: allPapersRes.data?.pagination?.totalRecords || 0,
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const teacherStats = [
        { label: 'My Papers', value: stats.totalPapers.toString(), icon: FileText, color: 'text-brand-blue', bg: 'bg-brand-blue/10' },
        { label: 'Total Questions', value: stats.totalQuestions.toString(), icon: BookOpen, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Avg Accuracy', value: '88%', icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        { label: 'Published Papers', value: stats.publishedPapers.toString(), icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    return (
        <div className="space-y-6 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-2 px-2 md:px-0">
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Teacher Dashboard</h1>
                <p className="text-sm md:text-base text-gray-400 font-bold uppercase tracking-widest text-[10px] md:text-xs leading-none">Gujarat Medium • Primary Schools</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                {teacherStats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/10 hover:shadow-2xl transition-all group scale-100">
                            <div className={`w-12 h-12 md:w-14 md:h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110 shadow-lg`}>
                                <Icon className="w-6 h-6 md:w-7 md:h-7" />
                            </div>
                            <div className="text-2xl md:text-4xl font-black text-gray-900 mb-1 md:mb-2 leading-none">{stat.value}</div>
                            <div className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em]">{stat.label}</div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
                <div className="lg:col-span-2 space-y-6 md:space-y-8">
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 p-6 md:p-8 flex flex-col min-h-[400px]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-gray-50 pb-6 gap-4">
                            <h3 className="text-lg md:text-xl font-black text-gray-900">Recent Exam Papers</h3>
                            <div className="flex gap-3">
                                <button onClick={() => navigate('/teacher/create-paper')} className="flex items-center gap-2 bg-brand-blue text-white px-4 md:px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-blue/30 hover:bg-blue-800 transition-all active:scale-95">
                                    <PlusCircle className="w-4 h-4" />
                                    New Paper
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4 flex-1">
                            {isLoading ? (
                                <div className="flex items-center justify-center p-10">
                                    <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
                                </div>
                            ) : recentPapers.length > 0 ? (
                                recentPapers.map((paper, i) => (
                                    <div key={i} onClick={() => navigate(`/teacher/papers/${paper.id}`)} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 md:p-6 rounded-3xl border border-gray-50 hover:border-brand-blue/20 hover:bg-brand-blue/5 transition-all group cursor-pointer gap-4">
                                        <div className="flex items-center gap-5">
                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gray-50 flex items-center justify-center font-bold text-gray-300 group-hover:bg-brand-blue/20 group-hover:text-brand-blue transition-colors">
                                                <FileText className="w-5 h-5 md:w-6 md:h-6" />
                                            </div>
                                            <div>
                                                <div className="font-black text-base md:text-lg text-gray-900 leading-tight mb-1 group-hover:text-brand-blue transition-colors">{paper.title}</div>
                                                <div className="text-[10px] md:text-xs text-gray-400 font-black uppercase tracking-widest">{paper.standard?.name || 'Standard'} • {new Date(paper.createdAt).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-4 sm:pt-0">
                                            <Badge variant={paper.status === 'PUBLISHED' ? 'success' : 'warning'} className="tracking-widest font-black uppercase text-[9px]">{paper.status === 'PUBLISHED' ? 'Published' : 'Draft'}</Badge>
                                            <button 
                                                onClick={(e) => { 
                                                    e.stopPropagation(); 
                                                    // handleDelete(paper.id);
                                                }}
                                                className="p-3 bg-gray-50/50 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-2xl transition-all border border-transparent hover:border-red-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-400 py-10 font-bold">
                                    No recent papers found. Create your first paper!
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6 md:space-y-8 h-full">
                    {/* 
                    <div className="bg-brand-blue rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl shadow-brand-blue/40 relative overflow-hidden group min-h-[300px] flex flex-col justify-between">
                        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl transition-transform group-hover:scale-150 duration-1000"></div>
                        <div className="absolute top-10 right-10 opacity-20 transition-transform group-hover:scale-110 group-hover:rotate-12 duration-1000">
                        </div>

 
                        <div className="relative z-10">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-200 mb-4">PaperGen Pro Tip</p>
                            <h3 className="text-xl md:text-2xl font-black leading-tight mb-8">You can add custom questions in Section D for final exams.</h3>
                            <button className="bg-white text-brand-blue py-4 px-8 rounded-2xl text-[10px] font-black tracking-widest uppercase hover:bg-gray-50 active:scale-95 transition-all shadow-xl shadow-black/20">
                                Start Building
                            </button>
                        </div>
                    </div>
                    */}

                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 p-8 flex flex-col space-y-8">
                        <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
                            <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 shadow-lg shadow-purple-100">
                                <Clock className="w-4 h-4" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Timeline</h3>
                        </div>

                        <div className="space-y-8">
                            <div className="flex gap-4 group">
                                <div className="w-10 h-10 rounded-2xl bg-green-50/50 flex items-center justify-center shrink-0 border border-green-100 transition-colors group-hover:bg-green-100">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <p className="text-sm font-black text-gray-800 leading-tight">Maths Exam Out</p>
                                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">3 hours ago</span>
                                </div>
                            </div>
                            <div className="flex gap-4 group">
                                <div className="w-10 h-10 rounded-2xl bg-orange-50/50 flex items-center justify-center shrink-0 border border-orange-100 transition-colors group-hover:bg-orange-100">
                                    <Clock className="w-4 h-4 text-orange-600" />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <p className="text-sm font-black text-gray-800 leading-tight">Science Drafted</p>
                                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Yesterday</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
