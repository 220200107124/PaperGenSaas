import React, { useState, useEffect } from 'react';
import { Edit3, Trash2, Plus, ChevronRight } from 'lucide-react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { type Plan, plansService } from '../../api/plansService';

const PlansPage: React.FC = () => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

    const fetchPlans = async () => {
        setLoading(true);
        try {
            const data = await plansService.getPlans();
            setPlans(data);
        } catch (err) {
            toast.error('Failed to fetch plans');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const formik = useFormik({
        initialValues: {
            name: '',
            type: 'both',
            price: 0,
            description: '',
            paperLimit: 0,
            teacherLimit: 0,
            isActive: true,
            modulePermissions: {
                paperModule: true,
                teacherModule: true,
                questionModule: true,
                aiModule: false,
            }
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
            price: Yup.number().required('Required'),
            description: Yup.string().required('Required'),
        }),
        onSubmit: async (values) => {
            try {
                const token = localStorage.getItem('token');
                if (editingPlan) {
                    await axios.patch(`${import.meta.env.VITE_API_URL}/plans/${editingPlan.id}`, values, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.success('Plan updated');
                } else {
                    await axios.post(`${import.meta.env.VITE_API_URL}/plans`, values, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.success('Plan created');
                }
                setIsModalOpen(false);
                setEditingPlan(null);
                fetchPlans();
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Error occurred');
            }
        },
    });

    const handleEdit = (plan: Plan) => {
        setEditingPlan(plan);
        formik.setValues({
            name: plan.name,
            type: plan.type || 'both',
            price: plan.price,
            description: plan.description,
            paperLimit: plan.paperLimit || -1,
            teacherLimit: plan.teacherLimit || -1,
            isActive: true,
            modulePermissions: {
                paperModule: plan.modulePermissions?.paperModule ?? true,
                teacherModule: plan.modulePermissions?.teacherModule ?? true,
                questionModule: plan.modulePermissions?.questionModule ?? true,
                aiModule: plan.modulePermissions?.aiModule ?? false,
            },
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this plan?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${import.meta.env.VITE_API_URL}/plans/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Deleted');
            fetchPlans();
        } catch (err) { toast.error('Failed to delete'); }
    };

    const columns = [
        {
            header: 'Plan Name',
            accessor: (p: Plan) => <span className="font-bold text-gray-900">{p.name}</span>
        },
        {
            header: 'Target',
            accessor: (p: Plan) => <span className="text-xs font-bold text-brand-blue uppercase">{p.type || 'both'}</span>
        },
        {
            header: 'Price',
            accessor: (p: Plan) => <span className="font-extrabold text-gray-900">₹{p.price}</span>
        },
        {
            header: 'Limits',
            accessor: (p: Plan) => (
                <div className="text-xs text-gray-500">
                    Papers: {p.paperLimit === -1 ? 'Unlimited' : p.paperLimit} <br/>
                    Teachers: {p.teacherLimit === -1 ? 'Unlimited' : p.teacherLimit}
                </div>
            )
        },
        {
            header: 'Actions',
            accessor: (p: Plan) => (
                <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(p)} className="p-2 text-gray-400 hover:text-brand-blue transition-all">
                        <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-400 hover:text-red-500 transition-all">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
            <div className="flex justify-between items-end">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Subscription Plans</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
                        System Management <ChevronRight className="w-3 h-3" /> <span className="text-brand-blue">Plans Configuration</span>
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingPlan(null);
                        formik.resetForm();
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-3 px-8 py-3 bg-brand-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-blue/30 hover:bg-blue-800 transition-all"
                >
                    <Plus className="w-4 h-4" /> Create Plan
                </button>
            </div>

            <DataTable
                columns={columns}
                data={plans}
                isLoading={loading}
                onSearch={() => {}}
                onRefresh={fetchPlans}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingPlan ? 'Edit Plan' : 'Create Plan'}
                footer={
                    <>
                        <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-black text-gray-400 hover:bg-gray-50">Cancel</button>
                        <button onClick={() => formik.handleSubmit()} className="px-12 py-3 bg-brand-blue text-white rounded-2xl font-black text-sm shadow-xl shadow-brand-blue/20 hover:bg-blue-800">
                            Save Plan
                        </button>
                    </>
                }
            >
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 uppercase">Plan Name</label>
                            <input className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold" {...formik.getFieldProps('name')} />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 uppercase">Target Audience</label>
                            <select className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold uppercase" {...formik.getFieldProps('type')}>
                                <option value="school">School</option>
                                <option value="teacher">Teacher</option>
                                <option value="both">Both</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 uppercase">Price (INR)</label>
                            <input type="number" className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold" {...formik.getFieldProps('price')} />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-black text-gray-700 uppercase">Description</label>
                            <textarea className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold" {...formik.getFieldProps('description')} rows={2} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 uppercase">Paper Limit (-1 = unlim)</label>
                            <input type="number" className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold" {...formik.getFieldProps('paperLimit')} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 uppercase">Teacher Limit (-1 = unlim)</label>
                            <input type="number" className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold" {...formik.getFieldProps('teacherLimit')} />
                        </div>

                        <div className="space-y-4 md:col-span-2 mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <label className="text-sm font-black text-gray-900 uppercase">Module Permissions</label>
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

export default PlansPage;
