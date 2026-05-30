import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, Menu, LogOut, Settings, UserCircle, BookOpen, CheckCheck, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { useNavigate } from 'react-router-dom';
import Badge from './Badge';

const mockNotifications = [
    {
        id: 1,
        icon: UserCircle,
        iconBg: 'bg-blue-50',
        iconColor: 'text-brand-blue',
        title: 'New teacher registration',
        desc: 'Anjali Shah has submitted a registration request.',
        time: '2 min ago',
        unread: true,
    },
    {
        id: 2,
        icon: BookOpen,
        iconBg: 'bg-green-50',
        iconColor: 'text-green-600',
        title: 'School subscription renewed',
        desc: 'Bright School renewed their Professional plan.',
        time: '1 hr ago',
        unread: true,
    },
    {
        id: 3,
        icon: Settings,
        iconBg: 'bg-amber-50',
        iconColor: 'text-amber-600',
        title: 'System maintenance scheduled',
        desc: 'Downtime planned on Jun 2nd from 2–4 AM.',
        time: '3 hr ago',
        unread: false,
    },
];

const TopNavbar: React.FC = () => {
    const { user, logout } = useAuthStore();
    const { toggleSidebar } = useUIStore();
    const navigate = useNavigate();

    const [notifOpen, setNotifOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [notifications, setNotifications] = useState(mockNotifications);

    const notifRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => n.unread).length;

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleMarkAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, unread: false })));

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <header className="h-20 bg-white/80 border-b border-gray-100 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-20 w-full backdrop-blur-xl">
            {/* Left: hamburger + search */}
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden flex items-center justify-center w-12 h-12 rounded-2xl bg-gray-50 text-gray-500 hover:bg-brand-blue/5 hover:text-brand-blue transition-all active:scale-95 shadow-sm"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div className="relative max-w-sm hidden lg:block group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-brand-blue transition-colors" />
                    <input
                        type="search"
                        placeholder="Search anything..."
                        className="pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:bg-white focus:border-brand-blue/20 transition-all w-full"
                    />
                </div>
            </div>

            {/* Right: notifications + profile */}
            <div className="flex items-center gap-3 lg:gap-5">

                {/* ── NOTIFICATIONS ── */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => { setNotifOpen(p => !p); setProfileOpen(false); }}
                        className="relative p-3 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/5 rounded-2xl transition-all"
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-brand-orange rounded-full border-2 border-white ring-2 ring-brand-orange/20 animate-pulse" />
                        )}
                    </button>

                    {notifOpen && (
                        <div className="absolute right-0 top-[calc(100%+8px)] w-[340px] sm:w-[380px] bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-gray-300/30 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            {/* Header */}
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-black text-gray-900 text-sm">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <span className="px-2 py-0.5 bg-brand-blue text-white text-[10px] font-black rounded-full">{unreadCount}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {unreadCount > 0 && (
                                        <button onClick={handleMarkAllRead} className="flex items-center gap-1 text-[10px] font-black text-brand-blue hover:text-blue-800 uppercase tracking-wider transition-all">
                                            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                                        </button>
                                    )}
                                    <button onClick={() => setNotifOpen(false)} className="p-1 rounded-lg text-gray-300 hover:text-gray-500 transition-all">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Notification list */}
                            <div className="divide-y divide-gray-50 max-h-[360px] overflow-y-auto">
                                {notifications.map(n => (
                                    <div key={n.id} className={`flex items-start gap-3 px-5 py-4 hover:bg-gray-50/80 transition-colors cursor-pointer ${n.unread ? 'bg-brand-blue/[0.02]' : ''}`}>
                                        <div className={`w-9 h-9 rounded-xl ${n.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                                            <n.icon className={`w-4 h-4 ${n.iconColor}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="text-xs font-black text-gray-900 leading-snug">{n.title}</p>
                                                {n.unread && <span className="w-2 h-2 bg-brand-blue rounded-full shrink-0 mt-1" />}
                                            </div>
                                            <p className="text-[11px] text-gray-400 font-medium mt-0.5 leading-relaxed">{n.desc}</p>
                                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-wider mt-1">{n.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="px-5 py-3 border-t border-gray-50 text-center">
                                <button className="text-[10px] font-black text-brand-blue hover:text-blue-800 uppercase tracking-widest transition-all">
                                    View All Notifications
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── PROFILE ── */}
                <div className="relative flex items-center gap-3 lg:border-l lg:border-gray-100 lg:pl-5" ref={profileRef}>
                    <div className="text-right hidden sm:block">
                        <div className="text-[13px] font-black text-gray-900 leading-tight truncate max-w-[120px]">{user.name}</div>
                        <div className="mt-0.5">
                            <Badge variant="info" className="scale-[0.8] origin-right tracking-widest font-black py-0.5">
                                {user.role.replace('_', ' ')}
                            </Badge>
                        </div>
                    </div>

                    <button
                        onClick={() => { setProfileOpen(p => !p); setNotifOpen(false); }}
                        className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-brand-blue/10 border-2 border-brand-blue/10 flex items-center justify-center text-brand-blue shadow-lg shadow-brand-blue/5 overflow-hidden hover:border-brand-blue/30 transition-all cursor-pointer"
                    >
                        {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-6 h-6" />
                        )}
                    </button>

                    {profileOpen && (
                        <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-gray-300/30 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            {/* User header */}
                            <div className="px-5 py-4 bg-gradient-to-br from-brand-blue/5 to-transparent border-b border-gray-50">
                                <p className="font-black text-gray-900 text-sm truncate">{user.name}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate mt-0.5">{user.role.replace('_', ' ')}</p>
                            </div>

                            {/* Menu items */}
                            <div className="py-2">
                                <button
                                    onClick={() => { setProfileOpen(false); navigate('/admin/profile'); }}
                                    className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-brand-blue transition-all"
                                >
                                    <UserCircle className="w-4 h-4" />
                                    My Profile
                                </button>
                                <button
                                    onClick={() => { setProfileOpen(false); navigate('/admin/settings'); }}
                                    className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-brand-blue transition-all"
                                >
                                    <Settings className="w-4 h-4" />
                                    Settings
                                </button>
                            </div>

                            <div className="border-t border-gray-50 py-2">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default TopNavbar;
