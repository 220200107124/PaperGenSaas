import React, { useState, useEffect } from 'react';
import { Users, School, ShieldCheck, Mail, Edit3, Trash2, ChevronRight, UserPlus, Lock } from 'lucide-react';
import { clsx } from 'clsx';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';
import StatusToggle from '../../components/StatusToggle';
import Modal from '../../components/Modal';
import { usePagination } from '../../hooks/usePagination';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import type { User, School as SchoolType } from '../../types';
import { UserRole } from '../../types';

const UsersPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [schools, setSchools] = useState<SchoolType[]>([]);
    const [roleFilter, setRoleFilter] = useState('');

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
    } = usePagination<User>({
        url: `${import.meta.env.VITE_API_URL}/users?${roleFilter ? `role=${roleFilter}` : ''}`,
        initialLimit: 10,
    });

    useEffect(() => {
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
            name: '',
            email: '',
            password: '',
            role: UserRole.TEACHER as string,
            schoolId: '',
            isActive: true,
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required').min(2, 'Too short'),
            email: Yup.string().email('Invalid email').required('Required'),
            password: editingUser ? Yup.string() : Yup.string().required('Required').min(6, 'Too short'),
            role: Yup.string().required('Required'),
            isActive: Yup.boolean(),
        }),
        onSubmit: async (values) => {
            try {
                const token = localStorage.getItem('token');
                const payload = { ...values };
                if (!payload.schoolId) delete (payload as any).schoolId;
                if (!payload.password) delete (payload as any).password;

                if (editingUser) {
                    await axios.patch(`${import.meta.env.VITE_API_URL}/users/${editingUser.id}`, payload, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.success('User updated successfully');
                } else {
                    await axios.post(`${import.meta.env.VITE_API_URL}/users`, payload, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.success('User created successfully');
                }
                setIsModalOpen(false);
                setEditingUser(null);
                formik.resetForm();
                refresh();
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Failed to save user');
            }
        },
    });

    const handleEdit = (user: User) => {
        setEditingUser(user);
        formik.setValues({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role,
            schoolId: user.schoolId || '',
            isActive: user.isActive,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to remove this user?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${import.meta.env.VITE_API_URL}/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('User deleted successfully');
            refresh();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete user');
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${import.meta.env.VITE_API_URL}/users/${id}`, { isActive: !currentStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            refresh();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };

    const columns = [
        {
            header: 'User Profile',
            accessor: (u: User) => (
                <div className="flex items-center gap-4 py-1">
                    <div className="w-11 h-11 rounded-2xl bg-brand-blue/10 text-brand-blue border border-brand-blue/20 flex items-center justify-center font-black text-sm shrink-0">
                        {u.name.charAt(0)}
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[15px] font-black text-gray-900 leading-tight group-hover:text-brand-blue transition-colors">{u.name}</span>
                        <div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest pl-0.5">
                            UID: {u.id.slice(0, 8)}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Authentication',
            accessor: (u: User) => (
                <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                    <Mail className="w-4 h-4 text-gray-300" />
                    {u.email}
                </div>
            )
        },
        {
            header: 'Role / Institution',
            accessor: (u: User) => (
                <div className="space-y-1.5">
                    <Badge variant={u.role === UserRole.SUPER_ADMIN ? 'info' : u.role === UserRole.SCHOOL_ADMIN ? 'warning' : 'outline'}>
                        {u.role.replace('_', ' ')}
                    </Badge>
                    {u.schoolId && (
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase tracking-wider">
                            <School className="w-3 h-3 text-brand-blue" />
                            PID: {String(u.schoolId).slice(0, 8)}
                        </div>
                    )}
                </div>
            )
        },
        {
            header: 'Status',
            accessor: (u: User) => (
                <div className="flex items-center gap-4">
                    <Badge variant={u.isActive ? 'success' : 'error'}>
                        {u.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <StatusToggle
                        status={u.isActive}
                        onChange={() => handleToggleStatus(u.id, u.isActive)}
                    />
                </div>
            )
        },
        {
            header: 'Actions',
            accessor: (u: User) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleEdit(u)}
                        className="p-2.5 rounded-xl border border-gray-100 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/5 transition-all shadow-sm"
                    >
                        <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(u.id)}
                        className="p-2.5 rounded-xl border border-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    const stats = [
        { label: 'Total Users', value: pagination?.totalRecords || 0, icon: Users, color: 'blue' },
        { label: 'Institutions', value: schools.length, icon: School, color: 'orange' },
        { label: 'Active Sessions', value: data.filter(u => u.isActive).length, icon: ShieldCheck, color: 'green' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2 md:px-0">
                <div className="space-y-2 text-center md:text-left">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight uppercase">User Directory</h1>
                    <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center md:justify-start gap-2">
                        Security & Access <ChevronRight className="w-3 h-3" /> <span className="text-brand-blue">Master Identity Management</span>
                    </p>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <button
                        onClick={() => { setEditingUser(null); formik.resetForm(); setIsModalOpen(true); }}
                        className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-4 bg-brand-blue text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-blue/30 hover:bg-blue-800 transition-all active:scale-95"
                    >
                        <UserPlus className="w-5 h-5 stroke-[3px]" />
                        Create Manual ID
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="flex items-center gap-5 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/5 transition-all hover:shadow-2xl hover:-translate-y-1 group">
                        <div className={clsx(
                            "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform",
                            stat.color === 'blue' ? "bg-blue-50 text-blue-600 shadow-blue-100" :
                                stat.color === 'orange' ? "bg-orange-50 text-orange-600 shadow-orange-100" :
                                    "bg-green-50 text-green-600 shadow-green-100"
                        )}>
                            <stat.icon className="w-7 h-7" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">{stat.label}</span>
                            <span className="text-3xl font-black text-gray-900">{stat.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between bg-white p-3 rounded-2xl border border-gray-100 gap-4">
                <div className="flex gap-2 overflow-x-auto no-scrollbar p-1">
                    {[
                        { label: 'All Identities', value: '' },
                        { label: 'Admins', value: UserRole.SCHOOL_ADMIN },
                        { label: 'Teachers', value: UserRole.TEACHER },
                        { label: 'Special Ops', value: UserRole.SUPER_ADMIN },
                    ].map((tab) => (
                        <button
                            key={tab.label}
                            onClick={() => setRoleFilter(tab.value)}
                            className={clsx(
                                "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                                roleFilter === tab.value ? "bg-brand-blue text-white shadow-xl shadow-brand-blue/30" : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

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

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingUser ? 'Modify User Profile' : 'Initialize New Identity'}
                footer={
                    <>
                        <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-black text-gray-400 hover:bg-gray-50 transition-all">Cancel</button>
                        <button onClick={() => formik.handleSubmit()} className="px-12 py-3 bg-brand-blue text-white rounded-2xl font-black text-sm shadow-xl shadow-brand-blue/20 hover:bg-blue-800 transition-all">
                            {editingUser ? 'Save Updates' : 'Grant Access'}
                        </button>
                    </>
                }
            >
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Full Name</label>
                            <input
                                type="text"
                                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:bg-white focus:border-brand-blue/20 transition-all"
                                {...formik.getFieldProps('name')}
                            />
                            {formik.touched.name && formik.errors.name && <p className="text-red-500 text-[10px] font-black mt-1 ml-1">{formik.errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Email ID</label>
                            <input
                                type="email"
                                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:bg-white focus:border-brand-blue/20 transition-all"
                                {...formik.getFieldProps('email')}
                            />
                            {formik.touched.email && formik.errors.email && <p className="text-red-500 text-[10px] font-black mt-1 ml-1">{formik.errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Identity Role</label>
                            <select
                                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:bg-white focus:border-brand-blue/20 transition-all"
                                {...formik.getFieldProps('role')}
                            >
                                <option value={UserRole.TEACHER}>Teacher</option>
                                <option value={UserRole.SCHOOL_ADMIN}>School Administrator</option>
                                <option value={UserRole.SUPER_ADMIN}>Platform Architect (Super)</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Associated School</label>
                            <select
                                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:bg-white focus:border-brand-blue/20 transition-all"
                                {...formik.getFieldProps('schoolId')}
                            >
                                <option value="">Global / Independent</option>
                                {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">{editingUser ? 'New Password (Blank to keep)' : 'Secure Password'}</label>
                            <div className="relative">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                <input
                                    type="password"
                                    className="w-full pl-16 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:bg-white focus:border-brand-blue/20 transition-all"
                                    {...formik.getFieldProps('password')}
                                />
                            </div>
                            {formik.touched.password && formik.errors.password && <p className="text-red-500 text-[10px] font-black mt-1 ml-1">{formik.errors.password}</p>}
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem]">
                        <div>
                            <p className="text-sm font-black text-gray-900 uppercase tracking-widest">Active Status</p>
                            <p className="text-xs font-bold text-gray-400 mt-0.5">Allow login and platform interaction</p>
                        </div>
                        <StatusToggle
                            status={formik.values.isActive}
                            onChange={(val) => formik.setFieldValue('isActive', val)}
                        />
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default UsersPage;

