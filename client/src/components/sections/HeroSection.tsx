import React from "react";
import { useNavigate } from "react-router-dom";
import { Award, ArrowRight } from "lucide-react";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-[0.03]">
        <div className="absolute w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-brand-blue rounded-full blur-[120px] -top-20 -left-20"></div>
        <div className="absolute w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-brand-orange rounded-full blur-[120px] bottom-0 right-0"></div>
      </div>

      <div className="max-w-[1400px] mx-auto text-center space-y-6 sm:space-y-8">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white rounded-full border border-gray-100 shadow-sm mb-4 animate-bounce">
          <Award className="text-brand-orange w-4 h-4" />
          <span className="text-xs font-black text-gray-900 uppercase tracking-widest">
            #1 SaaS for GSEB Schools
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-7xl font-black text-gray-900 tracking-tight leading-[1.1] line-height-[4px] max-w-5xl mx-auto">
          Empowering Schools <br />with{" "} 
          <span className="text-brand-blue relative">Smart Exams</span>.
        </h1>
        <p className="text-lg sm:text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed pt-2 px-4">
          Create professional, curriculum-aligned Gujarati Medium question
          papers in minutes. Standardized exams, simplified for every teacher.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-8 sm:pt-10">
          <button
            onClick={() => navigate("/school-register")}
            className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-brand-blue text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-brand-blue/40 hover:bg-blue-800 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group active:translate-y-0"
          >
            Register Your School
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <div className="flex items-center -space-x-4 mt-4 sm:mt-0">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-10 sm:w-12 h-10 sm:h-12 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-sm"
              >
                <img
                  src={`https://i.pravatar.cc/150?u=${i + 10}`}
                  alt="user"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            <div className="pl-4 sm:pl-6 flex flex-col items-start leading-none">
              <span className="text-sm font-black text-gray-900">
                2,500+ Teachers
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Growing Daily
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
    // <section className="relative pt-16 sm:pt-20 md:pt-24 pb-12 px-4 sm:px-6 overflow-hidden">
    //   {/* Background Blur */}
    //   <div className="absolute inset-0 -z-10 opacity-[0.05]">
    //     <div className="absolute w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-500 rounded-full blur-[100px] -top-10 -left-10"></div>
    //     <div className="absolute w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-orange-400 rounded-full blur-[100px] bottom-0 right-0"></div>
    //   </div>

    //   <div className="max-w-7xl mx-auto text-center space-y-6 sm:space-y-8">
    //     {/* Badge */}
    //     <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white rounded-full border shadow-sm">
    //       <Award className="text-orange-500 w-4 h-4" />
    //       <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">
    //         #1 SaaS for GSEB Schools
    //       </span>
    //     </div>

    //     {/* Heading */}
    //     <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-tight max-w-4xl mx-auto">
    //       Empowering Schools with <span className="text-blue-600">Smart Exams</span>.
    //     </h1>

    //     {/* Description */}
    //     <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
    //       Create professional, curriculum-aligned Gujarati Medium question papers in minutes. Standardized exams, simplified for every teacher.
    //     </p>

    //     {/* Buttons */}
    //     <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-4 sm:pt-6">
    //       <button
    //         onClick={() => navigate('/school-register')}
    //         className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-xl font-bold text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition"
    //       >
    //         Register Your School
    //         <ArrowRight className="w-4 h-4" />
    //       </button>

    //       {/* Users Preview */}
    //       <div className="flex items-center -space-x-3 sm:-space-x-4">
    //         {[1, 2, 3, 4].map((i) => (
    //           <div
    //             key={i}
    //             className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 sm:border-4 border-white bg-gray-200 overflow-hidden"
    //           >
    //             <img
    //               src={`https://i.pravatar.cc/150?u=${i + 10}`}
    //               alt="user"
    //               className="w-full h-full object-cover"
    //             />
    //           </div>
    //         ))}

    //         <div className="pl-3 sm:pl-5 text-left">
    //           <span className="block text-xs sm:text-sm font-bold text-gray-900">
    //             2,500+ Teachers
    //           </span>
    //           <span className="block text-[10px] text-gray-400 uppercase tracking-widest">
    //             Growing Daily
    //           </span>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </section>
  );
};

export default HeroSection;
