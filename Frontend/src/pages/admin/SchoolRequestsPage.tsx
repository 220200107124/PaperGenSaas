import React, { useState } from 'react';
import { FileText, CheckCircle, XCircle, ChevronRight, Inbox, Clock, ShieldCheck, ShieldAlert } from 'lucide-react';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';
import { usePagination } from '../../hooks/usePagination';
import axios from 'axios';
import { toast } from 'react-toastify';
import type { SchoolRequest, RequestStatus } from '../../types';

const SchoolRequestsPage: React.FC = () => {
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
    } = usePagination<SchoolRequest>({
        url: `${import.meta.env.VITE_API_URL}/school-requests`,
        initialLimit: 10,
        initialFilters: { status: activeTab },
    });

    const handleApprove = async (id: string) => {
        if (!window.confirm('Approve this school registration?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_URL}/school-requests/${id}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('School request approved and credentials sent.');
            refresh();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to approve');
        }
    };

    const handleReject = async (id: string) => {
        if (!window.confirm('Reject this registration?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_URL}/school-requests/${id}/reject`, {}, {
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
            header: 'Institution Details',
            accessor: (r: SchoolRequest) => (
                <div className="flex items-center gap-4 py-2">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex flex-col items-center justify-center border border-gray-100 group-hover:border-brand-blue/20 transition-all">
                        <FileText className="w-5 h-5 text-gray-400 group-hover:text-brand-blue" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-gray-900 tracking-tight">{r.schoolName}</span>
                        <div className="flex items-center gap-2">
                             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{r.city || 'Unknown City'}</span>
                             {r.contactPerson && <span className="text-[10px] font-bold text-brand-blue uppercase tracking-widest border-l border-gray-100 pl-2">{r.contactPerson}</span>}
                        </div>
                    </div>

                </div>
            )
        },
        {
            header: 'Contact Info',
            accessor: (r: SchoolRequest) => (
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-gray-700">{r.email}</span>
                    <span className="text-[11px] font-medium text-gray-400">{r.phone || 'No phone'}</span>
                </div>
            )
        },
        {
            header: 'Date Submitted',
            accessor: (r: SchoolRequest) => (
                <div className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-tight">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(r.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
            )
        },
        {
            header: 'Status',
            accessor: (r: SchoolRequest) => (
                <Badge variant={r.status === 'PENDING' ? 'warning' : r.status === 'APPROVED' ? 'success' : 'error'}>
                    {r.status}
                </Badge>
            )
        },
        {
            header: 'Actions',
            accessor: (r: SchoolRequest) => (
                <div className="flex items-center gap-2">
                    {r.status === 'PENDING' && (
                        <>
                            <button
                                onClick={() => handleApprove(r.id)}
                                className="p-2.5 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-all shadow-sm"
                                title="Approve"
                            >
                                <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleReject(r.id)}
                                className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all shadow-sm"
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
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase italic">Registration Requests</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
                        Onboarding <ChevronRight className="w-3 h-3" /> <span className="text-brand-blue uppercase">Partner Schools</span>
                    </p>
                </div>

                <div className="flex bg-gray-100/50 p-1.5 rounded-2xl border border-gray-100">
                    {tabs.map(tab => (
                        <button
                            key={tab.value}
                            onClick={() => {
                                setActiveTab(tab.value);
                                refresh(); // This will trigger fetch with new filter
                            }}
                            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.value
                                ? 'bg-white text-gray-900 shadow-lg shadow-gray-200/50'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <tab.icon className={`w-4 h-4 ${activeTab === tab.value ? tab.color : ''}`} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/10 overflow-hidden">
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
    );
};

export default SchoolRequestsPage;

