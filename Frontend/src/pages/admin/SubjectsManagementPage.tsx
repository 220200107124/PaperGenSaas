import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { usePagination } from '../../hooks/usePagination';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';
import StatusToggle from '../../components/StatusToggle';
import Modal from '../../components/Modal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import type { Subject, Standard } from '../../types';

const SubjectsManagementPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
    const [standards, setStandards] = useState<Standard[]>([]);
    const [selectedStandard, setSelectedStandard] = useState<string>('');

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
        setData,
    } = usePagination<Subject>({
        url: `${import.meta.env.VITE_API_URL}/subjects${selectedStandard ? `?standardId=${selectedStandard}` : ''}`,
        initialLimit: 10,
    });

    useEffect(() => {
        const fetchStandards = async () => {
            try {
                const token = localStorage.getItem('token');
                // Fetch active standards for dropdown - using a large limit to get all
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/standards?limit=100`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStandards(response.data.data);
            } catch (err) {
                console.error('Failed to fetch standards');
            }
        };
        fetchStandards();
    }, []);

    const formik = useFormik({
        initialValues: {
            name: editingSubject?.name || '',
            standardId: editingSubject?.standardId || '',
            status: editingSubject?.status ?? true,
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
            standardId: Yup.string().required('Required'),
        }),
        onSubmit: async (values) => {
            try {
                const token = localStorage.getItem('token');
                if (editingSubject) {
                    await axios.patch(`${import.meta.env.VITE_API_URL}/subjects/${editingSubject.id}`, values, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.success('Subject updated successfully');
                } else {
                    await axios.post(`${import.meta.env.VITE_API_URL}/subjects`, values, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.success('Subject created successfully');
                }
                setIsModalOpen(false);
                setEditingSubject(null);
                refresh();
            } catch (err: any) {
                toast.error(err.response?.data?.message || 'Something went wrong');
            }
        },
    });

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${import.meta.env.VITE_API_URL}/subjects/${id}/status`,
                { status: !currentStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Status updated');
            setData(prev => prev.map(s => s.id === id ? { ...s, status: !currentStatus } : s));
        } catch (err: any) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this subject?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${import.meta.env.VITE_API_URL}/subjects/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Subject deleted');
            refresh();
        } catch (err: any) {
            toast.error('Failed to delete subject');
        }
    };

    const columns = [
        { header: 'Subject Name', accessor: 'name' as const, className: 'font-black text-gray-900' },
        { header: 'Standard', accessor: (item: Subject) => item.standard?.name, className: 'font-bold text-gray-600' },
        {
            header: 'Status',
            accessor: (item: Subject) => (
                <div className="flex items-center gap-3">
                    <StatusToggle
                        status={item.status}
                        onChange={() => handleToggleStatus(item.id, item.status)}
                    />
                    <Badge variant={item.status ? 'success' : 'error'}>
                        {item.status ? 'Active' : 'Inactive'}
                    </Badge>
                </div>
            )
        },
        {
            header: 'Actions',
            accessor: (item: Subject) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => { setEditingSubject(item); setIsModalOpen(true); }}
                        className="p-2 hover:bg-brand-blue/5 text-gray-400 hover:text-brand-blue rounded-xl transition-all"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Subjects Management</h1>
                    <p className="text-gray-400 font-black text-xs uppercase tracking-[0.2em]">Add subjects linked to standards</p>
                </div>
                <div className="flex items-center gap-4">
                    <select
                        value={selectedStandard}
                        onChange={(e) => setSelectedStandard(e.target.value)}
                        className="px-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-600 focus:outline-none focus:ring-4 focus:ring-brand-blue/5 shadow-sm transition-all"
                    >
                        <option value="">All Standards</option>
                        {standards.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                    <button
                        onClick={() => { setEditingSubject(null); setIsModalOpen(true); }}
                        className="flex items-center gap-2 px-8 py-4 bg-brand-blue text-white rounded-2xl font-black text-sm hover:bg-brand-blue-dark transition-all shadow-xl shadow-brand-blue/20 active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        Add Subject
                    </button>
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
                title={editingSubject ? 'Edit Subject' : 'Add New Subject'}
                footer={
                    <>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-400 hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => formik.handleSubmit()}
                            className="px-8 py-3 bg-brand-blue text-white rounded-2xl text-sm font-black hover:bg-brand-blue-dark transition-all shadow-lg shadow-brand-blue/20"
                        >
                            {editingSubject ? 'Save Changes' : 'Create Subject'}
                        </button>
                    </>
                }
            >
                <form className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Standard</label>
                        <select
                            className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:bg-white focus:border-brand-blue/20 transition-all"
                            {...formik.getFieldProps('standardId')}
                        >
                            <option value="">Select Standard</option>
                            {standards.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                        {formik.touched.standardId && formik.errors.standardId && (
                            <div className="text-red-500 text-xs font-bold mt-1 ml-1">{formik.errors.standardId}</div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Subject Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Mathematics"
                            className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:bg-white focus:border-brand-blue/20 transition-all"
                            {...formik.getFieldProps('name')}
                        />
                        {formik.touched.name && formik.errors.name && (
                            <div className="text-red-500 text-xs font-bold mt-1 ml-1">{formik.errors.name}</div>
                        )}
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default SubjectsManagementPage;

