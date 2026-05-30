import React, { useState } from 'react';
import { CheckCircle, XCircle, ChevronRight, Inbox, Clock, ShieldCheck, ShieldAlert, Mail } from 'lucide-react';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';
import { usePagination } from '../../hooks/usePagination';
import axios from 'axios';
import { toast } from 'react-toastify';
import type { User, RequestStatus } from '../../types';

const TeacherRequestsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<RequestStatus>('PENDING');

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
        setFilters,
    } = usePagination<User>({
        url: `${import.meta.env.VITE_API_URL}/teachers`,
        initialLimit: 10,
        initialFilters: { status: 'PENDING' },
    });

    const handleApprove = async (id: string) => {
        if (!window.confirm('Approve this teacher registration?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_URL}/teachers/${id}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Teacher approved and credentials sent.');
            refresh();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to approve');
        }
    };

    const handleReject = async (id: string) => {
        if (!window.confirm('Reject this registration?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_URL}/teachers/${id}/reject`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Registration rejected.');
            refresh();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to reject');
        }
    };

    const columns = [
        {
            header: 'Teacher Details',
            accessor: (t: any) => (
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 py-2">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-brand-blue/10 flex flex-col items-center justify-center border border-brand-blue/20 text-brand-blue font-bold text-lg shrink-0">
                        {t.name?.charAt(0) || 'T'}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-black text-gray-900 text-sm sm:text-base truncate">{t.name}</span>
                        <span className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1 mt-0.5 truncate">
                            <Mail className="w-3 h-3 shrink-0" /> {t.email}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: 'Date Submitted',
            accessor: (t: any) => (
                <div className="flex items-center gap-1 sm:gap-2 text-gray-500 font-bold text-[10px] sm:text-xs uppercase">
                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    {new Date(t.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
            )
        },
        {
            header: 'Status',
            accessor: (t: any) => (
                <Badge variant={t.status === 'PENDING' ? 'warning' : t.status === 'APPROVED' ? 'success' : 'error'}>
                    {t.status || 'APPROVED'}
                </Badge>
            )
        },
        {
            header: 'Actions',
            accessor: (t: any) => (
                <div className="flex items-center gap-2 justify-end">
                    {t.status === 'PENDING' && (
                        <>
                            <button
                                onClick={() => handleApprove(t.id)}
                                className="p-2 sm:p-2.5 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-all"
                                title="Approve"
                            >
                                <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleReject(t.id)}
                                className="p-2 sm:p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                                title="Reject"
                            >
                                <XCircle className="w-4 h-4" />
                            </button>
                        </>
                    )}
                </div>
            ),
            className: "text-right"
        }
    ];

    const tabs: { label: string; value: RequestStatus; icon: any; color: string }[] = [
        { label: 'Pending', value: 'PENDING', icon: Inbox, color: 'text-amber-500' },
        { label: 'Approved', value: 'APPROVED', icon: ShieldCheck, color: 'text-green-500' },
        { label: 'Rejected', value: 'REJECTED', icon: ShieldAlert, color: 'text-red-500' },
    ];

    return (
        <div className="space-y-6 sm:space-y-8 lg:space-y-10 px-3 sm:px-4 md:px-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6">
                <div className="space-y-2">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 uppercase italic">Teacher Approvals</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[9px] sm:text-[10px] flex items-center gap-2">
                        Onboarding <ChevronRight className="w-3 h-3" /> <span className="text-brand-blue">Self-Registered Teachers</span>
                    </p>
                </div>

                <div className="flex overflow-x-auto scrollbar-hide bg-gray-100/50 p-1.5 rounded-2xl border border-gray-100">
                    {tabs.map(tab => (
                        <button
                            key={tab.value}
                            onClick={() => {
                                setActiveTab(tab.value);
                                setPage(1);
                                setFilters({ status: tab.value });
                            }}
                            className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-[10px] sm:text-xs font-black uppercase whitespace-nowrap transition-all ${activeTab === tab.value
                                ? 'bg-white text-gray-900 shadow-lg'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <tab.icon className={`w-4 h-4 ${activeTab === tab.value ? tab.color : ''}`} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
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
                </div>
            </div>
        </div>
    );
};

export default TeacherRequestsPage;
