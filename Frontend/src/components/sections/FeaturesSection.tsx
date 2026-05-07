
import React from "react";
import { BookOpen, FileText, ShieldCheck } from "lucide-react";

const features = [
  {
    title: "GSEB Question Bank",
    desc: "Over 50,000+ verified questions spanning Std 1 to 8, specifically designed for Gujarati Medium schools.",
    icon: BookOpen,
    color: "blue",
  },
  {
    title: "Smart PDF Builder",
    desc: "Automatic layout engine that styles your papers professionally. Ready to print, no formatting required.",
    icon: FileText,
    color: "orange",
  },
  {
    title: "School Control Panel",
    desc: "Complete isolation for your school data. Manage teachers, private questions, and subscriptions easily.",
    icon: ShieldCheck,
    color: "green",
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section
      id="features"
      className="max-w-[1400px] mx-auto px-4 sm:px-6 py-16 sm:py-24"
    >
      {/* Heading */}
      <div className="text-center space-y-4 mb-16 sm:mb-20">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
          Everything You Need
        </h2>
        <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs">
          Powerful features to automate your academic workflow
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-10">
        {features.map((feature, i) => {
          const Icon = feature.icon;

          return (
            <div
              key={i}
              className="bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border border-gray-100 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden"
            >
              {/* Background Glow */}
              <div
                className={`absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-${feature.color}-500/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700`}
              />

              {/* ICON + HEADING (FIXED HERE) */}
              <div className="flex items-center gap-4 mb-4 sm:mb-6">
                <div
                  className={`w-12 sm:w-14 h-12 sm:h-14 bg-${feature.color}-50 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform shadow-lg shadow-blue-100/50`}
                >
                  <Icon
                    className={`text-${feature.color}-600 w-6 sm:w-7 h-6 sm:h-7`}
                  />
                </div>

                <h3 className="text-lg sm:text-xl font-black text-gray-900">
                  {feature.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-gray-500 leading-relaxed font-medium text-sm sm:text-base">
                {feature.desc}
              </p>

              {/* Bottom Line */}
              <div className="pt-6 sm:pt-8">
                <div
                  className={`h-1 w-10 sm:w-12 bg-${feature.color}-500 rounded-full`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturesSection;


// import React from "react";
// import { BookOpen, FileText, ShieldCheck } from "lucide-react";

// const features = [
//   {
//     title: "GSEB Question Bank",
//     desc: "Over 50,000+ verified questions spanning Std 1 to 8, specifically designed for Gujarati Medium schools.",
//     icon: BookOpen,
//   },
//   {
//     title: "Smart PDF Builder",
//     desc: "Automatic layout engine that styles your papers professionally. Ready to print, no formatting required.",
//     icon: FileText,
//   },
//   {
//     title: "School Control Panel",
//     desc: "Complete isolation for your school data. Manage teachers, private questions, and subscriptions easily.",
//     icon: ShieldCheck,
//   },
// ];

// const FeaturesSection: React.FC = () => {
//   return (
//     <section
//       id="features"
//       className="max-w-[1400px] mx-auto px-4 sm:px-6 py-16 sm:py-24"
//     >
//       <div className="text-center space-y-4 mb-16 sm:mb-20">
//         <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
//           Everything You Need
//         </h2>
//         <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs">
//           Powerful features to automate your academic workflow
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-10">
//         <div className="bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border border-gray-100 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden">
//           <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-blue-500/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
//           <div className="w-12 sm:w-16 h-12 sm:h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 sm:mb-8 group-hover:rotate-12 transition-transform shadow-lg shadow-blue-100/50">
//             <BookOpen className="text-blue-600 w-6 sm:w-8 h-6 sm:h-8" />
//           </div>
//           <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-3 sm:mb-4">
//             GSEB Question Bank
//           </h3>
//           <p className="text-gray-500 leading-relaxed font-medium text-sm sm:text-base">
//             Over 50,000+ verified questions spanning Std 1 to 8, specifically
//             designed for Gujarati Medium schools.
//           </p>
//           <div className="pt-6 sm:pt-8">
//             <div className="h-1 w-10 sm:w-12 bg-blue-500 rounded-full"></div>
//           </div>
//         </div>

//         <div className="bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border border-gray-100 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden">
//           <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-orange-500/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
//           <div className="w-12 sm:w-16 h-12 sm:h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 sm:mb-8 group-hover:rotate-12 transition-transform shadow-lg shadow-orange-100/50">
//             <FileText className="text-orange-600 w-6 sm:w-8 h-6 sm:h-8" />
//           </div>
//           <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-3 sm:mb-4">
//             Smart PDF Builder
//           </h3>
//           <p className="text-gray-500 leading-relaxed font-medium text-sm sm:text-base">
//             Automatic layout engine that styles your papers professionally.
//             Ready to print, no formatting required.
//           </p>
//           <div className="pt-6 sm:pt-8">
//             <div className="h-1 w-10 sm:w-12 bg-orange-500 rounded-full"></div>
//           </div>
//         </div>

//         <div className="bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border border-gray-100 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden md:col-span-2 xl:col-span-1">
//           <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-green-500/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
//           <div className="w-12 sm:w-16 h-12 sm:h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6 sm:mb-8 group-hover:rotate-12 transition-transform shadow-lg shadow-green-100/50">
//             <ShieldCheck className="text-green-600 w-6 sm:w-8 h-6 sm:h-8" />
//           </div>
//           <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-3 sm:mb-4">
//             School Control Panel
//           </h3>
//           <p className="text-gray-500 leading-relaxed font-medium text-sm sm:text-base">
//             Complete isolation for your school data. Manage teachers, private
//             questions, and subscriptions easily.
//           </p>
//           <div className="pt-6 sm:pt-8">
//             <div className="h-1 w-10 sm:w-12 bg-green-500 rounded-full"></div>
//           </div>
//         </div>
//       </div>
//     </section>
//     // <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
//     //   {/* Heading */}
//     //   <div className="text-center mb-12 sm:mb-16 space-y-3">
//     //     <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900">
//     //       Everything You Need
//     //     </h2>
//     //     <p className="text-gray-500 text-xs sm:text-sm font-semibold uppercase tracking-widest">
//     //       Powerful features to automate your academic workflow
//     //     </p>
//     //   </div>

//     //   {/* Cards */}
//     //   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
//     //     {features.map((feature, i) => {
//     //       const Icon = feature.icon;
//     //       return (
//     //         <div
//     //           key={i}
//     //           className="bg-white p-6 sm:p-8 rounded-2xl border shadow-sm hover:shadow-md transition"
//     //         >
//     //           <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-5">
//     //             <Icon className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6" />
//     //           </div>

//     //           <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
//     //             {feature.title}
//     //           </h3>

//     //           <p className="text-gray-500 text-sm leading-relaxed">
//     //             {feature.desc}
//     //           </p>
//     //         </div>
//     //       );
//     //     })}
//     //   </div>
//     // </section>
//   );
// };

// export default FeaturesSection;
