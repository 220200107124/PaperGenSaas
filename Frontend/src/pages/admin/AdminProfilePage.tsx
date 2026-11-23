import React from 'react';
import { Mail, ShieldCheck, UserRound, CalendarDays } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Badge from '../../components/Badge';

const AdminProfilePage: React.FC = () => {
    const user = useAuthStore((state) => state.user);

    if (!user) return null;

    const joined = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
        : 'Not available';

    return (
        <div className="space-y-6 px-3 sm:px-4 md:px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Admin Profile</h1>
                <p className="mt-1 text-xs sm:text-sm font-semibold text-gray-400">Your PaperGen administrator account details</p>
            </div>

            <section className="max-w-3xl overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl">
                <div className="bg-gradient-to-r from-brand-blue to-blue-700 px-6 py-8 sm:px-9 sm:py-10">
                    <div className="flex items-center gap-5">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-white/30 bg-white/15 text-white">
                            {user.avatarUrl ? <img src={user.avatarUrl} alt={`${user.name} profile`} className="h-full w-full object-cover" /> : <UserRound className="h-9 w-9" />}
                        </div>
                        <div className="min-w-0 text-white">
                            <h2 className="truncate text-2xl font-black">{user.name}</h2>
                            <p className="mt-1 text-sm font-medium text-white/75">PaperGen administrator</p>
                            <Badge variant="outline" className="mt-3 border-white/30 bg-white/10 text-white">{user.role.replace('_', ' ')}</Badge>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-9">
                    <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-5">
                        <div className="flex items-center gap-3 text-brand-blue"><Mail className="h-5 w-5" /><span className="text-xs font-black uppercase tracking-wider text-gray-400">Email address</span></div>
                        <p className="mt-3 break-all font-bold text-gray-900">{user.email}</p>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-5">
                        <div className="flex items-center gap-3 text-brand-blue"><ShieldCheck className="h-5 w-5" /><span className="text-xs font-black uppercase tracking-wider text-gray-400">Account role</span></div>
                        <p className="mt-3 font-bold text-gray-900">Super Admin</p>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-5 sm:col-span-2">
                        <div className="flex items-center gap-3 text-brand-blue"><CalendarDays className="h-5 w-5" /><span className="text-xs font-black uppercase tracking-wider text-gray-400">Account created</span></div>
                        <p className="mt-3 font-bold text-gray-900">{joined}</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminProfilePage;
