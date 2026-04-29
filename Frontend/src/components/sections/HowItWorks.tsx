import React from "react";
import { Zap, BookOpen, CheckCircle2, FileText } from "lucide-react";

const steps = [
  {
    title: "Quick Registration",
    desc: "Sign up your school or as an individual teacher in under 2 minutes.",
    icon: Zap,
    color: "bg-yellow-50 text-yellow-600",
  },
  {
    title: "Choose Subject & Std",
    desc: "Select from our pre-configured GSEB curriculum (Std 1-8).",
    icon: BookOpen,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Pick Questions",
    desc: "Browse our extensive bank or add your own custom questions.",
    icon: CheckCircle2,
    color: "bg-green-50 text-green-600",
  },
  {
    title: "Download PDF",
    desc: "Generate a perfectly formatted, ready-to-print paper with your school logo.",
    icon: FileText,
    color: "bg-purple-50 text-purple-600",
  },
];

// const steps = [
//   {
//     title: "Quick Registration",
//     desc: "Sign up your school or as an individual teacher in under 2 minutes.",
//     icon: Zap,
//   },
//   {
//     title: "Choose Subject & Std",
//     desc: "Select from our pre-configured GSEB curriculum (Std 1-8).",
//     icon: BookOpen,
//   },
//   {
//     title: "Pick Questions",
//     desc: "Browse our extensive bank or add your own custom questions.",
//     icon: CheckCircle2,
//   },
//   {
//     title: "Download PDF",
//     desc: "Generate a perfectly formatted, ready-to-print paper with your school logo.",
//     icon: FileText,
//   },
// ];

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="bg-white py-16 sm:py-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          <div className="flex-1 space-y-6 sm:space-y-8">
            <div className="space-y-4 text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 tracking-tight leading-tight">
                4 Steps to Your Perfect Question Paper.
              </h2>
              <p className="text-lg sm:text-xl text-gray-500 font-medium leading-relaxed">
                We've eliminated the manual labor. Focus on teaching, let us
                handle the formatting.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-6 sm:pt-8">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div
                    key={i}
                    className="flex gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gray-50 border border-gray-100"
                  >
                    <div
                      className={`w-12 sm:w-14 h-12 sm:h-14 ${step.color} rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-black/5`}
                    >
                      <Icon className="w-6 sm:w-7 h-6 sm:h-7" />
                    </div>
                    <div className="space-y-1 pt-1">
                      <h4 className="font-black text-gray-900 text-sm sm:text-base">
                        {step.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-500 leading-snug">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex-1 w-full max-w-lg lg:max-w-2xl">
            <div className="relative aspect-square lg:aspect-[4/5] bg-bg-gray rounded-[3rem] sm:rounded-[4rem] border-4 sm:border-8 border-gray-50 shadow-inner overflow-hidden group h-[500px] w-full sm:h-full md:h-full lg:h-full">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/10 to-transparent p-8 sm:p-12">
                <div className="bg-white w-full h-full rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl p-6 sm:p-10 space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 transform">
                  <div className="h-10 sm:h-12 w-2/3 bg-gray-100 rounded-xl"></div>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="h-3 sm:h-4 w-full bg-gray-50 rounded-full"></div>
                    <div className="h-3 sm:h-4 w-full bg-gray-50 rounded-full"></div>
                    <div className="h-3 sm:h-4 w-1/2 bg-gray-50 rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-6 sm:pt-10  group-hover:scale-[1.02] transition-transform">
                    <div className="h-32 sm:h-40 bg-gray-50 rounded-2xl sm:rounded-3xl border border-dashed border-gray-200 flex items-center justify-center">
                      <FileText className="text-gray-200 w-8 sm:w-12 h-8 sm:h-12" />
                    </div>
                    <div className="h-32 sm:h-40 bg-gray-50 rounded-2xl sm:rounded-3xl border border-dashed border-gray-200 flex items-center justify-center">
                      <FileText className="text-gray-200 w-8 sm:w-12 h-8 sm:h-12" />
                    </div>
                  </div>
                  <div className="absolute w-60 top-4/5 -translate-x-1/2 left-1/2 h-10 sm:h-14 bg-brand-blue rounded-2xl shadow-xl shadow-brand-blue/30 flex items-center justify-center px-6 sm:px-8 text-white font-black text-xs uppercase tracking-widest hover:scale-102 transition-all duration-300">
                    Generated PDF
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    // <section id="how-it-works" className="bg-white py-16 sm:py-20">
    //   <div className="max-w-7xl mx-auto px-4 sm:px-6">

    //     {/* Heading */}
    //     <div className="text-center md:text-left mb-10 sm:mb-14">
    //       <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
    //         4 Steps to Your Perfect Question Paper.
    //       </h2>
    //       <p className="text-gray-500 mt-3 text-sm sm:text-base max-w-xl">
    //         We've eliminated the manual labor. Focus on teaching, let us handle the formatting.
    //       </p>
    //     </div>

    //     {/* Steps */}
    //     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    //       {steps.map((step, i) => {
    //         const Icon = step.icon;
    //         return (
    //           <div
    //             key={i}
    //             className="flex gap-4 p-5 sm:p-6 bg-gray-50 rounded-xl border"
    //           >
    //             <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
    //               <Icon className="w-5 h-5 text-blue-600" />
    //             </div>

    //             <div>
    //               <h4 className="font-semibold text-gray-900">
    //                 {step.title}
    //               </h4>
    //               <p className="text-sm text-gray-500 mt-1 leading-relaxed">
    //                 {step.desc}
    //               </p>
    //             </div>
    //           </div>
    //         );
    //       })}
    //     </div>

    //   </div>
    // </section>
  );
};

export default HowItWorks;
