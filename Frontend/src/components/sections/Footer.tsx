import React from 'react';
import { GraduationCap, Facebook, Twitter, Instagram, Linkedin, ShieldCheck, Zap } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                
                {/* Gopinu-style Responsive Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-gray-100">
                    
                    {/* 1. Brand (Spans full width on mobile, 4 columns on desktop) */}
                    <div className="space-y-5 md:col-span-12 lg:col-span-4">
                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                                <GraduationCap className="text-white w-5 h-5" />
                            </div>
                            <span className="font-bold text-lg text-gray-900">PaperGen</span>
                        </div>

                        <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
                            The premier SaaS platform for Gujarati Medium schools. Simplifying exam paper creation across institutions.
                        </p>

                        <div className="flex gap-3">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <div
                                    key={i}
                                    className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:text-blue-600 cursor-pointer transition-colors"
                                >
                                    <Icon className="w-4 h-4" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. Platform & Company (Stacked side-by-side on mobile inside a grid-cols-2 block!) */}
                    <div className="grid grid-cols-2 gap-8 md:col-span-6 lg:col-span-5">
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-5">
                                Platform
                            </h4>
                            <ul className="space-y-3 text-sm text-gray-500">
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Features</a></li>
                                <li><a href="/pricing" className="hover:text-blue-600 transition-colors">Pricing</a></li>
                                <li><a href="/documentations" className="hover:text-blue-600 transition-colors">Documentation</a></li>
                                <li><a href="/updates" className="hover:text-blue-600 transition-colors">Updates</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-5">
                                Company
                            </h4>
                            <ul className="space-y-3 text-sm text-gray-500">
                                <li><a href="/about" className="hover:text-blue-600 transition-colors">About</a></li>
                                <li><a href="/contact" className="hover:text-blue-600 transition-colors">Contact</a></li>
                                <li><a href="/careers" className="hover:text-blue-600 transition-colors">Careers</a></li>
                                <li><a href="/security" className="hover:text-blue-600 transition-colors">Security</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* 3. Contact Details */}
                    <div className="md:col-span-6 lg:col-span-3 space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-5">
                            Contact
                        </h4>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li className="flex gap-2 items-start">
                                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                <span>Surat, Gujarat, India</span>
                            </li>
                            <li className="flex gap-2 items-start">
                                <Zap className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                <a href="mailTo:support@papergen.com" className="hover:text-blue-600 transition-colors break-all">support@papergen.com</a>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Section */}
                <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
                    <span>© 2026 PaperGen Technologies. All rights reserved.</span>

                    <div className="flex gap-6">
                        <a href="/privacy-policy" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
                        <a href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</a>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;