import React, { useState, useEffect } from 'react';
import { Check, Zap, Star, Crown, Shield, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types';
import { paymentService } from '../api/paymentService';
import { plansService, type Plan } from '../api/plansService';
import { toast } from 'react-toastify';

const Pricing: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const data = await plansService.getPlans();
                setPlans(data);
            } catch (err) {
                toast.error('Failed to load subscription plans');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePurchase = async (plan: Plan) => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (plan.price === 0) {
            toast.info('Free plan is active by default for new accounts.');
            return;
        }

        setLoadingPlan(plan.id);
        
        try {
            const res = await loadRazorpay();
            if (!res) {
                toast.error('Razorpay SDK failed to load. Are you online?');
                return;
            }

            // Correct amount to paise for Razorpay
            const order = await paymentService.createOrder(Number(plan.price));
            
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key',
                amount: order.amount,
                currency: order.currency,
                name: 'PaperGen SaaS',
                description: `${plan.name} Subscription`,
                order_id: order.id,
                handler: async (response: any) => {
                    try {
                        await paymentService.verifyPayment({
                            ...response,
                            userId: user.id,
                            schoolId: user.schoolId,
                            planName: plan.name
                        });
                        toast.success('Subscription activated successfully!');
                        window.location.href = user.role === UserRole.SCHOOL_ADMIN ? '/school/dashboard' : '/teacher/dashboard';
                    } catch (err: any) {
                        toast.error(err.response?.data?.message || 'Verification failed');
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: '#2563EB',
                },
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();

        } catch (err: any) {
            console.error('Payment Error:', err);
            toast.error('Could not initiate payment. Please try again.');
        } finally {
            setLoadingPlan(null);
        }
    };

    const handleBackToLogin = () => {
        logout();
        navigate('/login');
    };

    const getPlanIcon = (name: string) => {
        if (name.toUpperCase().includes('FREE')) return Zap;
        if (name.toUpperCase().includes('PRO') || name.toUpperCase().includes('ENTERPRISE')) return Crown;
        return Star;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-bg-gray flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-brand-blue animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-gray py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-brand-blue font-bold tracking-wider uppercase text-sm mb-3">Subscription Plans</h2>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">Elevate your teaching with AI</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Choose the perfect plan to unlock the full potential of AI-powered question paper generation.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {plans.map((plan) => {
                        const Icon = getPlanIcon(plan.name);
                        const isPopular = plan.name.toUpperCase() === 'BASIC';
                        
                        return (
                            <div 
                                key={plan.id}
                                className={`relative bg-white rounded-3xl p-8 shadow-xl border-2 transition-all hover:scale-[1.02] ${isPopular ? 'border-brand-blue ring-4 ring-brand-blue/5' : 'border-transparent'}`}
                            >
                                {isPopular && (
                                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-brand-blue text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-lg">
                                        Most Popular
                                    </div>
                                )}

                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${plan.name.toUpperCase().includes('PRO') ? 'bg-orange-100 text-orange-600' : plan.name.toUpperCase().includes('FREE') ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                                    <Icon className="w-8 h-8" />
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-4xl font-extrabold text-gray-900">₹{Number(plan.price).toLocaleString()}</span>
                                    <span className="text-gray-500 font-medium">/month</span>
                                </div>
                                <p className="text-gray-600 mb-8 leading-relaxed">
                                    {plan.description}
                                </p>

                                <ul className="space-y-4 mb-10">
                                    <li className="flex items-center gap-3 text-gray-700">
                                        <Check className="w-4 h-4 text-green-600" />
                                        <span className="text-sm font-medium">{plan.paperLimit === -1 ? 'Unlimited' : plan.paperLimit} Papers/month</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-700">
                                        <Check className="w-4 h-4 text-green-600" />
                                        <span className="text-sm font-medium">{plan.teacherLimit === -1 ? 'Unlimited' : plan.teacherLimit} Teacher Accounts</span>
                                    </li>
                                    {plan.modulePermissions.aiModule && (
                                        <li className="flex items-center gap-3 text-gray-700">
                                            <Check className="w-4 h-4 text-green-600" />
                                            <span className="text-sm font-medium">AI Question Extraction</span>
                                        </li>
                                    )}
                                    <li className="flex items-center gap-3 text-gray-700">
                                        <Check className="w-4 h-4 text-green-600" />
                                        <span className="text-sm font-medium">Question Bank Management</span>
                                    </li>
                                </ul>

                                <button 
                                    onClick={() => handlePurchase(plan)}
                                    disabled={loadingPlan === plan.id}
                                    className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${isPopular ? 'bg-brand-blue text-white hover:bg-blue-800 shadow-lg shadow-brand-blue/20' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                                >
                                    {loadingPlan === plan.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Activate Now'}
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                            <Shield className="w-8 h-8 text-brand-blue" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-gray-900 mb-1">Secure Payments via Razorpay</h4>
                            <p className="text-gray-500">Industry-standard encryption for your safety. All major cards and UPI supported.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button 
                            onClick={handleBackToLogin}
                            className="px-8 py-4 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};



export default Pricing;
