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
import type { Subscription, School as SchoolType } from '../../types';

const SubscriptionsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'school' | 'teacher'>('school');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSub, setEditingSub] = useState<Subscription | null>(null);
    const [schools, setSchools] = useState<SchoolType[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);

    const [plans, setPlans] = useState<any[]>([]);

    React.useEffect(() => {
        const loadPlans = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/plans`);
                setPlans(res.data.data);
            } catch (err) { console.error(err); }
        };
        loadPlans();
    }, []);

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
    } = usePagination<Subscription>({
        url: `${import.meta.env.VITE_API_URL}/subscriptions`,
        initialLimit: 10,
        initialFilters: { type: 'school' }
    });

    React.useEffect(() => {
        fetchSchools();
        fetchTeachers();
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

    const fetchTeachers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/users?role=TEACHER&limit=100`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTeachers(res.data.data);
        } catch (err) { console.error(err); }
    };

    const handleTabChange = (tab: 'school' | 'teacher') => {
        setActiveTab(tab);
        setFilters({ type: tab });
        setPage(1);
    };

    const formik = useFormik({
        initialValues: {
            schoolId: '',
            userId: '',
            type: activeTab as 'school' | 'teacher',
            planName: 'Basic',
            price: 499,
            currency: 'INR',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: true,
            modulePermissions: {
                paperModule: true,
                teacherModule: true,
                questionModule: true,
                aiModule: false,
            }
        },
        validationSchema: Yup.object({
            planName: Yup.string().required('Plan is required'),
            startDate: Yup.date().required('Required'),
            endDate: Yup.date().required('Required'),
        }),
        onSubmit: async (values) => {
            try {
                const token = localStorage.getItem('token');
                
                // Convert empty strings to null for UUID columns
                const finalPayload = {
                    ...values,
                    schoolId: values.schoolId || null,
                    userId: values.userId || null,
                };

                if (editingSub) {
                    await axios.patch(`${import.meta.env.VITE_API_URL}/subscriptions/${editingSub.id}`, finalPayload, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.success('Subscription updated');
                } else {
                    await axios.post(`${import.meta.env.VITE_API_URL}/subscriptions`, finalPayload, {
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
            schoolId: sub.schoolId || '',
            userId: sub.userId || '',
            type: sub.type as 'school' | 'teacher',
            planName: sub.planName,
            price: sub.price || 0,
            currency: sub.currency || 'INR',
            startDate: new Date(sub.startDate).toISOString().split('T')[0],
            endDate: new Date(sub.endDate).toISOString().split('T')[0],
            status: sub.status,
            modulePermissions: sub.modulePermissions || { paperModule: true, teacherModule: true, questionModule: true, aiModule: false },
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
            header: activeTab === 'school' ? 'Institution / School' : 'Individual Teacher',
            accessor: (s: Subscription) => (
                <div className="flex items-center gap-3 py-2">
                    <div className="w-10 h-10 rounded-xl bg-brand-blue/5 flex items-center justify-center text-brand-blue font-black text-xs border border-brand-blue/10">
                        {(activeTab === 'school' ? s.school?.name : s.user?.name)?.charAt(0) || (activeTab === 'school' ? 'S' : 'T')}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-gray-900 text-sm tracking-tight">
                            {activeTab === 'school' 
                                ? (s.school?.name || 'Universal - All Institutions') 
                                : (s.user?.name || 'Universal - All Independent Teachers')}
                        </span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">
                            {activeTab === 'school' 
                                ? (s.schoolId ? `INST ID: ${s.schoolId.slice(0, 8)}` : 'Type: Global Enrollment')
                                : (s.userId ? `USER ID: ${s.userId.slice(0, 8)}` : 'Type: Global Professional')}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: 'Enrolled Plan',
            accessor: (s: Subscription) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-brand-blue/40" />
                        <span className="font-bold text-gray-700">{s.planName}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Amount Paid',
            accessor: (s: Subscription) => (
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.currency || 'INR'}</span>
                    <span className="font-extrabold text-gray-900 tracking-tight">{Number(s.price || 0).toLocaleString()}</span>
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
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-3 rounded-2xl border border-gray-100 gap-4">
                <div className="flex gap-2 overflow-x-auto no-scrollbar p-1">
                    {[
                        { label: 'School Licenses', value: 'school' },
                        { label: 'Teacher Licenses', value: 'teacher' },
                    ].map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => handleTabChange(tab.value as any)}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                activeTab === tab.value ? "bg-brand-blue text-white shadow-xl shadow-brand-blue/30" : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => { 
                            setEditingSub(null); 
                            formik.resetForm(); 
                            formik.setFieldValue('type', activeTab);
                            setIsModalOpen(true); 
                        }}
                        className="flex items-center gap-3 px-8 py-3 bg-brand-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-blue/30 hover:bg-blue-800 transition-all"
                    >
                        <Plus className="w-4 h-4 stroke-[3px]" /> Create {activeTab === 'school' ? 'School' : 'Teacher'} License
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
                title={editingSub ? 'Modify Subscription License' : 'Issue New License'}
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
                        <div className="md:col-span-2 space-y-2">
                             <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Subscription Type</label>
                             <div className="flex gap-3">
                                 {['school', 'teacher'].map((t) => (
                                     <button
                                         key={t}
                                         type="button"
                                         onClick={() => {
                                             formik.setFieldValue('type', t);
                                             formik.setFieldValue('schoolId', '');
                                             formik.setFieldValue('userId', '');
                                         }}
                                         className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                             formik.values.type === t ? 'bg-brand-blue/5 border-brand-blue text-brand-blue' : 'bg-gray-50 border-transparent text-gray-400'
                                         }`}
                                     >
                                         {t === 'school' ? 'School / Institution' : 'Individual Teacher'}
                                     </button>
                                 ))}
                             </div>
                        </div>

                        {formik.values.type === 'school' ? (
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Target Institution</label>
                                <select
                                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:bg-white focus:border-brand-blue/20 transition-all"
                                    {...formik.getFieldProps('schoolId')}
                                >
                                    <option value="">Universal (All Institutions)</option>
                                    {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                        ) : (
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Target Teacher</label>
                                <select
                                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:bg-white focus:border-brand-blue/20 transition-all"
                                    {...formik.getFieldProps('userId')}
                                >
                                    <option value="">Universal (All Independent Teachers)</option>
                                    {teachers.map(t => <option key={t.id} value={t.id}>{t.name} ({t.email})</option>)}
                                </select>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">License Plan</label>
                            <select
                                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:bg-white focus:border-brand-blue/20 transition-all font-mono"
                                {...formik.getFieldProps('planName')}
                                    onChange={(e) => {
                                        formik.setFieldValue('planName', e.target.value);
                                        const selected = plans.find(p => p.name === e.target.value);
                                        if (selected) formik.setFieldValue('price', selected.price);
                                    }}
                                >
                                    {plans.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                                </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Final Amount</label>
                            <div className="flex gap-2">
                                <select
                                    className="w-24 px-4 py-4 bg-gray-50 border border-transparent rounded-2xl text-xs font-black focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:bg-white focus:border-brand-blue/20 transition-all uppercase"
                                    {...formik.getFieldProps('currency')}
                                >
                                    <option value="INR">INR</option>
                                    <option value="USD">USD</option>
                                </select>
                                <input
                                    type="number"
                                    className="flex-1 px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:bg-white focus:border-brand-blue/20 transition-all"
                                    {...formik.getFieldProps('price')}
                                />
                            </div>
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
                        <div className="space-y-4 md:col-span-2 mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <label className="text-sm font-black text-gray-900 uppercase tracking-widest">Module Permissions</label>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {['paperModule', 'teacherModule', 'questionModule', 'aiModule'].map(mod => (
                                     <label key={mod} className="flex items-center gap-3 cursor-pointer">
                                          <input
                                               type="checkbox"
                                               className="w-5 h-5 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                                               checked={formik.values.modulePermissions[mod as keyof typeof formik.values.modulePermissions]}
                                               onChange={(e) => {
                                                   formik.setFieldValue(`modulePermissions.${mod}`, e.target.checked);
                                               }}
                                          />
                                          <span className="text-xs font-bold text-gray-700 uppercase">{mod.replace('Module', '')}</span>
                                     </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default SubscriptionsPage;

