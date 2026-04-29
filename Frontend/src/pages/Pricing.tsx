import React, { useState, useEffect } from 'react';
import { Check, Zap, Star, Crown, Shield, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types';
import { paymentService } from '../api/paymentService';
import { plansService, type Plan } from '../api/plansService';
import { toast } from 'react-toastify';

const getRedirectPath = (role: UserRole | undefined, plan?: Plan) => {
    if (!role) return '/login';
    const base = role === UserRole.SCHOOL_ADMIN ? '/school' : '/teacher';
    
    if (!plan || !plan.modulePermissions) return `${base}/dashboard`;
    
    // Priority routing based on modules purchased
    if (plan.modulePermissions.aiModule || plan.modulePermissions.paperModule) {
        return `${base}/create-paper`;
    }
    if (plan.modulePermissions.questionModule) {
        return `${base}/questions`;
    }
    if (role === UserRole.SCHOOL_ADMIN && plan.modulePermissions.teacherModule) {
        return `${base}/teachers`;
    }
    return `${base}/dashboard`;
};

const Pricing: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const data = await plansService.getPlans();
                setPlans(data); // Display all plans to prevent DB mismatches from hiding UI
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
            if ((window as any).Razorpay) {
                return resolve(true);
            }
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
            return handleFreePlan(plan);
        }

        setIsLoading(true);
        try {
            const isLoaded = await loadRazorpay();
            if (!isLoaded) {
                toast.error('Razorpay SDK failed to load. Are you online?');
                setIsLoading(false);
                return;
            }

            const data = await paymentService.createPayPalOrder({ amount: plan.price });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SfOyyf52Uj3eHK',
                amount: Math.round(plan.price * 100),
                currency: 'INR',
                name: 'Paper Generation Platform',
                description: `Subscription: ${plan.name}`,
                order_id: data.orderId,
                handler: async function (response: any) {
                    try {
                        setIsLoading(true);
                        await paymentService.capturePayPalOrder({
                            orderId: response.razorpay_order_id,
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                            userId: user?.id || '',
                            planId: plan.id,
                            schoolId: user?.schoolId,
                            type: user?.role === UserRole.SCHOOL_ADMIN ? 'school' : 'teacher'
                        });
                        toast.success('🎉 Subscription active!');
                        setTimeout(() => {
                            navigate(getRedirectPath(user?.role, plan));
                        }, 2000);
                    } catch (error: any) {
                        toast.error(error.response?.data?.message || 'Payment verification failed');
                        setIsLoading(false);
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                },
                theme: {
                    color: '#003087'
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                 toast.error('Payment failed: ' + response.error.description);
                 setIsLoading(false);
            });
            rzp.open();
        } catch (err: any) {
            setIsLoading(false);
            toast.error(err.response?.data?.message || 'Failed to initialize payment');
        }
    };

    const handleFreePlan = async (plan: Plan) => {
        if (!user) {
            navigate('/login');
            return;
        }
        setIsLoading(true);
        try {
            await paymentService.capturePayPalOrder({
                orderId: 'FREE_PLAN_' + Date.now(),
                userId: user.id,
                planId: plan.id,
                schoolId: user.schoolId,
                type: user.role === UserRole.SCHOOL_ADMIN ? 'school' : 'teacher'
            });
            toast.success('🎉 Free plan activated!');
            setTimeout(() => {
                navigate(getRedirectPath(user?.role, plan));
            }, 2000);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to activate free plan');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const status = params.get('status');
        const token = params.get('token');
        const queryPlanName = params.get('planName');
        const queryType = params.get('type') as 'school' | 'teacher';

        if (status === 'success' && token && queryPlanName && user) {
            handleVerifyRedirect(token, queryPlanName, queryType);
        } else if (status === 'cancelled') {
            toast.info('Payment was cancelled.');
            window.history.replaceState({}, '', '/pricing');
        }
    }, [user]);

    const handleVerifyRedirect = async (token: string, planName: string, type: 'school' | 'teacher') => {
        setIsLoading(true);
        try {
            await paymentService.verifyPayPalPayment({
                paypalOrderId: token,
                userId: user?.id,
                schoolId: user?.schoolId,
                planName: planName,
                type: type
            });
            toast.success('🎉 Subscription active!');
            // Clean up url
            window.history.replaceState({}, '', '/pricing');

            const purchasedPlan = plans.find(p => p.name === planName);
            setTimeout(() => {
                navigate(getRedirectPath(user?.role, purchasedPlan));
            }, 2000);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Verification failed');
            window.history.replaceState({}, '', '/pricing');
        } finally {
            setIsLoading(false);
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
                                    {plan.modulePermissions?.aiModule && (
                                        <li className="flex items-center gap-3 text-gray-700">
                                            <Check className="w-4 h-4 text-green-600" />
                                            <span className="text-sm font-medium">AI Question Generator</span>
                                        </li>
                                    )}
                                    <li className="flex items-center gap-3 text-gray-700">
                                        <Check className="w-4 h-4 text-green-600" />
                                        <span className="text-sm font-medium">Question Bank Management</span>
                                    </li>
                                </ul>

                                <div className="space-y-3">
                                    {plan.price === 0 ? (
                                        <button 
                                            onClick={() => handleFreePlan(plan)}
                                            className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg active:scale-95"
                                        >
                                            Get Started for Free
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => handlePurchase(plan)}
                                            className={`w-full py-3.5 text-white rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 ${isPopular ? 'bg-brand-blue hover:bg-blue-800' : 'bg-gray-900 hover:bg-gray-800'}`}
                                        >
                                            Subscribe Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-[#003087]/10 rounded-2xl flex items-center justify-center shrink-0">
                            <Shield className="w-8 h-8 text-[#003087]" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-gray-900 mb-1">Use Razorpay Test Keys</h4>
                            <p className="text-gray-500 text-sm mb-2">Test integration is active. Sandbox Key ID is configured.</p>
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
