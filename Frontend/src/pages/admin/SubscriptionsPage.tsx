import React, { useState } from 'react';
import { CreditCard, TrendingUp, Users, Plus, Edit3, Trash2, ChevronRight, Shield } from 'lucide-react';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';
import StatusToggle from '../../components/StatusToggle';
import Modal from '../../components/Modal';
import { usePagination } from '../../hooks/usePagination';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import type { Subscription, SubscriptionPlan, School as SchoolType } from '../../types';

const SubscriptionsPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSub, setEditingSub] = useState<Subscription | null>(null);
    const [schools, setSchools] = useState<SchoolType[]>([]);

    const plans: SubscriptionPlan[] = [
        { id: '1', name: 'Basic', price: 499, interval: 'month', features: ['50 Papers / Month', 'Standard Bank'] },
        { id: '2', name: 'Professional', price: 1499, interval: 'month', features: ['Unlimited Papers', 'Global Bank', 'Priority Support'], isPopular: true },
        { id: '3', name: 'Institution', price: 9999, interval: 'year', features: ['Multi-School', 'API Access', 'Dedicated Manager'] }
    ];

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
    } = usePagination<Subscription>({
        url: `${import.meta.env.VITE_API_URL}/subscriptions`,
        initialLimit: 10,
    });

    React.useEffect(() => {
        fetchSchools();
    }, []);

    const fetchSchools = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/schools?limit=100`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSchools(res.data.data);
        } catch (err) { console.error(err); }
    };

    const formik = useFormik({
        initialValues: {
            schoolId: '',
            planName: 'Basic',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: true,
            modulePermissions: {
                generatePaper: true,
                viewSolutions: true,
                addQuestions: false,
            }
        },
        validationSchema: Yup.object({
            schoolId: Yup.string().required('School is required'),
            planName: Yup.string().required('Plan is required'),
            startDate: Yup.date().required('Required'),
            endDate: Yup.date().required('Required'),
        }),
        onSubmit: async (values) => {
            try {
                const token = localStorage.getItem('token');
                if (editingSub) {
                    await axios.patch(`${import.meta.env.VITE_API_URL}/subscriptions/${editingSub.id}`, values, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.success('Subscription updated');
                } else {
                    await axios.post(`${import.meta.env.VITE_API_URL}/subscriptions`, values, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.success('Subscription created');
                }
                setIsModalOpen(false);
                setEditingSub(null);
                refresh();
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Error occurred');
            }
        },
    });

    const handleEdit = (sub: Subscription) => {
        setEditingSub(sub);
        formik.setValues({
            schoolId: sub.schoolId,
            planName: sub.planName,
            startDate: new Date(sub.startDate).toISOString().split('T')[0],
            endDate: new Date(sub.endDate).toISOString().split('T')[0],
            status: sub.status,
            modulePermissions: sub.modulePermissions || { generatePaper: true, viewSolutions: true },
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this subscription?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${import.meta.env.VITE_API_URL}/subscriptions/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Deleted');
            refresh();
        } catch (err) { toast.error('Failed to delete'); }
    };

    const columns = [
        {
            header: 'School / Institution',
            accessor: (s: Subscription) => (
                <div className="flex items-center gap-3 py-2">
                    <div className="w-10 h-10 rounded-xl bg-brand-blue/5 flex items-center justify-center text-brand-blue font-black text-xs border border-brand-blue/10">
                        {s.school?.name?.charAt(0) || 'S'}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-gray-900 text-sm tracking-tight">{s.school?.name || 'Unknown School'}</span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">ID: {s.schoolId.slice(0, 8)}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Enrolled Plan',
            accessor: (s: Subscription) => (
                <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-brand-blue/40" />
                    <span className="font-bold text-gray-700">{s.planName}</span>
                </div>
            )
        },
        {
            header: 'Period',
            accessor: (s: Subscription) => (
                <div className="flex flex-col gap-1 text-[11px] font-bold">
                    <div className="flex items-center gap-2 text-gray-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                        {new Date(s.startDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-red-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 font-bold"></span>
                        {new Date(s.endDate).toLocaleDateString()}
                    </div>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: (s: Subscription) => (
                <div className="flex items-center gap-4">
                    <Badge variant={s.status ? 'success' : 'error'}>
                        {s.status ? 'ACTIVE' : 'EXPIRED'}
                    </Badge>
                </div>
            )
        },
        {
            header: 'Actions',
            accessor: (s: Subscription) => (
                <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(s)} className="p-2.5 rounded-xl border border-gray-100 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/5 transition-all shadow-sm">
                        <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(s.id)} className="p-2.5 rounded-xl border border-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ),
            className: "text-right"
        }
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Subscriptions</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
                        Revenue Management <ChevronRight className="w-3 h-3" /> <span className="text-brand-blue uppercase">Global Tenant Billing</span>
                    </p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => { setEditingSub(null); formik.resetForm(); setIsModalOpen(true); }}
                        className="flex items-center gap-3 px-10 py-4 bg-brand-blue text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-blue/30 hover:bg-blue-800 transition-all active:scale-95"
                    >
                        <Plus className="w-5 h-5 stroke-[3px]" /> New Subscription
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'Active Subscribers', value: pagination?.totalRecords || 0, icon: Users, color: 'text-brand-blue', bg: 'bg-brand-blue/10' },
                    { label: 'Platform Capacity', value: '88%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Network Health', value: 'OPTIMAL', icon: Shield, color: 'text-amber-600', bg: 'bg-amber-50' }
                ].map((stat, i) => (
                    <div key={i} className="p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/10 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                            <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                        </div>
                        <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center`}>
                            <stat.icon className={`w-7 h-7 ${stat.color}`} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-6">
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

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingSub ? 'Update School License' : 'Issue New License'}
                footer={
                    <>
                        <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-black text-gray-400 hover:bg-gray-50 transition-all">Cancel</button>
                        <button onClick={() => formik.handleSubmit()} className="px-12 py-3 bg-brand-blue text-white rounded-2xl font-black text-sm shadow-xl shadow-brand-blue/20 hover:bg-blue-800 transition-all font-bold">
                            {editingSub ? 'Sync Changes' : 'Activate License'}
                        </button>
                    </>
                }
            >
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Target Institution</label>
                            <select
                                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:bg-white focus:border-brand-blue/20 transition-all"
                                {...formik.getFieldProps('schoolId')}
                            >
                                <option value="">Select School</option>
                                {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                            {formik.touched.schoolId && formik.errors.schoolId && <p className="text-red-500 text-[10px] font-black mt-1 ml-1">{formik.errors.schoolId}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">License Plan</label>
                            <select
                                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:bg-white focus:border-brand-blue/20 transition-all"
                                {...formik.getFieldProps('planName')}
                            >
                                {plans.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Activation Status</label>
                            <div className="h-[60px] flex items-center px-6 bg-gray-50 rounded-2xl">
                                <StatusToggle
                                    status={formik.values.status}
                                    onChange={(v) => formik.setFieldValue('status', v)}
                                />
                                <span className="ml-4 text-xs font-black text-gray-400 uppercase tracking-widest">Active License</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Valid From</label>
                            <input
                                type="date"
                                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold hover:bg-white focus:outline-none transition-all"
                                {...formik.getFieldProps('startDate')}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Expires On</label>
                            <input
                                type="date"
                                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold hover:bg-white focus:outline-none transition-all"
                                {...formik.getFieldProps('endDate')}
                            />
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default SubscriptionsPage;

