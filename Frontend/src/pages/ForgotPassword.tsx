import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Key, ArrowLeft, Loader2 } from 'lucide-react';
import api from '../lib/axios';
import { toast } from 'react-toastify';

const ForgotPassword: React.FC = () => {
    const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            toast.success('OTP sent to your email');
            setStep('otp');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/auth/verify-otp', { email, otp });
            toast.success('OTP verified successfully');
            setStep('reset');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            await api.post('/auth/reset-password', { email, otp, password });
            toast.success('Password reset successfully');
            navigate('/login');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-gray flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-10 border border-gray-100">
                    <button 
                        onClick={() => navigate('/login')}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Login
                    </button>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {step === 'email' && 'Forgot Password?'}
                            {step === 'otp' && 'Verify OTP'}
                            {step === 'reset' && 'Reset Password'}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {step === 'email' && "No worries, we'll send you reset instructions."}
                            {step === 'otp' && `We've sent a 6-digit code to ${email}`}
                            {step === 'reset' && 'Enter your new password below.'}
                        </p>
                    </div>

                    {step === 'email' && (
                        <form onSubmit={handleSendOtp} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-2">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-blue transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all"
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-brand-blue hover:bg-blue-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-blue/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-70"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send OTP'}
                            </button>
                        </form>
                    )}

                    {step === 'otp' && (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-2">Enter OTP</label>
                                <div className="relative group">
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-blue transition-colors" />
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="6-digit code"
                                        maxLength={6}
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm tracking-[0.5em] font-bold focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all"
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-brand-blue hover:bg-blue-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-blue/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-70"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Code'}
                            </button>
                            <button 
                                type="button"
                                onClick={handleSendOtp}
                                className="w-full text-sm text-gray-500 hover:text-brand-blue font-medium transition-colors"
                            >
                                Didn't receive code? Resend
                            </button>
                        </form>
                    )}

                    {step === 'reset' && (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-2">New Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-blue transition-colors" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-2">Confirm Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-blue transition-colors" />
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all"
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-brand-blue hover:bg-blue-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-blue/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-70"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reset Password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
