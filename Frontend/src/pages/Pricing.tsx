import React from 'react';
import { Check, Zap, Shield, Star, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types';

const plans = [
    {
        name: 'Basic',
        price: '₹999',
        period: '/month',
        description: 'Perfect for small schools starting their digital journey.',
        features: [
            'Up to 200 Papers/month',
            'Up to 10 Teachers',
            'Global Question Bank Access',
            'Basic Support',
            'Standard Paper Formatting'
        ],
        icon: Zap,
        color: 'blue'
    },
    {
        name: 'Professional',
        price: '₹2,499',
        period: '/month',
        description: 'Most popular for growing institutions with multiple sections.',
        features: [
            'Unlimited Papers',
            'Up to 50 Teachers',
            'Advanced Question Filters',
            'Priority Email Support',
            'Custom School Branding',
            'Bulk Import Questions'
        ],
        icon: Star,
        popular: true,
        color: 'purple'
    },
    {
        name: 'Enterprise',
        price: '₹5,999',
        period: '/month',
        description: 'Elite features for large educational groups and franchises.',
        features: [
            'Unlimited Everything',
            'Dedicated Account Manager',
            'Custom Feature Requests',
            'API Access',
            'White-label Solution',
            'On-site Training'
        ],
        icon: Crown,
        color: 'brand-orange'
    }
];

const Pricing: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const handleBackToLogin = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-bg-gray py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-brand-blue font-bold tracking-wider uppercase text-sm mb-3">Subscription Plans</h2>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">Choose the perfect plan for your school</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Your current subscription has expired or is not active. Please select a plan below to continue using PaperGen SaaS.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {plans.map((plan) => (
                        <div 
                            key={plan.name}
                            className={`relative bg-white rounded-3xl p-8 shadow-xl border-2 transition-all hover:scale-[1.02] ${plan.popular ? 'border-brand-blue ring-4 ring-brand-blue/5' : 'border-transparent'}`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-brand-blue text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${plan.name === 'Professional' ? 'bg-purple-100 text-purple-600' : plan.name === 'Enterprise' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                <plan.icon className="w-8 h-8" />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                                <span className="text-gray-500 font-medium">{plan.period}</span>
                            </div>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                {plan.description}
                            </p>

                            <ul className="space-y-4 mb-10">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3 text-gray-700">
                                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                            <Check className="w-3.5 h-3.5 text-green-600" />
                                        </div>
                                        <span className="text-sm font-medium">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-4 rounded-xl font-bold text-sm transition-all ${plan.popular ? 'bg-brand-blue text-white hover:bg-blue-800 shadow-lg shadow-brand-blue/20' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>
                                {user?.role === UserRole.TEACHER ? 'Contact School Admin' : 'Purchase Now'}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                            <Shield className="w-8 h-8 text-brand-blue" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-gray-900 mb-1">Need a custom plan?</h4>
                            <p className="text-gray-500">We offer custom solutions for educational groups with 5+ schools.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button 
                            onClick={handleBackToLogin}
                            className="px-8 py-4 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            Sign Out
                        </button>
                        <button className="px-8 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors shadow-lg">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
