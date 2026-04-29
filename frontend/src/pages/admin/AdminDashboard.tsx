import React, { useState, useEffect } from 'react';
import { Users, School, Globe, CreditCard, ChevronUp, ChevronDown, CheckCircle2, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Badge from '../../components/Badge';
import { superAdminService } from '../../api/superAdminService';
import type { PlatformStats } from '../../api/superAdminService';

const AdminDashboard: React.FC = () => {
    const [statsData, setStatsData] = useState<PlatformStats | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await superAdminService.getStats();
                setStatsData(data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        { label: 'Total Schools', value: statsData?.totalSchools ?? '0', icon: School, color: 'text-brand-blue', bg: 'bg-brand-blue/10', change: '+12%', up: true },
        { label: 'Total Users', value: statsData?.totalUsers ?? '0', icon: Users, color: 'text-orange-600', bg: 'bg-orange-50', change: '+18%', up: true },
        { label: 'Global Questions', value: statsData?.globalQuestions?.toLocaleString() ?? '0', icon: Globe, color: 'text-green-600', bg: 'bg-green-50', change: '+5%', up: true },
        { label: 'Active Subscriptions', value: statsData?.activeSubscriptions ?? '0', icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-50', change: '-2%', up: false },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] px-4">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-bold text-sm sm:text-base">Loading Platform Dashboard...</p>
                </div>
            </div>
        );
    }

    const recentSchools = [
        { name: 'Sarvoday Vidyamandir', city: 'Ahmedabad', plan: 'Premium', status: 'Active', date: '2 hours ago' },
        { name: 'Shreeji Tuition Classes', city: 'Rajkot', plan: 'Standard', status: 'Active', date: '5 hours ago' },
        { name: 'Gyan Sarita High School', city: 'Surat', plan: 'Basic', status: 'Inactive', date: '1 day ago' },
        { name: 'Little Flowers Primary School', city: 'Vadodara', plan: 'Premium', status: 'Active', date: '2 days ago' },
    ];

    return (
        <div className="space-y-6 lg:space-y-10 px-3 sm:px-4 md:px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Super Admin Dashboard</h1>
                <p className="text-gray-400 font-black text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.2em]">System Performance Overview</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xl hover:shadow-2xl transition-all group scale-100 hover:scale-[1.02] duration-400">
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center duration-400 transition-all group-hover:rotate-12 group-hover:scale-110 shadow-lg`}>
                                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                                </div>
                                <div className={`flex items-center gap-1 text-[9px] sm:text-[10px] md:text-sm font-black ${stat.up ? 'text-green-600' : 'text-red-500'} bg-gray-50 px-2 py-1 rounded-full`}>
                                    {stat.up ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                    {stat.change}
                                </div>
                            </div>
                            <div className="text-xl sm:text-2xl md:text-4xl font-black text-gray-900 mb-1">{stat.value}</div>
                            <div className="text-gray-400 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em]">{stat.label}</div>
                        </div>
                    );
                })}
            </div>

            {/* Main Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">

                {/* Table */}
                <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden flex flex-col">
                    <div className="p-4 sm:p-6 md:p-8 border-b flex items-center justify-between">
                        <h3 className="text-base sm:text-lg md:text-xl font-black text-gray-900">Recent Schools</h3>
                        <button className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-brand-blue hover:underline" onClick={()=> navigate("/admin/schools")}>View All</button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px] text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 sm:px-6 md:px-8 py-3 text-[9px] font-black text-gray-400 uppercase">School Name</th>
                                    <th className="px-4 sm:px-6 md:px-8 py-3 text-[9px] font-black text-gray-400 uppercase">Plan</th>
                                    <th className="px-4 sm:px-6 md:px-8 py-3 text-[9px] font-black text-gray-400 uppercase">Status</th>
                                    <th className="px-4 sm:px-6 md:px-8 py-3 text-right text-[9px] font-black text-gray-400 uppercase">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentSchools.map((school, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="px-4 sm:px-6 md:px-8 py-4 sm:py-6">
                                            <div className="font-bold text-gray-900 text-sm sm:text-base">{school.name}</div>
                                            <div className="text-[9px] text-gray-400 uppercase">{school.city}</div>
                                        </td>
                                        <td className="px-4 sm:px-6 md:px-8 py-4 sm:py-6">
                                            <Badge variant={school.plan === 'Premium' ? 'info' : 'outline'} className="text-[9px]">{school.plan}</Badge>
                                        </td>
                                        <td className="px-4 sm:px-6 md:px-8 py-4 sm:py-6">
                                            <Badge variant={school.status === 'Active' ? 'success' : 'error'} className="text-[9px]">{school.status}</Badge>
                                        </td>
                                        <td className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 text-right text-[10px] text-gray-400">
                                            {school.date}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-4 sm:p-6 md:p-8 flex flex-col gap-6 lg:sticky lg:top-24">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg sm:text-xl font-black">System Health</h3>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-[10px] font-black">
                                <span className="text-gray-400">API Latency</span>
                                <span className="text-brand-blue">124ms</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                                <div className="bg-brand-blue h-2 rounded-full w-[85%]"></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-[10px] font-black">
                                <span className="text-gray-400">Cloud Storage</span>
                                <span className="text-orange-500">62%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                                <div className="bg-orange-500 h-2 rounded-full w-[62%]"></div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase mb-4">Platform Logs</h4>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                <div>
                                    <p className="text-sm font-black">Backup done</p>
                                    <span className="text-[9px] text-gray-400">15m ago</span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Clock className="w-4 h-4 text-orange-600" />
                                <div>
                                    <p className="text-sm font-black">Update pending</p>
                                    <span className="text-[9px] text-gray-400">1h ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;


// import React, { useState, useEffect } from 'react';
// import { Users, School, Globe, CreditCard, ChevronUp, ChevronDown, CheckCircle2, Clock } from 'lucide-react';
// import Badge from '../../components/Badge';
// import { superAdminService } from '../../api/superAdminService';
// import type { PlatformStats } from '../../api/superAdminService';

// const AdminDashboard: React.FC = () => {
//     const [statsData, setStatsData] = useState<PlatformStats | null>(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchStats = async () => {
//             try {
//                 const data = await superAdminService.getStats();
//                 setStatsData(data);
//             } catch (error) {
//                 console.error('Failed to fetch stats:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchStats();
//     }, []);

//     const stats = [
//         { label: 'Total Schools', value: statsData?.totalSchools ?? '0', icon: School, color: 'text-brand-blue', bg: 'bg-brand-blue/10', change: '+12%', up: true },
//         { label: 'Total Users', value: statsData?.totalUsers ?? '0', icon: Users, color: 'text-orange-600', bg: 'bg-orange-50', change: '+18%', up: true },
//         { label: 'Global Questions', value: statsData?.globalQuestions.toLocaleString() ?? '0', icon: Globe, color: 'text-green-600', bg: 'bg-green-50', change: '+5%', up: true },
//         { label: 'Active Subscriptions', value: statsData?.activeSubscriptions ?? '0', icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-50', change: '-2%', up: false },
//     ];

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center min-h-[400px]">
//                 <div className="flex flex-col items-center gap-4">
//                     <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
//                     <p className="text-gray-500 font-bold">Loading Platform Dashboard...</p>
//                 </div>
//             </div>
//         );
//     }

//     const recentSchools = [
//         { name: 'Sarvoday Vidyamandir', city: 'Ahmedabad', plan: 'Premium', status: 'Active', date: '2 hours ago' },
//         { name: 'Shreeji Tuition Classes', city: 'Rajkot', plan: 'Standard', status: 'Active', date: '5 hours ago' },
//         { name: 'Gyan Sarita High School', city: 'Surat', plan: 'Basic', status: 'Inactive', date: '1 day ago' },
//         { name: 'Little Flowers Primary School', city: 'Vadodara', plan: 'Premium', status: 'Active', date: '2 days ago' },
//     ];

//     return (
//         <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
//             <div className="flex flex-col gap-1 px-2 md:px-0">
//                 <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Super Admin Dashboard</h1>
//                 <p className="text-gray-400 font-black text-[10px] md:text-xs uppercase tracking-[0.2em] leading-none">System Performance Overview</p>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
//                 {stats.map((stat, i) => (
//                     <div key={i} className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 hover:shadow-2xl hover:shadow-brand-blue/5 transition-all group scale-100 hover:scale-[1.02]">
//                         <div className="flex items-center justify-between mb-6">
//                             <div className={`w-12 h-12 md:w-14 md:h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center transition-all group-hover:rotate-12 group-hover:scale-110 shadow-lg`}>
//                                 {(() => {
//                                     const Icon = stat.icon;
//                                     return <Icon className="w-6 h-6 md:w-7 md:h-7" />;
//                                 })()}
//                             </div>
//                             <div className={`flex items-center gap-1 text-[10px] md:text-sm font-black ${stat.up ? 'text-green-600' : 'text-red-500'} bg-gray-50 px-2 py-1 rounded-full`}>
//                                 {stat.up ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
//                                 {stat.change}
//                             </div>
//                         </div>
//                         <div className="text-2xl md:text-4xl font-black text-gray-900 mb-1 md:mb-2 leading-none">{stat.value}</div>
//                         <div className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em]">{stat.label}</div>
//                     </div>
//                 ))}
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
//                 <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden min-h-[400px] flex flex-col">
//                     <div className="p-6 md:p-8 border-b border-gray-50 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
//                         <h3 className="text-lg md:text-xl font-black text-gray-900">Recent Schools</h3>
//                         <button className="text-[10px] font-black uppercase tracking-widest text-brand-blue hover:underline decoration-2 transition-all">View All</button>
//                     </div>
//                     <div className="overflow-x-auto flex-1">
//                         <table className="w-full text-left min-w-[600px]">
//                             <thead className="bg-gray-50/50">
//                                 <tr>
//                                     <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">School Name</th>
//                                     <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Plan</th>
//                                     <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Status</th>
//                                     <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 text-right">Date</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y divide-gray-50">
//                                 {recentSchools.map((school, i) => (
//                                     <tr key={i} className="hover:bg-gray-50/80 transition-colors group">
//                                         <td className="px-8 py-6">
//                                             <div className="font-bold text-gray-900 leading-tight mb-1 group-hover:text-brand-blue transition-colors text-sm md:text-base">{school.name}</div>
//                                             <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{school.city}</div>
//                                         </td>
//                                         <td className="px-8 py-6">
//                                             <Badge variant={school.plan === 'Premium' ? 'info' : 'outline'} className="tracking-widest font-black uppercase text-[9px]">{school.plan}</Badge>
//                                         </td>
//                                         <td className="px-8 py-6">
//                                             <Badge variant={school.status === 'Active' ? 'success' : 'error'} className="tracking-widest font-black uppercase text-[9px]">{school.status}</Badge>
//                                         </td>
//                                         <td className="px-8 py-6 text-right text-[11px] text-gray-400 font-black uppercase tracking-widest">
//                                             {school.date}
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>

//                 <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 p-8 flex flex-col gap-10 md:sticky md:top-24">
//                     <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
//                         <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 shadow-lg shadow-green-100">
//                             <CheckCircle2 className="w-5 h-5" />
//                         </div>
//                         <h3 className="text-xl font-black text-gray-900">System Health</h3>
//                     </div>

//                     <div className="space-y-10">
//                         <div className="flex flex-col gap-3">
//                             <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1">
//                                 <span className="text-gray-400">API Latency</span>
//                                 <span className="text-brand-blue">124ms</span>
//                             </div>
//                             <div className="w-full bg-gray-50 rounded-full h-2.5 overflow-hidden ring-4 ring-brand-blue/5">
//                                 <div className="bg-brand-blue h-2.5 rounded-full w-[85%] animate-pulse-slow shadow-lg shadow-brand-blue/20"></div>
//                             </div>
//                         </div>
//                         <div className="flex flex-col gap-3">
//                             <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1">
//                                 <span className="text-gray-400">Cloud Storage</span>
//                                 <span className="text-orange-500">62%</span>
//                             </div>
//                             <div className="w-full bg-gray-50 rounded-full h-2.5 overflow-hidden ring-4 ring-orange-500/5">
//                                 <div className="bg-orange-500 h-2.5 rounded-full w-[62%] shadow-lg shadow-orange-500/20"></div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="pt-8 border-t border-gray-50">
//                         <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Platform Logs</h4>
//                         <div className="space-y-8">
//                             <div className="flex gap-4">
//                                 <div className="w-10 h-10 rounded-2xl bg-blue-50/50 flex items-center justify-center shrink-0 border border-blue-100">
//                                     <CheckCircle2 className="w-4 h-4 text-blue-600" />
//                                 </div>
//                                 <div className="flex flex-col gap-0.5">
//                                     <p className="text-sm font-black text-gray-800 leading-tight">Backup done</p>
//                                     <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">15m ago</span>
//                                 </div>
//                             </div>
//                             <div className="flex gap-4">
//                                 <div className="w-10 h-10 rounded-2xl bg-orange-50/50 flex items-center justify-center shrink-0 border border-orange-100">
//                                     <Clock className="w-4 h-4 text-orange-600" />
//                                 </div>
//                                 <div className="flex flex-col gap-0.5">
//                                     <p className="text-sm font-black text-gray-800 leading-tight">Update pending</p>
//                                     <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">1h ago</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AdminDashboard;
