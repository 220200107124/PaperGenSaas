import React, { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';

const DashboardLayout: React.FC = () => {
    const { isAuthenticated } = useAuthStore();
    const { sidebarOpen, setSidebarOpen } = useUIStore();
    const location = useLocation();

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname, setSidebarOpen]);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex h-screen bg-bg-gray overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 h-full relative">
                <TopNavbar />
                <main className="flex-1 p-3 sm:p-4 lg:p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 flex flex-col">
                    <div className="max-w-[1400px] mx-auto pb-6 sm:pb-8 lg:pb-8 flex-1 w-full">
                        <Outlet />
                    </div>
                    {/* Dashboard Footer */}
                    <footer className="max-w-[1400px] w-full mx-auto mt-auto pt-6 border-t border-gray-200/60 pb-4">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] text-center lg:text-left">
                                © 2026 PaperGen SaaS. All rights reserved.
                            </p>
                            <div className="flex items-center gap-4 lg:gap-6">
                                <a href="#" className="text-xs font-bold text-gray-400 hover:text-brand-blue transition-colors">Support</a>
                                <a href="#" className="text-xs font-bold text-gray-400 hover:text-brand-blue transition-colors">Documentation</a>
                                <a href="#" className="text-xs font-bold text-gray-400 hover:text-brand-blue transition-colors">Terms</a>
                            </div>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
