import React, { useState, useEffect } from 'react';
import { GraduationCap, BookOpen, FileText, MoreVertical, TrendingUp, Users, Loader2 } from 'lucide-react';
import Badge from '../../components/Badge';
import axios from 'axios';

const SchoolDashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:3000/schools/dashboard-stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(res.data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="w-12 h-12 text-brand-blue animate-spin" />
            </div>
        );
    }

    const stats = data?.stats || [];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">School Admin Dashboard</h1>
                <p className="text-gray-500 font-medium italic">Institution Overview | Real-time Metrics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat: any, i: number) => {
                    const icons: Record<string, any> = {
                        'Teachers': GraduationCap,
                        'School Questions': BookOpen,
                        'Papers Created': FileText,
                        'Active Students': Users
                    };
                    const Icon = icons[stat.label] || TrendingUp;
                    return (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all group scale-100 hover:scale-[1.02]">
                            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-6`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div className="text-3xl font-extrabold text-gray-900 mb-1">{stat.value}</div>
                            <div className="text-gray-500 font-bold text-xs uppercase tracking-widest">{stat.label}</div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col min-h-[400px]">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-gray-900">Recent Teachers Added</h3>
                        <button className="text-sm font-bold text-brand-blue hover:underline decoration-2 transition-all">View All</button>
                    </div>
                    <div className="space-y-6 flex-1">
                        {data?.recentTeachers?.length > 0 ? data.recentTeachers.map((teacher: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:border-brand-blue/20 hover:bg-brand-blue/5 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 group-hover:bg-brand-blue/20 group-hover:text-brand-blue transition-colors">
                                        {teacher.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900 leading-tight mb-0.5">{teacher.name}</div>
                                        <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">{teacher.email}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge variant={teacher.status === 'Active' ? 'success' : 'warning'}>{teacher.status}</Badge>
                                    <button className="p-2 hover:bg-white rounded-lg transition-colors border-0">
                                        <MoreVertical className="w-4 h-4 text-gray-400" />
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 italic">
                                No teachers found yet.
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col min-h-[400px]">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-gray-900">Weekly Performance</h3>
                        <div className="flex items-center gap-2 text-green-600 text-sm font-extrabold uppercase tracking-widest">
                            <TrendingUp className="w-4 h-4" />
                            Live Statistics
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-end gap-6 h-64">
                        <div className="flex items-end justify-between gap-3 h-full px-4">
                            {[45, 60, 40, 80, 50, 70, 90].map((h, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-3">
                                    <div
                                        className={`w-full rounded-t-lg transition-all duration-1000 ${i === 6 ? 'bg-brand-blue shadow-lg shadow-brand-blue/30' : 'bg-brand-blue/20 hover:bg-brand-blue/40'}`}
                                        style={{ height: `${h}%` }}
                                    ></div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                            <div className="p-4 rounded-xl bg-gray-50/50">
                                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1">Most Active Module</span>
                                <span className="text-sm font-bold text-gray-900">Question Repository</span>
                            </div>
                            <div className="p-4 rounded-xl bg-gray-50/50">
                                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1">Total Impact</span>
                                <span className="text-sm font-bold text-gray-900">{data?.stats?.[2]?.value || 0} Assets Built</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchoolDashboard;
