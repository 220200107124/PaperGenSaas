import React from 'react';
import { Search, Globe, School, GraduationCap, PlusCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';
import { SourceType, Difficulty } from '../../types';

const TeacherQuestionsPage: React.FC = () => {
    // Mock Data (Fetched for current teacher's assigned subjects)
    const questions = [
        { id: '1', standardId: 'Std 8', subjectId: 'Gujarati', questionText: 'ગાંધીજીના બાળપણના પ્રસંગો વિશે ટૂંકનોંધ લખો.', difficulty: Difficulty.MEDIUM, sourceType: SourceType.GLOBAL, marks: 5 },
        { id: '2', standardId: 'Std 8', subjectId: 'Gujarati', questionText: 'નીચેના શબ્દોના અર્થ આપો: કુસુમ, પંકજ.', difficulty: Difficulty.EASY, sourceType: SourceType.SCHOOL, marks: 2 },
        { id: '3', standardId: 'Std 8', subjectId: 'Gujarati', questionText: '"માતૃપ્રેમ" વિષય પર નિબંધ લખો.', difficulty: Difficulty.HARD, sourceType: SourceType.GLOBAL, marks: 10 },
    ];

    const columns = [
        {
            header: 'Library Content',
            accessor: (q: any) => (
                <div className="flex flex-col gap-3 py-2">
                    <p className="text-lg font-bold text-gray-900 font-gujarati group-hover:text-brand-blue transition-colors max-w-2xl leading-relaxed">{q.questionText}</p>
                    <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${q.sourceType === SourceType.GLOBAL ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                            {q.sourceType === SourceType.GLOBAL ? <Globe className="w-3 h-3" /> : <School className="w-3 h-3" />}
                            {q.sourceType}
                        </div>
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Added: 2 months ago</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Category',
            accessor: (q: any) => (
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-brand-blue" />
                        <span className="text-sm font-bold text-gray-700">{q.standardId}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-6">{q.subjectId}</span>
                </div>
            )
        },
        {
            header: 'Complexity',
            accessor: (q: any) => (
                <div className="flex flex-col gap-2">
                    <Badge variant={q.difficulty === Difficulty.EASY ? 'success' : q.difficulty === Difficulty.MEDIUM ? 'warning' : 'error'}>
                        {q.difficulty}
                    </Badge>
                    <span className="text-xs font-bold text-gray-400 pl-1">{q.marks} Marks Point</span>
                </div>
            )
        },
        {
            header: '',
            accessor: () => (
                <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-all shadow-sm active:scale-95 group/btn">
                    <PlusCircle className="w-3.5 h-3.5" />
                    Add to Build
                </button>
            ),
            className: "text-right"
        }
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Question Library</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.15em] text-[10px] flex items-center gap-2">
                        Academic Resources <ChevronRight className="w-3 h-3" /> <span className="text-brand-blue">Gujarat Board Syllabus</span>
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="px-6 py-2 border-r border-gray-100 flex flex-col items-center">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Items Selected</span>
                        <span className="text-xl font-black text-brand-blue">0</span>
                    </div>
                    <button className="px-8 py-3 bg-brand-blue text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-brand-blue/30 flex items-center gap-3 active:scale-95 transition-all">
                        <CheckCircle2 className="w-4 h-4" />
                        Build Paper Now
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 items-center">
                <div className="md:col-span-3 space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Standard Filter</label>
                    <select className="w-full px-5 py-3.5 bg-gray-50 border-0 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-brand-blue/5">
                        <option>Std 8 (Primary)</option>
                    </select>
                </div>
                <div className="md:col-span-3 space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Subject Area</label>
                    <select className="w-full px-5 py-3.5 bg-gray-50 border-0 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-brand-blue/5">
                        <option>Gujarati Language</option>
                    </select>
                </div>
                <div className="md:col-span-6 flex items-end">
                    <div className="relative w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                        <input type="text" placeholder="Search for keywords or concepts in Gujarati..." className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-0 rounded-2xl focus:ring-4 focus:ring-brand-blue/5 text-sm font-bold transition-all" />
                    </div>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={questions}
                pagination={{ currentPage: 1, totalPages: 124, onPageChange: (p) => console.log(p) }}
            />
        </div>
    );
};

export default TeacherQuestionsPage;
