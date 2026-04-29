import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Building, User, Phone, MapPin, Loader2 } from 'lucide-react';
import { schoolRequestsService } from '../api/schoolRequestsService';

const SchoolRegister: React.FC = () => {
    const [formData, setFormData] = useState({
        schoolName: '',
        email: '',
        contactPerson: '',
        phone: '',
        city: '',
        password: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await schoolRequestsService.create(formData);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err: any) {
            console.error('Registration error:', err);
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-bg-gray flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-10 border border-gray-100">
                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Join as a School</h2>
                    <p className="text-sm text-gray-500">Submit a request to join the platform.</p>
                </div>

                {success ? (
                    <div className="p-4 bg-blue-50 border border-blue-100 text-blue-700 rounded-xl text-center font-bold">
                        Your school request is under review. You will be notified after approval. Redirecting...
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                                {error}
                            </div>
                        )}

                        <div className="relative group">
                            <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-blue" />
                            <input name="schoolName" value={formData.schoolName} onChange={handleChange} placeholder="School Name" className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all" required />
                        </div>

                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-blue" />
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all" required />
                        </div>

                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-blue" />
                            <input name="contactPerson" value={formData.contactPerson} onChange={handleChange} placeholder="Contact Person" className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all" required />
                        </div>

                        <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-blue" />
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all" required />
                        </div>

                        <div className="relative group">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-blue" />
                            <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all" required />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-blue" />
                            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all" required />
                        </div>

                        <button type="submit" disabled={isLoading} className="w-full py-4 bg-brand-blue hover:bg-blue-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-blue/20 flex items-center justify-center gap-3 transition-all disabled:opacity-70">
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Request'}
                        </button>
                    </form>
                )}
                <div className="mt-6 text-center">
                    <button onClick={() => navigate('/login')} className="text-sm font-bold text-brand-blue hover:text-blue-700">Already requested? Login</button>
                </div>
            </div>
        </div>
    );
};

export default SchoolRegister;
