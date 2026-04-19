import React, { useState, useEffect } from 'react';
import { Plus, Mail, ShieldCheck, ChevronRight, User as UserIcon, Lock, Trash2, Edit2, BookOpen } from 'lucide-react';
import { usePagination } from '../../hooks/usePagination';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';
import StatusToggle from '../../components/StatusToggle';
import Modal from '../../components/Modal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import type { User } from '../../types';
import { masterDataService, type Subject } from '../../api/masterDataService';

const TeachersPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState<User | null>(null);
    const [subjects, setSubjects] = useState<Subject[]>([]);

    useEffect(() => {
        masterDataService.getSubjects().then(setSubjects).catch(() => {});
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
    } = usePagination<User>({
        url: `${import.meta.env.VITE_API_URL}/teachers`,
        initialLimit: 10,
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            subjectId: '',
            isActive: true,
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required').min(2, 'Too short'),
            email: Yup.string().email('Invalid email').required('Required'),
            password: editingTeacher ? Yup.string() : Yup.string().required('Required').min(6, 'Too short'),
            subjectId: Yup.string().required('Please select a subject'),
            isActive: Yup.boolean(),
        }),
        onSubmit: async (values) => {
            try {
                const token = localStorage.getItem('token');
                if (editingTeacher) {
                    await axios.patch(`${import.meta.env.VITE_API_URL}/teachers/${editingTeacher.id}`, values, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.success('Teacher updated successfully');
                } else {
                    await axios.post(`${import.meta.env.VITE_API_URL}/teachers`, values, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.success('Teacher invited successfully');
                }
                setIsModalOpen(false);
                setEditingTeacher(null);
                formik.resetForm();
                refresh();
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Failed to save teacher');
            }
        },
    });

    const handleEdit = (teacher: User) => {
        setEditingTeacher(teacher);
        formik.setValues({
            name: teacher.name,
            email: teacher.email,
            password: '',
            subjectId: teacher.subjectId || '',
            isActive: teacher.isActive,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to remove this teacher?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${import.meta.env.VITE_API_URL}/teachers/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Teacher removed successfully');
            refresh();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete');
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${import.meta.env.VITE_API_URL}/teachers/${id}`, { isActive: !currentStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            refresh();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };

    const columns = [
        {
            header: 'Teacher Profile',
            accessor: (t: User) => (
                <div className="flex items-center gap-4 py-1">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                        {t.name.charAt(0)}
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[15px] font-black text-gray-900 leading-tight">{t.name}</span>
                        <div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest pl-0.5">
                            ID: Staff-{t.id.slice(0, 4)}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Contact Info',
            accessor: (t: User) => (
                <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                    <Mail className="w-4 h-4 text-gray-300" />
                    {t.email}
                </div>
            )
        },
        {
            header: 'Status',
            accessor: (t: User) => (
                <div className="flex items-center gap-4">
                    <Badge variant={t.isActive ? 'success' : 'error'}>
                        {t.isActive ? 'Active Duty' : 'Inactive'}
                    </Badge>
                    <StatusToggle
                        status={t.isActive}
                        onChange={() => handleToggleStatus(t.id, t.isActive)}
                    />
                </div>
            )
        },
        {
            header: 'Actions',
            accessor: (t: User) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleEdit(t)}
                        className="p-2.5 rounded-xl border border-gray-100 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/5 transition-all shadow-sm"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(t.id)}
                        className="p-2.5 rounded-xl border border-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">Teachers Faculty</h1>
                    <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
                        School Administration <ChevronRight className="w-3 h-3" /> <span className="text-brand-blue">Manage Educators</span>
                    </p>
                </div>

                <button
                    onClick={() => { setEditingTeacher(null); formik.resetForm(); setIsModalOpen(true); }}
                    className="px-10 py-4 bg-brand-blue text-white rounded-2xl font-black text-sm shadow-xl shadow-brand-blue/30 flex items-center gap-3 active:scale-95 transition-all hover:bg-blue-800"
                >
                    <Plus className="w-5 h-5 stroke-[3px]" />
                    Invite Teacher
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
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

                <div className="space-y-8">
                    <div className="bg-brand-blue rounded-[2.5rem] p-10 text-white shadow-2xl shadow-brand-blue/30 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="w-32 h-32" />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <h3 className="text-2xl font-black leading-tight">Faculty Analytics</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-bold opacity-60 uppercase tracking-widest">Total Staff</p>
                                    <p className="text-3xl font-black mt-1">{pagination?.totalRecords || 0}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold opacity-60 uppercase tracking-widest">Active</p>
                                    <p className="text-3xl font-black mt-1 text-green-300">{data.filter(t => t.isActive).length}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm text-center space-y-4">
                        <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-3xl flex items-center justify-center mx-auto">
                            <UserIcon className="w-10 h-10" />
                        </div>
                        <div>
                            <p className="text-xl font-black text-gray-900">Institution Portal</p>
                            <p className="text-sm font-bold text-gray-400 mt-1">Manage all your teaching staff and their permissions.</p>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingTeacher ? 'Update Teacher' : 'Invite New Teacher'}
                footer={
                    <>
                        <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-black text-gray-400 hover:bg-gray-50 transition-all">Cancel</button>
                        <button onClick={() => formik.handleSubmit()} className="px-12 py-3 bg-brand-blue text-white rounded-2xl font-black text-sm shadow-xl shadow-brand-blue/20 hover:bg-blue-800 transition-all">
                            {editingTeacher ? 'Save Changes' : 'Invite Teacher'}
                        </button>
                    </>
                }
            >
                <form className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative group">
                            <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-brand-blue transition-colors" />
                            <input
                                type="text"
                                placeholder="e.g. Smitaben Patel"
                                className="w-full pl-16 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:bg-white focus:border-brand-blue/20 transition-all"
                                {...formik.getFieldProps('name')}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-brand-blue transition-colors" />
                            <input
                                type="email"
                                placeholder="teacher@school.com"
                                className="w-full pl-16 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:bg-white focus:border-brand-blue/20 transition-all"
                                {...formik.getFieldProps('email')}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">{editingTeacher ? 'New Password (Optional)' : 'Initial Password'}</label>
                        <div className="relative group">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-brand-blue transition-colors" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full pl-16 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:bg-white focus:border-brand-blue/20 transition-all"
                                {...formik.getFieldProps('password')}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Assigned Subject</label>
                        <div className="relative group">
                            <BookOpen className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-brand-blue transition-colors" />
                            <select
                                className="w-full pl-16 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold appearance-none focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:bg-white focus:border-brand-blue/20 transition-all"
                                {...formik.getFieldProps('subjectId')}
                            >
                                <option value="" disabled>Select a Subject</option>
                                {subjects.map(s => {
                                    const isAssigned = data.some(t => t.subjectId === s.id && t.id !== editingTeacher?.id);
                                    return (
                                        <option key={s.id} value={s.id} disabled={isAssigned}>
                                            {s.name} {s.standard?.name ? `(${s.standard.name})` : ''} {isAssigned ? '- Already Assigned' : ''}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        {formik.touched.subjectId && formik.errors.subjectId && (
                             <p className="text-red-500 text-xs mt-1 ml-2 font-bold">{formik.errors.subjectId}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem]">
                        <div>
                            <p className="text-sm font-black text-gray-900 uppercase tracking-widest">Active Status</p>
                            <p className="text-xs font-bold text-gray-400 mt-0.5">Allow login and paper generation</p>
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

export default TeachersPage;

