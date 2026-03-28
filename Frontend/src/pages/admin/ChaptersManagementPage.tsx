import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Layout } from 'lucide-react';
import { usePagination } from '../../hooks/usePagination';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';
import StatusToggle from '../../components/StatusToggle';
import Modal from '../../components/Modal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Chapter {
    id: string;
    name: string;
    status: boolean;
    subjectId: string;
    subject?: {
        name: string;
        standard?: {
            name: string;
        }
    };
}

interface Standard { id: string; name: string; }
interface Subject { id: string; name: string; }

const ChaptersManagementPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
    const [standards, setStandards] = useState<Standard[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [modalSubjects, setModalSubjects] = useState<Subject[]>([]);

    const [filterStandard, setFilterStandard] = useState('');
    const [filterSubject, setFilterSubject] = useState('');

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
    } = usePagination<Chapter>({
        url: `http://localhost:3000/chapters?${filterSubject ? `subjectId=${filterSubject}` : ''}`,
        initialLimit: 10,
    });

    useEffect(() => {
        fetchStandards();
    }, []);

    useEffect(() => {
        if (filterStandard) {
            fetchSubjects(filterStandard, setSubjects);
        } else {
            setSubjects([]);
            setFilterSubject('');
        }
    }, [filterStandard]);

    const fetchStandards = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:3000/standards?limit=100', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStandards(res.data.data);
        } catch (err) { console.error(err); }
    };

    const fetchSubjects = async (stdId: string, setter: React.Dispatch<React.SetStateAction<Subject[]>>) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:3000/subjects?limit=100&standardId=${stdId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setter(res.data.data);
        } catch (err) { console.error(err); }
    };

    const formik = useFormik({
        initialValues: {
            standardId: '',
            subjectId: '',
            name: '',
            status: true,
        },
        validationSchema: Yup.object({
            standardId: Yup.string().required('Required'),
            subjectId: Yup.string().required('Required'),
            name: Yup.string().required('Required').min(2, 'Too short'),
            status: Yup.boolean(),
        }),
        onSubmit: async (values) => {
            try {
                const token = localStorage.getItem('token');
                const { standardId, ...payload } = values;
                if (editingChapter) {
                    await axios.patch(`http://localhost:3000/chapters/${editingChapter.id}`, payload, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.success('Chapter updated successfully');
                } else {
                    await axios.post('http://localhost:3000/chapters', payload, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.success('Chapter created successfully');
                }
                setIsModalOpen(false);
                formik.resetForm();
                setEditingChapter(null);
                refresh();
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Failed to save chapter');
            }
        },
    });

    useEffect(() => {
        if (formik.values.standardId) {
            fetchSubjects(formik.values.standardId, setModalSubjects);
        } else {
            setModalSubjects([]);
        }
    }, [formik.values.standardId]);

    const handleEdit = (chapter: Chapter) => {
        setEditingChapter(chapter);
        formik.setValues({
            standardId: (chapter.subject as any)?.standardId || '',
            subjectId: chapter.subjectId,
            name: chapter.name,
            status: chapter.status,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this chapter?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/chapters/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Chapter deleted successfully');
            refresh();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete');
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:3000/chapters/${id}`, { status: !currentStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            refresh();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };

    const columns = [
        {
            header: 'Chapter Name',
            accessor: (c: Chapter) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-blue/5 rounded-xl flex items-center justify-center text-brand-blue">
                        <Layout className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900">{c.name}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Chapter UID: {c.id.slice(0, 8)}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Standard & Subject',
            accessor: (c: any) => (
                <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-700">{c.subject?.standard?.name || 'N/A'}</p>
                    <p className="text-[10px] font-black text-brand-blue uppercase tracking-widest">{c.subject?.name || 'N/A'}</p>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: (c: Chapter) => (
                <div className="flex items-center gap-4">
                    <Badge variant={c.status ? 'success' : 'error'}>
                        {c.status ? 'Active' : 'Inactive'}
                    </Badge>
                    <StatusToggle
                        status={c.status}
                        onChange={() => handleToggleStatus(c.id, c.status)}
                    />
                </div>
            )
        },
        {
            header: 'Actions',
            accessor: (c: Chapter) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleEdit(c)}
                        className="p-2.5 rounded-xl border border-gray-100 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/5 transition-all shadow-sm"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(c.id)}
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
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">Chapters</h1>
                    <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">Curriculum Management</p>
                </div>

                <button
                    onClick={() => { setEditingChapter(null); formik.resetForm(); setIsModalOpen(true); }}
                    className="px-8 py-4 bg-brand-blue text-white rounded-2xl font-black text-sm shadow-xl shadow-brand-blue/20 flex items-center gap-3 active:scale-95 transition-all hover:bg-blue-800"
                >
                    <Plus className="w-5 h-5 stroke-[3px]" />
                    New Chapter
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/20 items-end">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Standard</label>
                    <select
                        value={filterStandard}
                        onChange={(e) => setFilterStandard(e.target.value)}
                        className="w-full px-6 py-4 bg-gray-50 border-0 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-brand-blue/5 transition-all"
                    >
                        <option value="">All Standards</option>
                        {standards.map(std => <option key={std.id} value={std.id}>{std.name}</option>)}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Subject</label>
                    <select
                        value={filterSubject}
                        onChange={(e) => setFilterSubject(e.target.value)}
                        className="w-full px-6 py-4 bg-gray-50 border-0 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-brand-blue/5 transition-all"
                    >
                        <option value="">All Subjects</option>
                        {subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                    </select>
                </div>
                <div className="lg:col-span-2">
                    <button
                        onClick={() => { setFilterStandard(''); setFilterSubject(''); }}
                        className="w-full py-4 bg-gray-100 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all font-bold"
                    >
                        Reset Filters
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
                title={editingChapter ? 'Edit Chapter' : 'Add New Chapter'}
                footer={
                    <>
                        <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-black text-gray-400 hover:bg-gray-50 transition-all">Cancel</button>
                        <button onClick={() => formik.handleSubmit()} className="px-12 py-3 bg-brand-blue text-white rounded-2xl font-black text-sm shadow-xl shadow-brand-blue/20 hover:bg-blue-800 transition-all">
                            {editingChapter ? 'Save Changes' : 'Create Chapter'}
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
                            {standards.map(std => <option key={std.id} value={std.id}>{std.name}</option>)}
                        </select>
                        {formik.touched.standardId && formik.errors.standardId && <p className="text-red-500 text-[10px] font-black mt-1 ml-1">{formik.errors.standardId}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Subject</label>
                        <select
                            className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:bg-white focus:border-brand-blue/20 transition-all"
                            {...formik.getFieldProps('subjectId')}
                        >
                            <option value="">Select Subject</option>
                            {modalSubjects.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                        </select>
                        {formik.touched.subjectId && formik.errors.subjectId && <p className="text-red-500 text-[10px] font-black mt-1 ml-1">{formik.errors.subjectId}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Chapter Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Linear Equations"
                            className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:bg-white focus:border-brand-blue/20 transition-all"
                            {...formik.getFieldProps('name')}
                        />
                        {formik.touched.name && formik.errors.name && <p className="text-red-500 text-[10px] font-black mt-1 ml-1">{formik.errors.name}</p>}
                    </div>

                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem]">
                        <div>
                            <p className="text-sm font-black text-gray-900 uppercase tracking-widest">Active Status</p>
                            <p className="text-xs font-bold text-gray-400 mt-0.5">Visible in question selection</p>
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

export default ChaptersManagementPage;

