import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    School,
    Globe,
    Users,
    CreditCard,
    LogOut,
    GraduationCap,
    FileText,
    BookOpen,
    PlusCircle,
    FileEdit,
    Layout,
    AlertCircle,
    CheckCircle2,
    X
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { UserRole } from '../types';
import { clsx } from 'clsx';

const Sidebar: React.FC = () => {
    const { user, logout } = useAuthStore();
    const { sidebarOpen, setSidebarOpen } = useUIStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = {
        [UserRole.SUPER_ADMIN]: [
            { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
            { name: 'School Requests', path: '/admin/school-requests', icon: FileText },
            { name: 'Teacher Requests', path: '/admin/teacher-requests', icon: FileEdit },
            { name: 'Schools', path: '/admin/schools', icon: School },
            { name: 'Standards', path: '/admin/standards', icon: GraduationCap },
            { name: 'Subjects', path: '/admin/subjects', icon: BookOpen },
            { name: 'Chapters', path: '/admin/chapters', icon: Layout },
            { name: 'Global Questions', path: '/admin/questions', icon: Globe },
            { name: 'Users', path: '/admin/users', icon: Users },
            { name: 'Subscriptions', path: '/admin/subscriptions', icon: CreditCard },
        ],
        [UserRole.SCHOOL_ADMIN]: [
            { name: 'Dashboard', path: '/school/dashboard', icon: LayoutDashboard },
            { name: 'Teachers', path: '/school/teachers', icon: GraduationCap },
            { name: 'Question Bank', path: '/school/questions', icon: BookOpen },
            { name: 'Create Paper', path: '/school/create-paper', icon: PlusCircle },
            { name: 'My Papers', path: '/school/papers', icon: FileText },
        ],
        [UserRole.TEACHER]: [
            { name: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
            { name: 'Question Bank', path: '/teacher/questions', icon: BookOpen },
            { name: 'Create Paper', path: '/teacher/create-paper', icon: PlusCircle },
            { name: 'My Papers', path: '/teacher/papers', icon: FileEdit },
        ],
    };

    if (!user) return null;

    const activeRoleItems = menuItems[user.role] || [];

    return (
        <aside className={clsx(
            "fixed md:sticky top-0 left-0 z-30 w-72 bg-white border-r border-gray-100 h-screen flex flex-col transition-transform duration-300 md:translate-x-0 shadow-2xl md:shadow-none",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            <div className="p-6 border-b border-gray-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center shadow-lg shadow-brand-blue/20">
                            <GraduationCap className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <span className="font-bold text-lg text-gray-900 leading-tight">PaperGen</span>
                            <div className="text-[10px] text-gray-400 uppercase tracking-widest font-black leading-none mt-0.5">Gujarat Medium</div>
                        </div>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="md:hidden p-2 text-gray-400 hover:text-gray-900 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto no-scrollbar">
                {activeRoleItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            clsx(
                                'flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[13px] font-black transition-all group',
                                isActive
                                    ? 'bg-brand-blue text-white shadow-xl shadow-brand-blue/20'
                                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
                            )
                        }
                    >
                        <item.icon className={clsx("w-5 h-5", sidebarOpen ? "animate-pulse" : "")} />
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            {user.role !== UserRole.SUPER_ADMIN && (
                <div className="px-6 mb-6">
                    <div className={clsx(
                        "p-4 rounded-2xl border flex flex-col gap-2 transition-all",
                        user.hasActiveSubscription 
                            ? "bg-green-50/50 border-green-100" 
                            : "bg-red-50/50 border-red-100 animate-pulse"
                    )}>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status</span>
                            {user.hasActiveSubscription ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                            ) : (
                                <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className={clsx(
                                "text-xs font-bold",
                                user.hasActiveSubscription ? "text-green-700" : "text-red-700"
                            )}>
                                {user.hasActiveSubscription ? 'Premium Active' : 'No Active Plan'}
                            </span>
                            {!user.hasActiveSubscription && (
                                <button 
                                    onClick={() => navigate('/pricing')}
                                    className="text-[10px] font-black text-brand-blue uppercase tracking-wider mt-1 hover:underline text-left"
                                >
                                    Upgrade Now
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="p-6 border-t border-gray-50 flex flex-col gap-4">
                <div className="flex items-center gap-3 px-4">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                        {user.name.charAt(0)}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-gray-900 truncate">{user.name}</span>
                        <span className="text-[10px] text-gray-400 font-medium truncate">{user.role.replace('_', ' ')}</span>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[12px] font-black text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all border border-transparent hover:border-red-100"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
