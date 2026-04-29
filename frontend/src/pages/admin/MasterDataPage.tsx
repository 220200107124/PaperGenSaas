import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, GraduationCap, Layout, ChevronRight, Layers, Trash2 } from 'lucide-react';
import Badge from '../../components/Badge';
import { masterDataService } from '../../api/masterDataService';
import type { Standard, Subject, Chapter } from '../../api/masterDataService';
import { clsx } from 'clsx';

const MasterDataPage: React.FC = () => {
    const [standards, setStandards] = useState<Standard[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [chapters, setChapters] = useState<Chapter[]>([]);

    const [selectedStandard, setSelectedStandard] = useState<Standard | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

    const [loading, setLoading] = useState(true);
    const [newItems, setNewItems] = useState({ standard: '', subject: '', chapter: '' });

    useEffect(() => {
        fetchStandards();
    }, []);

    useEffect(() => {
        if (selectedStandard) {
            fetchSubjects(selectedStandard.id);
            setSelectedSubject(null);
            setChapters([]);
        }
    }, [selectedStandard?.id]);

    useEffect(() => {
        if (selectedSubject) {
            fetchChapters(selectedSubject.id);
        }
    }, [selectedSubject?.id]);

    const fetchStandards = async () => {
        try {
            const data = await masterDataService.getStandards();
            setStandards(data || []);
            if (data?.length > 0 && !selectedStandard) setSelectedStandard(data[0]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSubjects = async (stdId: string) => {
        try {
            const data = await masterDataService.getSubjects(stdId);
            setSubjects(data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchChapters = async (subId: string) => {
        try {
            const data = await masterDataService.getChapters(subId);
            setChapters(data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddStandard = async () => {
        if (!newItems.standard.trim()) return;
        try {
            const newItem = await masterDataService.createStandard(newItems.standard);
            setStandards([...standards, newItem]);
            setNewItems({ ...newItems, standard: '' });
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddSubject = async () => {
        if (!newItems.subject.trim() || !selectedStandard) return;
        try {
            const newItem = await masterDataService.createSubject(newItems.subject, selectedStandard.id);
            setSubjects([...subjects, newItem]);
            setNewItems({ ...newItems, subject: '' });
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddChapter = async () => {
        if (!newItems.chapter.trim() || !selectedSubject) return;
        try {
            const newItem = await masterDataService.createChapter(newItems.chapter, selectedSubject.id);
            setChapters([...chapters, newItem]);
            setNewItems({ ...newItems, chapter: '' });
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="p-10 text-center font-bold text-gray-400 animate-pulse">Loading Master Data...</div>;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Academic Structure</h1>
                <p className="text-gray-400 font-black text-xs uppercase tracking-[0.2em]">Manage Standards, Subjects & Chapters</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Standards Column */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 flex flex-col min-h-[500px]">
                    <div className="p-6 md:p-8 border-b border-gray-50 bg-gray-50/30 rounded-t-[2.5rem] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <GraduationCap className="text-brand-blue w-5 h-5" />
                            <h3 className="text-lg font-black text-gray-900">Standards</h3>
                        </div>
                        <Badge variant="info" className="text-[10px] uppercase font-black">{standards.length}</Badge>
                    </div>

                    <div className="p-4 border-b border-gray-50">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="New Std (e.g. Std 5)"
                                value={newItems.standard}
                                onChange={e => setNewItems({ ...newItems, standard: e.target.value })}
                                className="flex-1 px-4 py-3 bg-gray-50 border-0 rounded-xl text-xs font-bold focus:ring-2 focus:ring-brand-blue/10 outline-none"
                            />
                            <button
                                onClick={handleAddStandard}
                                className="p-3 bg-brand-blue text-white rounded-xl shadow-lg shadow-brand-blue/20 hover:scale-105 active:scale-95 transition-all"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 p-4 space-y-2 overflow-y-auto">
                        {standards.map(std => (
                            <button
                                key={std.id}
                                onClick={() => setSelectedStandard(std)}
                                className={clsx(
                                    "w-full flex items-center justify-between p-4 rounded-2xl transition-all group",
                                    selectedStandard?.id === std.id
                                        ? "bg-brand-blue text-white shadow-xl shadow-brand-blue/20"
                                        : "bg-white text-gray-600 hover:bg-gray-50"
                                )}
                            >
                                <span className="text-sm font-black">{std.name}</span>
                                <ChevronRight className={clsx("w-4 h-4 transition-transform", selectedStandard?.id === std.id ? "translate-x-1" : "text-gray-300")} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Subjects Column */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 flex flex-col min-h-[500px]">
                    <div className="p-6 md:p-8 border-b border-gray-50 bg-gray-50/30 rounded-t-[2.5rem] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <BookOpen className="text-brand-orange w-5 h-5 font-bold" />
                            <h3 className="text-lg font-black text-gray-900">Subjects <span className="text-gray-400 text-xs ml-2">in {selectedStandard?.name}</span></h3>
                        </div>
                        <Badge variant="warning" className="text-[10px] uppercase font-black">{subjects.length}</Badge>
                    </div>

                    <div className="p-4 border-b border-gray-50">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="New Subject (e.g. Gujarati)"
                                value={newItems.subject}
                                onChange={e => setNewItems({ ...newItems, subject: e.target.value })}
                                className="flex-1 px-4 py-3 bg-gray-50 border-0 rounded-xl text-xs font-bold focus:ring-2 focus:ring-brand-blue/10 outline-none"
                            />
                            <button
                                onClick={handleAddSubject}
                                className="p-3 bg-brand-orange text-white rounded-xl shadow-lg shadow-brand-orange/20 hover:scale-105 active:scale-95 transition-all"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 p-4 space-y-2 overflow-y-auto">
                        {!selectedStandard ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-300 p-10 text-center">
                                <Layers className="w-12 h-12 mb-4 opacity-20" />
                                <p className="text-xs font-black uppercase tracking-widest">Select a standard first</p>
                            </div>
                        ) : subjects.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-300 p-10 text-center">
                                <p className="text-xs font-black uppercase tracking-widest">No subjects added</p>
                            </div>
                        ) : (
                            subjects.map(sub => (
                                <button
                                    key={sub.id}
                                    onClick={() => setSelectedSubject(sub)}
                                    className={clsx(
                                        "w-full flex items-center justify-between p-4 rounded-2xl transition-all group",
                                        selectedSubject?.id === sub.id
                                            ? "bg-brand-orange text-white shadow-xl shadow-brand-orange/20"
                                            : "bg-white text-gray-600 hover:bg-gray-50"
                                    )}
                                >
                                    <span className="text-sm font-black">{sub.name}</span>
                                    <ChevronRight className={clsx("w-4 h-4 transition-transform", selectedSubject?.id === sub.id ? "translate-x-1" : "text-gray-300")} />
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Chapters Column */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 flex flex-col min-h-[500px]">
                    <div className="p-6 md:p-8 border-b border-gray-50 bg-gray-50/30 rounded-t-[2.5rem] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Layout className="text-green-600 w-5 h-5 font-bold" />
                            <h3 className="text-lg font-black text-gray-900">Chapters <span className="text-gray-400 text-xs ml-2">in {selectedSubject?.name}</span></h3>
                        </div>
                        <Badge variant="success" className="text-[10px] uppercase font-black">{chapters.length}</Badge>
                    </div>

                    <div className="p-4 border-b border-gray-50">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="New Chapter (e.g. Chapter 1)"
                                value={newItems.chapter}
                                onChange={e => setNewItems({ ...newItems, chapter: e.target.value })}
                                className="flex-1 px-4 py-3 bg-gray-50 border-0 rounded-xl text-xs font-bold focus:ring-2 focus:ring-brand-blue/10 outline-none"
                            />
                            <button
                                onClick={handleAddChapter}
                                className="p-3 bg-green-600 text-white rounded-xl shadow-lg shadow-green-600/20 hover:scale-105 active:scale-95 transition-all"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 p-4 space-y-2 overflow-y-auto">
                        {!selectedSubject ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-300 p-10 text-center">
                                <Layers className="w-12 h-12 mb-4 opacity-20" />
                                <p className="text-xs font-black uppercase tracking-widest">Select a subject first</p>
                            </div>
                        ) : chapters.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-300 p-10 text-center">
                                <p className="text-xs font-black uppercase tracking-widest">No chapters added</p>
                            </div>
                        ) : (
                            chapters.map(ch => (
                                <div
                                    key={ch.id}
                                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-white text-gray-600 border border-gray-50 hover:border-green-100 hover:bg-green-50/30 transition-all group"
                                >
                                    <span className="text-sm font-bold font-gujarati">{ch.name}</span>
                                    <button className="p-1.5 text-gray-300 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MasterDataPage;
