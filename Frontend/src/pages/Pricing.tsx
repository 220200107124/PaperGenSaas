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

    const loadPayPal = () => {
        return new Promise((resolve) => {
            if ((window as any).paypal) {
                console.log('[PayPal] SDK already loaded');
                return resolve(true);
            }
            const script = document.createElement('script');
            const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'AXVl0H4bkSjzlT_JTPDCwdg1yn8TrkdxpnOwnxIg8Jg_bW1A5SQMclvknZjoifiH_YFSTpG6Qj6tU9MH';
            console.log(`[PayPal] Loading SDK with ClientID: ${clientId}`);
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
            script.onload = () => {
                console.log('[PayPal] SDK loaded successfully');
                resolve(true);
            };
            script.onerror = () => {
                console.error('[PayPal] SDK load failed');
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    useEffect(() => {
        if (!isLoading && plans.length > 0) {
            loadPayPal().then((isLoaded) => {
                if (isLoaded && (window as any).paypal) {
                    plans.forEach(plan => {
                        if (plan.price === 0) return; // Skip PayPal for free plans

                        const containerId = `#paypal-button-container-${plan.id}`;
                        const container = document.querySelector(containerId);
                        if (container && !container.innerHTML) {
                            (window as any).paypal.Buttons({
                                createOrder: async () => {
                                    if (!user) {
                                        navigate('/login');
                                        return;
                                    }
                                    try {
                                        const amountInUsd = Number((plan.price / 83).toFixed(2));
                                        console.log(`[PayPal] Initiating order for ${plan.name}: ${amountInUsd} USD (INR ${plan.price})`);
                                        
                                        if (amountInUsd <= 0) throw new Error('Invalid amount');

                                        const data = await paymentService.createPayPalOrder({
                                            amount: amountInUsd
                                        });

                                        console.log(`[PayPal] Order data received:`, data);
                                        if (!data || !data.orderId) {
                                            throw new Error('Failed to create PayPal order ID');
                                        }

                                        return data.orderId;
                                    } catch (err: any) {
                                        console.error('[PayPal] createOrder Error:', err);
                                        const msg = err.response?.data?.message || err.message || 'Payment Order Failed';
                                        toast.error(msg);
                                        throw err;
                                    }
                                },
                                onApprove: async (data: any) => {
                                    console.log('[PayPal] Order approved. Data:', data);
                                    setIsLoading(true);
                                    try {
                                        const result = await paymentService.capturePayPalOrder({
                                            orderId: data.orderID,
                                            userId: user?.id || '',
                                            planId: plan.id,
                                            schoolId: user?.schoolId,
                                            type: user?.role === UserRole.SCHOOL_ADMIN ? 'school' : 'teacher'
                                        });
                                        console.log('[PayPal] Capture result:', result);
                                        toast.success('🎉 Subscription active!');
                                        setTimeout(() => {
                                            navigate(user?.role === UserRole.SCHOOL_ADMIN ? '/school/dashboard' : '/teacher/dashboard');
                                        }, 2000);
                                    } catch (error: any) {
                                        toast.error(error.response?.data?.message || 'Verification failed');
                                    } finally {
                                        setIsLoading(false);
                                    }
                                },
                                onError: (err: any) => {
                                    console.error('PayPal Error:', err);
                                    toast.error('PayPal checkout encountered an error. Please try again.');
                                }
                            }).render(containerId);
                        }
                    });
                }
            });
        }
    }, [isLoading, plans, user, navigate]);

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
                navigate(user?.role === UserRole.SCHOOL_ADMIN ? '/school/dashboard' : '/teacher/dashboard');
            }, 2000);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to activate free plan');
        } finally {
            setIsLoading(false);
        }
    };

    // Removed Razorpay handlePurchase

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const status = params.get('status');
        const token = params.get('token');
        const queryPlanName = params.get('planName');
        const queryType = params.get('type') as 'school' | 'teacher';

        if (status === 'success' && token && queryPlanName && user) {
            handleVerifyRedirect(token, queryPlanName, queryType);
        } else if (status === 'cancelled') {
            toast.info('PayPal payment was cancelled.');
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

            // Assuming checkSubscriptionStatus is available or handled via navigation
            setTimeout(() => {
                navigate(user?.role === UserRole.SCHOOL_ADMIN ? '/school/dashboard' : '/teacher/dashboard');
            }, 2000);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Verification failed');
            window.history.replaceState({}, '', '/pricing');
        } finally {
            setIsLoading(false);
        }
    };

    // Legacy handlePurchase removed

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
                                        <div id={`paypal-button-container-${plan.id}`} className="mt-4 min-h-[45px]"></div>
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
                            <h4 className="text-xl font-bold text-gray-900 mb-1">Use PayPal Sandbox Keys</h4>
                            <p className="text-gray-500 text-sm mb-2">Test integration is active. Sandbox Client ID is listed below:</p>
                            <code className="text-gray-800 text-xs font-mono bg-gray-50 p-2.5 rounded-lg border border-gray-200 block break-all font-bold">
                                {import.meta.env.VITE_PAYPAL_CLIENT_ID || 'AXVl0H4bkSjzlT_JTPDCwdg1yn8TrkdxpnOwnxIg8Jg_bW1A5SQMclvknZjoifiH_YFSTpG6Qj6tU9MH'}
                            </code>
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
