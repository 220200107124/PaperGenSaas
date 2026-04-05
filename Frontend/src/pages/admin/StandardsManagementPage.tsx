import React, { useState } from 'react';
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
import type { Standard } from '../../types';

const StandardsManagementPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStandard, setEditingStandard] = useState<Standard | null>(null);

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
    } = usePagination<Standard>({
        url: `${import.meta.env.VITE_API_URL}/standards`,
        initialLimit: 10,
    });

    const formik = useFormik({
        initialValues: {
            name: editingStandard?.name || '',
            status: editingStandard?.status ?? true,
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
        }),
        onSubmit: async (values) => {
            try {
                const token = localStorage.getItem('token');
                if (editingStandard) {
                    await axios.patch(`${import.meta.env.VITE_API_URL}/standards/${editingStandard.id}`, values, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.success('Standard updated successfully');
                } else {
                    await axios.post(`${import.meta.env.VITE_API_URL}/standards`, values, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.success('Standard created successfully');
                }
                setIsModalOpen(false);
                setEditingStandard(null);
                refresh();
            } catch (err: any) {
                toast.error(err.response?.data?.message || 'Something went wrong');
            }
        },
    });

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${import.meta.env.VITE_API_URL}/standards/${id}/status`,
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
        if (!window.confirm('Are you sure you want to delete this standard?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${import.meta.env.VITE_API_URL}/standards/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Standard deleted');
            refresh();
        } catch (err: any) {
            toast.error('Failed to delete standard');
        }
    };

    const columns = [
        { header: 'Standard Name', accessor: 'name' as const, className: 'font-black text-gray-900' },
        {
            header: 'Status',
            accessor: (item: Standard) => (
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
            header: 'Created At',
            accessor: (item: Standard) => new Date(item.createdAt).toLocaleDateString(),
            className: 'text-gray-400 font-medium'
        },
        {
            header: 'Actions',
            accessor: (item: Standard) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => { setEditingStandard(item); setIsModalOpen(true); }}
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
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Standards Management</h1>
                    <p className="text-gray-400 font-black text-xs uppercase tracking-[0.2em]">Create and edit standards (Std 1 - 8)</p>
                </div>
                <button
                    onClick={() => { setEditingStandard(null); setIsModalOpen(true); }}
                    className="flex items-center gap-2 px-8 py-4 bg-brand-blue text-white rounded-2xl font-black text-sm hover:bg-brand-blue-dark transition-all shadow-xl shadow-brand-blue/20 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Add Standard
                </button>
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
                title={editingStandard ? 'Edit Standard' : 'Add New Standard'}
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
                            {editingStandard ? 'Save Changes' : 'Create Standard'}
                        </button>
                    </>
                }
            >
                <form className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Standard Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Std 1"
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

export default StandardsManagementPage;

