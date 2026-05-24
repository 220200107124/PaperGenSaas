import React from "react";
import { useNavigate } from "react-router-dom";

interface CTASectionProps {
  title: React.ReactNode;
  subtitle: string;
  buttonText: string;
  redirectPath: string;
}

const CTASection: React.FC<CTASectionProps> = ({
  title,
  subtitle,
  buttonText,
  redirectPath,
}) => {
  const navigate = useNavigate();

  return (
    <section className="">
      <div className="max-w-screen mx-auto bg-gray-900 px-6 sm:px-10 py-10 sm:py-12 text-center text-white shadow-xl relative overflow-hidden">

        {/* subtle background */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

        <div className="relative z-10 space-y-4 sm:space-y-6">
          
          {/* Title */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            {title}
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-blue-100/80 max-w-xl mx-auto">
            {subtitle}
          </p>

          {/* Button */}
          <div className="pt-2">
            <button
              onClick={() => navigate(redirectPath)}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-brand-blue rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:scale-105 active:scale-100 transition-all"
            >
              {buttonText}
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CTASection;

// import React from "react";
// import { useNavigate } from "react-router-dom";

// interface CTASectionProps {
//   title: React.ReactNode;
//   subtitle: string;
//   buttonText: string;
//   redirectPath: string;
// }

// const CTASection: React.FC<CTASectionProps> = ({
//   title,
//   subtitle,
//   buttonText,
//   redirectPath,
// }) => {
//   const navigate = useNavigate();

//   return (
//     <section className="py-16 sm:py-24 px-4 sm:px-6">
//       <div className="max-w-[1400px] mx-auto bg-brand-blue rounded-[3rem] sm:rounded-[4rem] p-8 sm:p-16 lg:p-24 xl:p-32 text-center text-white space-y-8 sm:space-y-10 shadow-2xl shadow-brand-blue/30 relative overflow-hidden group">
        
//         {/* Background Texture */}
//         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

//         {/* Content */}
//         <div className="relative z-10 space-y-4 sm:space-y-6">
          
//           <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-7xl font-black tracking-tight leading-tight">
//             {title}
//           </h2>

//           <p className="text-lg sm:text-xl text-blue-100/60 font-medium max-w-2xl mx-auto">
//             {subtitle}
//           </p>

//           <div className="pt-6 sm:pt-8">
//             <button
//               onClick={() => navigate(redirectPath)}
//               className="px-8 sm:px-12 py-4 sm:py-6 bg-white text-brand-blue rounded-2xl sm:rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:scale-110 active:scale-100 transition-all"
//             >
//               {buttonText}
//             </button>
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// };

// export default CTASection;