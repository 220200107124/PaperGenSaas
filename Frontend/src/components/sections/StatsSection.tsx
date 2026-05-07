import React from "react";
import { GraduationCap, FileText, CheckCircle2, Users } from "lucide-react";

const stats = [
  { label: "Registered Schools", value: "500+", icon: GraduationCap },
  { label: "Exams Generated", value: "10,000+", icon: FileText },
  { label: "Verified Questions", value: "50,000+", icon: CheckCircle2 },
  { label: "Active Teachers", value: "2,500+", icon: Users },
];

const StatsSection: React.FC = () => {
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 bg-white p-8 sm:p-12 rounded-[2rem] sm:rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-gray-300/40 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/[0.02] to-transparent pointer-events-none"></div>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="flex flex-col items-center text-center space-y-2 sm:space-y-3 relative z-10"
            >
              <div className="w-12 sm:w-14 h-12 sm:h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-brand-blue mb-2 group-hover:scale-110 transition-transform duration-500">
                <Icon className="w-6 sm:w-7 h-6 sm:h-7" />
              </div>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tighter">
                {stat.value}
              </span>
              <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
    // <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
    //   <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 bg-white p-6 sm:p-10 md:p-12 rounded-3xl border shadow-sm">
    //     {stats.map((stat, i) => {
    //       const Icon = stat.icon;
    //       return (
    //         <div
    //           key={i}
    //           className="flex flex-col items-center text-center gap-2 sm:gap-3"
    //         >
    //           <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 rounded-xl flex items-center justify-center text-blue-600">
    //             <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
    //           </div>

    //           <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
    //             {stat.value}
    //           </span>

    //           <p className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">
    //             {stat.label}
    //           </p>
    //         </div>
    //       );
    //     })}
    //   </div>
    // </section>
  );
};

export default StatsSection;
