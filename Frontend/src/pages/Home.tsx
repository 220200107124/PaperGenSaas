import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    GraduationCap, 
    BookOpen, 
    FileText, 
    ArrowRight, 
    CheckCircle2, 
    Users, 
    Award, 
    Zap, 
    ShieldCheck, 
    ChevronDown, 
    Instagram, 
    Twitter, 
    Facebook, 
    Linkedin 
} from 'lucide-react';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const stats = [
        { label: 'Registered Schools', value: '500+', icon: GraduationCap },
        { label: 'Exams Generated', value: '10,000+', icon: FileText },
        { label: 'Verified Questions', value: '50,000+', icon: CheckCircle2 },
        { label: 'Active Teachers', value: '2,500+', icon: Users },
    ];

    const steps = [
        { 
            title: 'Quick Registration', 
            desc: 'Sign up your school or as an individual teacher in under 2 minutes.',
            icon: Zap,
            color: 'bg-yellow-50 text-yellow-600'
        },
        { 
            title: 'Choose Subject & Std', 
            desc: 'Select from our pre-configured GSEB curriculum (Std 1-8).',
            icon: BookOpen,
            color: 'bg-blue-50 text-blue-600'
        },
        { 
            title: 'Pick Questions', 
            desc: 'Browse our extensive bank or add your own custom questions.',
            icon: CheckCircle2,
            color: 'bg-green-50 text-green-600'
        },
        { 
            title: 'Download PDF', 
            desc: 'Generate a perfectly formatted, ready-to-print paper with your school logo.',
            icon: FileText,
            color: 'bg-purple-50 text-purple-600'
        },
    ];

    const faqs = [
        {
            q: "Is PaperGen aligned with the current GSEB curriculum?",
            a: "Yes, our question bank is strictly aligned with the latest Gujarati Medium GSEB curriculum for Standards 1-8, covering all major subjects."
        },
        {
            q: "Can I add my own custom questions?",
            a: "Absolutely! School admins and teachers can add their own private questions that only their institution can access."
        },
        {
            q: "Does it support multiple sections like A, B, and C?",
            a: "Yes, our paper builder allows you to organize questions into customized sections with specific instructions and marks for each."
        },
        {
            q: "What types of papers can I generate?",
            a: "You can generate everything from weekly unit tests and semester exams to full-scale annual examination papers."
        }
    ];

    return (
        <div className="min-h-screen bg-bg-gray font-sans selection:bg-brand-blue selection:text-white pb-0">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-gray-100">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center shadow-lg shadow-brand-blue/20 group-hover:rotate-6 transition-transform">
                            <GraduationCap className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <span className="font-black text-xl text-gray-900 leading-tight block mb-[2px]">PaperGen</span>
                            <span className="text-[10px] uppercase tracking-widest font-black text-brand-blue/60 block -mt-1">Gujarati Medium</span>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center gap-8">
                        <a href="#features" className="text-sm font-bold text-gray-600 hover:text-brand-blue transition-colors">Features</a>
                        <a href="#how-it-works" className="text-sm font-bold text-gray-600 hover:text-brand-blue transition-colors">How it Works</a>
                        <a href="#faqs" className="text-sm font-bold text-gray-600 hover:text-brand-blue transition-colors">FAQs</a>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                        <button onClick={() => navigate('/login')} className="text-sm font-bold text-gray-600 hover:text-brand-blue transition-colors px-2 lg:px-4 py-2">
                            Sign In
                        </button>
                        <button onClick={() => navigate('/school-register')} className="hidden md:block px-4 lg:px-6 py-2 bg-brand-blue text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-blue/20 hover:bg-blue-800 transition-all active:scale-95">
                            Get Started
                        </button>
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-gray-500 hover:text-brand-blue transition-colors">
                            <span className="block w-5 h-0.5 bg-current mb-1.5 rounded-full"></span>
                            <span className="block w-5 h-0.5 bg-current mb-1.5 rounded-full"></span>
                            <span className="block w-5 h-0.5 bg-current rounded-full"></span>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-lg py-4 px-4 sm:px-6 flex flex-col gap-4 animate-in slide-in-from-top-4 z-40">
                        <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-gray-600 hover:text-brand-blue transition-colors py-2 border-b border-gray-50">Features</a>
                        <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-gray-600 hover:text-brand-blue transition-colors py-2 border-b border-gray-50">How it Works</a>
                        <a href="#faqs" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-gray-600 hover:text-brand-blue transition-colors py-2 border-b border-gray-50">FAQs</a>
                        <div className="flex flex-col gap-3 pt-2">
                            <button onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }} className="w-full text-center font-bold text-gray-600 hover:text-brand-blue transition-colors py-3 bg-gray-50 rounded-xl">
                                Sign In
                            </button>
                            <button onClick={() => { setIsMobileMenuOpen(false); navigate('/school-register'); }} className="w-full text-center text-white font-bold bg-brand-blue hover:bg-blue-800 transition-colors py-3 rounded-xl shadow-lg shadow-brand-blue/20 uppercase tracking-widest text-xs">
                                Get Started
                            </button>
                        </div>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <section className="relative pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-[0.03]">
                    <div className="absolute w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-brand-blue rounded-full blur-[120px] -top-20 -left-20"></div>
                    <div className="absolute w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-brand-orange rounded-full blur-[120px] bottom-0 right-0"></div>
                </div>

                <div className="max-w-[1400px] mx-auto text-center space-y-6 sm:space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white rounded-full border border-gray-100 shadow-sm mb-4 animate-bounce">
                        <Award className="text-brand-orange w-4 h-4" />
                        <span className="text-xs font-black text-gray-900 uppercase tracking-widest">#1 SaaS for GSEB Schools</span>
                    </div>
                    
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-gray-900 tracking-tight leading-[0.9] max-w-5xl mx-auto">
                        Empowering Schools with <span className="text-brand-blue relative">Smart Exams</span>.
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed pt-2 px-4">
                        Create professional, curriculum-aligned Gujarati Medium question papers in minutes. Standardized exams, simplified for every teacher.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-8 sm:pt-10">
                        <button onClick={() => navigate('/school-register')} className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-brand-blue text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-brand-blue/40 hover:bg-blue-800 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group active:translate-y-0">
                            Register Your School
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <div className="flex items-center -space-x-4 mt-4 sm:mt-0">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 sm:w-12 h-10 sm:h-12 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-sm">
                                    <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="user" loading="lazy" className="w-full h-full object-cover" />
                                </div>
                            ))}
                            <div className="pl-4 sm:pl-6 flex flex-col items-start leading-none">
                                <span className="text-sm font-black text-gray-900">2,500+ Teachers</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Growing Daily</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 bg-white p-8 sm:p-12 rounded-[2rem] sm:rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-gray-200/40 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/[0.02] to-transparent pointer-events-none"></div>
                    {stats.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div key={i} className="flex flex-col items-center text-center space-y-2 sm:space-y-3 relative z-10">
                                <div className="w-12 sm:w-14 h-12 sm:h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-brand-blue mb-2 group-hover:scale-110 transition-transform duration-500">
                                    <Icon className="w-6 sm:w-7 h-6 sm:h-7" />
                                </div>
                                <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tighter">{stat.value}</span>
                                <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="max-w-[1400px] mx-auto px-4 sm:px-6 py-16 sm:py-24">
                <div className="text-center space-y-4 mb-16 sm:mb-20">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">Everything You Need</h2>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs">Powerful features to automate your academic workflow</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-10">
                    <div className="bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border border-gray-100 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-blue-500/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="w-12 sm:w-16 h-12 sm:h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 sm:mb-8 group-hover:rotate-12 transition-transform shadow-lg shadow-blue-100/50">
                            <BookOpen className="text-blue-600 w-6 sm:w-8 h-6 sm:h-8" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-3 sm:mb-4">GSEB Question Bank</h3>
                        <p className="text-gray-500 leading-relaxed font-medium text-sm sm:text-base">Over 50,000+ verified questions spanning Std 1 to 8, specifically designed for Gujarati Medium schools.</p>
                        <div className="pt-6 sm:pt-8">
                            <div className="h-1 w-10 sm:w-12 bg-blue-500 rounded-full"></div>
                        </div>
                    </div>

                    <div className="bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border border-gray-100 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-orange-500/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="w-12 sm:w-16 h-12 sm:h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 sm:mb-8 group-hover:rotate-12 transition-transform shadow-lg shadow-orange-100/50">
                            <FileText className="text-orange-600 w-6 sm:w-8 h-6 sm:h-8" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-3 sm:mb-4">Smart PDF Builder</h3>
                        <p className="text-gray-500 leading-relaxed font-medium text-sm sm:text-base">Automatic layout engine that styles your papers professionally. Ready to print, no formatting required.</p>
                        <div className="pt-6 sm:pt-8">
                            <div className="h-1 w-10 sm:w-12 bg-orange-500 rounded-full"></div>
                        </div>
                    </div>

                    <div className="bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border border-gray-100 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden md:col-span-2 xl:col-span-1">
                        <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-green-500/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="w-12 sm:w-16 h-12 sm:h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6 sm:mb-8 group-hover:rotate-12 transition-transform shadow-lg shadow-green-100/50">
                            <ShieldCheck className="text-green-600 w-6 sm:w-8 h-6 sm:h-8" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-3 sm:mb-4">School Control Panel</h3>
                        <p className="text-gray-500 leading-relaxed font-medium text-sm sm:text-base">Complete isolation for your school data. Manage teachers, private questions, and subscriptions easily.</p>
                        <div className="pt-6 sm:pt-8">
                            <div className="h-1 w-10 sm:w-12 bg-green-500 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="bg-white py-16 sm:py-24">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
                        <div className="flex-1 space-y-6 sm:space-y-8">
                            <div className="space-y-4 text-center lg:text-left">
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 tracking-tight leading-tight">4 Steps to Your Perfect Question Paper.</h2>
                                <p className="text-lg sm:text-xl text-gray-500 font-medium leading-relaxed">We've eliminated the manual labor. Focus on teaching, let us handle the formatting.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-6 sm:pt-8">
                                {steps.map((step, i) => {
                                    const Icon = step.icon;
                                    return (
                                        <div key={i} className="flex gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gray-50 border border-gray-100">
                                            <div className={`w-12 sm:w-14 h-12 sm:h-14 ${step.color} rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-black/5`}>
                                                <Icon className="w-6 sm:w-7 h-6 sm:h-7" />
                                            </div>
                                            <div className="space-y-1 pt-1">
                                                <h4 className="font-black text-gray-900 text-sm sm:text-base">{step.title}</h4>
                                                <p className="text-xs sm:text-sm text-gray-500 leading-snug">{step.desc}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex-1 w-full max-w-lg lg:max-w-2xl">
                            <div className="relative aspect-square lg:aspect-[4/5] bg-bg-gray rounded-[3rem] sm:rounded-[4rem] border-4 sm:border-8 border-gray-50 shadow-inner overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/10 to-transparent p-8 sm:p-12">
                                    <div className="bg-white w-full h-full rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl p-6 sm:p-10 space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 transform group-hover:scale-[1.02] transition-transform">
                                        <div className="h-10 sm:h-12 w-2/3 bg-gray-100 rounded-xl"></div>
                                        <div className="space-y-2 sm:space-y-3">
                                            <div className="h-3 sm:h-4 w-full bg-gray-50 rounded-full"></div>
                                            <div className="h-3 sm:h-4 w-full bg-gray-50 rounded-full"></div>
                                            <div className="h-3 sm:h-4 w-1/2 bg-gray-50 rounded-full"></div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-6 sm:pt-10">
                                            <div className="h-32 sm:h-40 bg-gray-50 rounded-2xl sm:rounded-3xl border border-dashed border-gray-200 flex items-center justify-center">
                                                <FileText className="text-gray-200 w-8 sm:w-12 h-8 sm:h-12" />
                                            </div>
                                            <div className="h-32 sm:h-40 bg-gray-50 rounded-2xl sm:rounded-3xl border border-dashed border-gray-200 flex items-center justify-center">
                                                <FileText className="text-gray-200 w-8 sm:w-12 h-8 sm:h-12" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 w-3/4">
                                            <div className="h-10 sm:h-14 bg-brand-blue rounded-2xl shadow-xl shadow-brand-blue/30 flex items-center justify-center px-6 sm:px-8 text-white font-black text-xs uppercase tracking-widest">
                                                Generated PDF
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 sm:py-24 max-w-[1400px] mx-auto px-4 sm:px-6">
                <div className="bg-gray-900 rounded-[3rem] sm:rounded-[4rem] p-8 sm:p-16 lg:p-24 text-center space-y-12 sm:space-y-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-brand-blue/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                    
                    <div className="space-y-4 relative z-10">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">Trusted by Leading Schools</h2>
                        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">Join the digital revolution in education</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 relative z-10">
                        <div className="bg-white/10 backdrop-blur-md p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] text-left space-y-4 sm:space-y-6 border border-white/10">
                            <div className="flex gap-1 text-brand-orange">
                                {[1, 2, 3, 4, 5].map(i => <Award key={i} className="w-4 sm:w-5 h-4 sm:h-5 fill-brand-orange" />)}
                            </div>
                            <p className="text-lg sm:text-xl text-white font-black italic leading-relaxed">
                                "PaperGen has completely transformed how our teachers approach examinations. What used to take days now takes minutes."
                            </p>
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-blue-500 overflow-hidden">
                                     <img src="https://i.pravatar.cc/150?u=a" alt="principal" loading="lazy" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <span className="block font-black text-white text-sm sm:text-base">Rajeshbhai Patel</span>
                                    <span className="block text-xs text-gray-400 font-bold uppercase tracking-widest">Principal, Bright School</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] text-left space-y-4 sm:space-y-6 border border-white/10">
                            <div className="flex gap-1 text-brand-orange">
                                {[1, 2, 3, 4, 5].map(i => <Award key={i} className="w-4 sm:w-5 h-4 sm:h-5 fill-brand-orange" />)}
                            </div>
                            <p className="text-lg sm:text-xl text-white font-black italic leading-relaxed">
                                "The question bank quality is exceptional. It exactly matches the GSEB standards our students are tested on."
                            </p>
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-orange-500 overflow-hidden">
                                     <img src="https://i.pravatar.cc/150?u=b" alt="teacher" loading="lazy" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <span className="block font-black text-white text-sm sm:text-base">Anjaliben Shah</span>
                                    <span className="block text-xs text-gray-400 font-bold uppercase tracking-widest">Snr Teacher, Vidya Sankul</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQs */}
            <section id="faqs" className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6">
                <div className="text-center space-y-4 mb-12 sm:mb-16">
                    <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Common Questions</h2>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs">Everything you need to know about the platform</p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                    {faqs.map((faq, i) => (
                        <div key={i} className="bg-white rounded-[1.5rem] sm:rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
                            <button 
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="w-full p-6 sm:p-8 flex items-center justify-between text-left group"
                            >
                                <span className="text-base sm:text-lg font-black text-gray-900 group-hover:text-brand-blue transition-colors pr-6 sm:pr-8 leading-tight">{faq.q}</span>
                                <ChevronDown className={`w-5 sm:w-6 h-5 sm:h-6 shrink-0 transition-transform duration-500 ${openFaq === i ? 'rotate-180 text-brand-blue' : 'text-gray-300'}`} />
                            </button>
                            <div className={`transition-all duration-500 ease-in-out ${openFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                <div className="px-6 sm:px-8 pb-6 sm:pb-8 text-gray-500 font-medium leading-relaxed text-sm sm:text-base">
                                    {faq.a}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 sm:py-24 px-4 sm:px-6">
                <div className="max-w-[1400px] mx-auto bg-brand-blue rounded-[3rem] sm:rounded-[4rem] p-8 sm:p-16 lg:p-24 xl:p-32 text-center text-white space-y-8 sm:space-y-10 shadow-2xl shadow-brand-blue/30 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10 space-y-4 sm:space-y-6">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-7xl font-black tracking-tight leading-tight">Ready to Switch to <span className="italic">Digital</span> Paper Generation?</h2>
                        <p className="text-lg sm:text-xl text-blue-100/60 font-medium max-w-2xl mx-auto">Start your 14-day free trial today. No credit card required. Register your school now.</p>
                        <div className="pt-6 sm:pt-8">
                            <button onClick={() => navigate('/school-register')} className="px-8 sm:px-12 py-4 sm:py-6 bg-white text-brand-blue rounded-2xl sm:rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:scale-110 active:scale-100 transition-all">Get Started Instantly</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 pt-16 sm:pt-24 pb-8 sm:pb-12">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 pb-16 sm:pb-20 border-b border-gray-100">
                        <div className="space-y-6 sm:space-y-8 md:col-span-2 lg:col-span-1">
                            <div className="flex items-center gap-3">
                                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-brand-blue rounded-xl flex items-center justify-center shadow-lg shadow-brand-blue/20">
                                    <GraduationCap className="text-white w-5 sm:w-6 h-5 sm:h-6" />
                                </div>
                                <span className="font-black text-lg sm:text-2xl text-gray-900 leading-tight">PaperGen</span>
                            </div>
                            <p className="text-gray-500 font-medium leading-relaxed text-sm sm:text-base">The premier SaaS platform for Gujarati Medium educational institutions across the state. Standardizing education, one paper at a time.</p>
                            <div className="flex gap-3 sm:gap-4">
                                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-brand-blue cursor-pointer transition-all"><Facebook className="w-3 sm:w-4 h-3 sm:h-4" /></div>
                                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-brand-blue cursor-pointer transition-all"><Twitter className="w-3 sm:w-4 h-3 sm:h-4" /></div>
                                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-brand-blue cursor-pointer transition-all"><Instagram className="w-3 sm:w-4 h-3 sm:h-4" /></div>
                                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-brand-blue cursor-pointer transition-all"><Linkedin className="w-3 sm:w-4 h-3 sm:h-4" /></div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-6 sm:mb-8">Platform</h4>
                            <ul className="space-y-3 sm:space-y-4">
                                {['Solutions', 'Features', 'Pricing', 'Documentation', 'Changelog'].map(item => (
                                    <li key={item}><a href="#" className="text-gray-500 font-bold hover:text-brand-blue text-sm transition-colors">{item}</a></li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-6 sm:mb-8">Company</h4>
                            <ul className="space-y-3 sm:space-y-4">
                                {['About Us', 'Contact', 'Meet the Team', 'Safety', 'Careers'].map(item => (
                                    <li key={item}><a href="#" className="text-gray-500 font-bold hover:text-brand-blue text-sm transition-colors">{item}</a></li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-6 sm:mb-8">Contact Information</h4>
                            <ul className="space-y-4 sm:space-y-6">
                                <li className="flex gap-3 sm:gap-4">
                                    <div className="w-4 sm:w-5 h-4 sm:h-5 text-brand-blue mt-1"><ShieldCheck className="w-full h-full" /></div>
                                    <div className="text-sm font-bold text-gray-600">Surat, Gujarat, India</div>
                                </li>
                                <li className="flex gap-3 sm:gap-4">
                                    <div className="w-4 sm:w-5 h-4 sm:h-5 text-brand-blue mt-1"><Zap className="w-full h-full" /></div>
                                    <div className="text-sm font-bold text-gray-600">support@papergen.com</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 sm:pt-12 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                        <span className="text-gray-400 text-xs font-black uppercase tracking-[0.3em]">© 2026 PaperGen Technologies. All rights reserved.</span>
                        <div className="flex gap-6 sm:gap-8">
                            <a href="#" className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] hover:text-brand-blue transition-colors">Privacy Policy</a>
                            <a href="#" className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] hover:text-brand-blue transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;

