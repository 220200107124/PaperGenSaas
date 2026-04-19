import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, GraduationCap, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types';
import Badge from '../components/Badge';
import api from '../lib/axios';
import { toast } from 'react-toastify';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [error, setError] = useState('');

    const { setAuth } = useAuthStore();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', {
                email,
                password,
            });

            const { access_token, user } = response.data.data;

            setAuth(user, access_token);

            // Redirect based on role
            if (user.role === UserRole.SUPER_ADMIN) {
                navigate('/admin/dashboard');
            } else if (user.hasActiveSubscription === false) {
                navigate('/pricing');
            } else if (user.role === UserRole.SCHOOL_ADMIN) {
                navigate('/school/dashboard');
            } else {
                navigate('/teacher/dashboard');
            }

        } catch (err: any) {
            console.error('Login error:', err);
            if (!err.response) {
                setError('Unable to reach the server. It might be sleeping or offline. Please wait 1-2 minutes and try again.');
            } else {
                setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendVerification = async () => {
        if (!email) {
            toast.error('Please enter your email to resend verification');
            return;
        }
        setIsResending(true);
        try {
            await api.post('/auth/send-verification-email', { email });
            toast.success('Verification email sent!');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to resend email');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-gray flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-brand-blue rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-brand-blue/20">
                        <GraduationCap className="text-white w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">PaperGen SaaS</h1>
                    <p className="text-gray-500 mt-2 font-medium">Gujarati Medium Question Paper Platform</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-10 border border-gray-100">
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Welcome back!</h2>
                        <p className="text-sm text-gray-500">Please enter your details to sign in.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 bg-red-600 rounded-full shrink-0"></span>
                                {error}
                            </div>
                            {error === 'Please verify your email before login' && (
                                <button 
                                    onClick={handleResendVerification} 
                                    disabled={isResending}
                                    type="button"
                                    className="text-left font-bold underline mt-1 text-red-700 hover:text-red-800 disabled:opacity-50"
                                >
                                    {isResending ? 'Sending...' : 'Resend Verification Email'}
                                </button>
                            )}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-800 mb-2">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-blue transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@example.com"
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-800 mb-2">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-blue transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue cursor-pointer" />
                                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
                            </label>
                            <button 
                                type="button" 
                                onClick={() => navigate('/forgot-password')}
                                className="text-sm font-bold text-brand-blue hover:text-blue-700 transition-colors"
                            >
                                Forgot password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-brand-blue hover:bg-blue-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-blue/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm bg-blue-50/50 p-4 rounded-2xl border border-blue-50">
                        <span className="text-gray-600">Don't have an account? </span>
                        <div className="mt-2.5 flex items-center justify-center gap-5">
                            <button onClick={() => navigate('/school-register')} className="font-black text-brand-blue hover:text-blue-700 hover:scale-105 transition-all text-[13px] tracking-wide uppercase">Register School</button>
                            <span className="text-blue-200">|</span>
                            <button onClick={() => navigate('/teacher-register')} className="font-black text-brand-blue hover:text-blue-700 hover:scale-105 transition-all text-[13px] tracking-wide uppercase">Register Teacher</button>
                        </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col gap-4 text-center">
                        <div className="text-sm text-gray-500">
                            Test Accounts:
                        </div>
                        <div className="flex flex-wrap justify-center gap-2">
                            <Badge className="cursor-pointer hover:bg-brand-blue/5 transition-colors" variant="info">admin@papergen.com</Badge>
                            <Badge className="cursor-pointer hover:bg-brand-orange/5 transition-colors" variant="warning">school@papergen.com</Badge>
                            <Badge className="cursor-pointer hover:bg-green-500/5 transition-colors text-green-700 bg-green-50 border-green-200" variant="success">teacher@papergen.com</Badge>
                            <span className="text-xs text-gray-400 w-full mt-1">Passwords: admin123 / school123 / teacher123</span>
                        </div>
                    </div>
                </div>

                <p className="mt-8 text-center text-sm text-gray-500">
                    Built for modern educators in Gujarat. © 2026 PaperGen SaaS
                </p>
            </div>
        </div>
    );
};

export default Login;
