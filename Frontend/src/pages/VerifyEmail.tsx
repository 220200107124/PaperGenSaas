import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../lib/axios';

const VerifyEmail: React.FC = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Verification token is missing.');
                return;
            }

            try {
                const response = await api.post('/auth/verify-email', { token });
                setStatus('success');
                setMessage(response.data.message || 'Email verified successfully!');
            } catch (err: any) {
                console.error(err);
                setStatus('error');
                setMessage(err.response?.data?.message || 'Verification failed. The link might be expired or invalid.');
            }
        };

        verify();
    }, [token]);

    return (
        <div className="min-h-screen bg-bg-gray flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 text-center space-y-6">
                
                {status === 'loading' && (
                    <div className="flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-16 h-16 text-brand-blue animate-spin" />
                        <h2 className="text-xl font-bold text-gray-900">Verifying Email...</h2>
                        <p className="text-gray-500">Please wait while we verify your email address.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center animate-bounce">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 leading-tight">Verified!</h2>
                        <p className="text-gray-500 font-medium">{message}</p>
                        <button 
                            onClick={() => navigate('/login')}
                            className="mt-4 px-8 py-3 w-full bg-brand-blue text-white rounded-xl font-bold shadow-lg shadow-brand-blue/20 hover:scale-105 transition-transform"
                        >
                            Proceed to Login
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                            <XCircle className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 leading-tight">Verification Failed</h2>
                        <p className="text-gray-500 font-medium">{message}</p>
                        <button 
                            onClick={() => navigate('/login')}
                            className="mt-4 px-8 py-3 w-full bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                        >
                            Back to Login
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default VerifyEmail;
