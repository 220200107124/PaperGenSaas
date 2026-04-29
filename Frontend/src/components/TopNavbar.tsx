import React from 'react';
import { Bell, Search, User, Menu } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import Badge from './Badge';

const TopNavbar: React.FC = () => {
    const { user } = useAuthStore();
    const { toggleSidebar } = useUIStore();

    if (!user) return null;

    return (
        <header className="h-20 bg-white/80 border-b border-gray-100 px-4 md:px-8 flex items-center justify-between sticky top-0 z-20 w-full backdrop-blur-xl">
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={toggleSidebar}
                    className="md:hidden flex items-center justify-center w-12 h-12 rounded-2xl bg-gray-50 text-gray-500 hover:bg-brand-blue/5 hover:text-brand-blue transition-all active:scale-95 shadow-sm"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div className="relative max-w-sm hidden md:block group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-brand-blue transition-colors" />
                    <input
                        type="search"
                        placeholder="Search anything..."
                        className="pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:bg-white focus:border-brand-blue/20 transition-all w-full"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
                <button className="relative p-3 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/5 rounded-2xl transition-all">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-brand-orange rounded-full border-2 border-white ring-2 ring-brand-orange/20 animate-pulse"></span>
                </button>

                <div className="flex items-center gap-3 md:border-l md:border-gray-50 md:pl-6 h-10">
                    <div className="text-right hidden sm:block">
                        <div className="text-[13px] font-black text-gray-900 leading-tight truncate max-w-[120px]">
                            {user.name}
                        </div>
                        <div className="mt-0.5">
                            <Badge variant="info" className="scale-[0.8] origin-right tracking-widest font-black py-0.5">
                                {user.role.replace('_', ' ')}
                            </Badge>
                        </div>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-brand-blue/10 border-2 border-brand-blue/10 flex items-center justify-center text-brand-blue shadow-lg shadow-brand-blue/5 overflow-hidden group hover:border-brand-blue/30 transition-all cursor-pointer">
                        {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        ) : (
                            <User className="w-6 h-6" />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopNavbar;
