import React, { useState } from 'react';
import { Plus, School, Mail, Phone, MapPin, Edit3, Trash2, ChevronRight, LayoutGrid } from 'lucide-react';
import { usePagination } from '../../hooks/usePagination';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';
import StatusToggle from '../../components/StatusToggle';
import Modal from '../../components/Modal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import type { School as SchoolType } from '../../types';

const SchoolsPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSchool, setEditingSchool] = useState<SchoolType | null>(null);

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
    } = usePagination<SchoolType>({
        url: 'http://localhost:3000/schools',
        initialLimit: 10,
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            city: '',
            status: true,
        },
        validationSchema: Yup.object({
            name: Yup.string().required('School name is required').min(3, 'Too short'),
            email: Yup.string().email('Invalid email').required('Email is required'),
            phone: Yup.string().required('Phone number is required'),
            city: Yup.string().required('City is required'),
            status: Yup.boolean(),
        }),
        onSubmit: async (values) => {
            try {
                const token = localStorage.getItem('token');
                if (editingSchool) {
                    await axios.patch(`http://localhost:3000/schools/${editingSchool.id}`, values, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.success('School updated successfully');
                } else {
                    await axios.post('http://localhost:3000/schools', values, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.success('School created successfully');
                }
                setIsModalOpen(false);
                setEditingSchool(null);
                formik.resetForm();
                refresh();
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Failed to save school');
            }
        },
    });

    const handleEdit = (school: SchoolType) => {
        setEditingSchool(school);
        formik.setValues({
            name: school.name,
            email: school.email || '',
            phone: school.phone || '',
            city: school.city || '',
            status: school.status,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this school? This action cannot be undone.')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/schools/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('School deleted successfully');
            refresh();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete school');
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:3000/schools/${id}`, { status: !currentStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            refresh();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };

    const columns = [
        {
            header: 'School Details',
            accessor: (s: SchoolType) => (
                <div className="flex items-center gap-4 py-1">
                    <div className="w-12 h-12 rounded-2xl bg-brand-blue/5 text-brand-blue border border-brand-blue/10 flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                        <School className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[15px] font-black text-gray-900 leading-tight">{s.name}</span>
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest pl-0.5">
                            <MapPin className="w-3 h-3" />
                            {s.city || 'Location N/A'}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Contact Information',
            accessor: (s: SchoolType) => (
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                        <Mail className="w-3.5 h-3.5 text-gray-300" />
                        {s.email || 'No email provided'}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                        <Phone className="w-3.5 h-3.5 text-gray-300" />
                        {s.phone || 'No phone provided'}
                    </div>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: (s: SchoolType) => (
                <div className="flex items-center gap-6">
                    <Badge variant={s.status ? 'success' : 'error'}>
                        {s.status ? 'Active' : 'Deactivated'}
                    </Badge>
                    <StatusToggle
                        status={s.status}
                        onChange={() => handleToggleStatus(s.id, s.status)}
                    />
                </div>
            )
        },
        {
            header: 'Actions',
            accessor: (s: SchoolType) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleEdit(s)}
                        className="p-2.5 rounded-xl border border-gray-100 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/5 transition-all shadow-sm"
                    >
                        <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(s.id)}
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
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2 md:px-0">
                <div className="space-y-2 text-center md:text-left">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight uppercase">Schools Directory</h1>
                    <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center md:justify-start gap-2">
                        Super Admin <ChevronRight className="w-3 h-3" /> <span className="text-brand-blue">Global Tenant Base</span>
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <button
                        onClick={() => { setEditingSchool(null); formik.resetForm(); setIsModalOpen(true); }}
                        className="flex items-center justify-center gap-3 px-10 py-4 bg-brand-blue text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-blue/30 hover:bg-blue-800 transition-all active:scale-95"
                    >
                        <Plus className="w-5 h-5 stroke-[3px]" />
                        Register New School
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-2 md:px-0">
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                        <School className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Schools</p>
                        <p className="text-2xl font-black text-gray-900">{pagination?.totalRecords || 0}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center shrink-0">
                        <LayoutGrid className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Plans</p>
                        <p className="text-2xl font-black text-gray-900">{data.filter(s => s.status).length}</p>
                    </div>
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
                title={editingSchool ? 'Edit School Details' : 'Onboard New School'}
                footer={
                    <>
                        <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-black text-gray-400 hover:bg-gray-50 transition-all">Cancel</button>
                        <button onClick={() => formik.handleSubmit()} className="px-12 py-3 bg-brand-blue text-white rounded-2xl font-black text-sm shadow-xl shadow-brand-blue/20 hover:bg-blue-800 transition-all font-bold">
                            {editingSchool ? 'Save Changes' : 'Complete Registration'}
                        </button>
                    </>
                }
            >
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">School Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Sarvoday Vidyamandir"
                                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:bg-white focus:border-brand-blue/20 transition-all"
                                {...formik.getFieldProps('name')}
                            />
                            {formik.touched.name && formik.errors.name && <p className="text-red-500 text-[10px] font-black mt-1 ml-1">{formik.errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Email Address</label>
                            <input
                                type="email"
                                placeholder="admin@school.com"
                                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:bg-white focus:border-brand-blue/20 transition-all"
                                {...formik.getFieldProps('email')}
                            />
                            {formik.touched.email && formik.errors.email && <p className="text-red-500 text-[10px] font-black mt-1 ml-1">{formik.errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Phone Number</label>
                            <input
                                type="text"
                                placeholder="+91 999 000 0000"
                                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:bg-white focus:border-brand-blue/20 transition-all"
                                {...formik.getFieldProps('phone')}
                            />
                            {formik.touched.phone && formik.errors.phone && <p className="text-red-500 text-[10px] font-black mt-1 ml-1">{formik.errors.phone}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">City</label>
                            <input
                                type="text"
                                placeholder="e.g. Ahmedabad"
                                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:bg-white focus:border-brand-blue/20 transition-all"
                                {...formik.getFieldProps('city')}
                            />
                            {formik.touched.city && formik.errors.city && <p className="text-red-500 text-[10px] font-black mt-1 ml-1">{formik.errors.city}</p>}
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem]">
                        <div>
                            <p className="text-sm font-black text-gray-900 uppercase tracking-widest">Active Status</p>
                            <p className="text-xs font-bold text-gray-400 mt-0.5">Allow platform access for this school</p>
                        </div>
                        <StatusToggle
                            status={formik.values.status}
                            onChange={(val) => formik.setFieldValue('status', val)}
                        />
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default SchoolsPage;

