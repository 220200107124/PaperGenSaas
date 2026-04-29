// import React from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Rajeshbhai Patel",
    role: "Principal, Bright School",
    text: '"PaperGen has completely transformed how our teachers approach examinations. What used to take days now takes minutes."',
    avatar: "https://i.pravatar.cc/150?u=a",
  },
  {
    name: "Anjaliben Shah",
    role: "Snr Teacher, Vidya Sankul",
    text: '"The question bank quality is exceptional. It exactly matches the GSEB standards our students are tested on."',
    avatar: "https://i.pravatar.cc/150?u=b",
  },
  {
    name: "Maheshbhai Desai",
    role: "Vice Principal, Shree Academy",
    text: '"PaperGen saved our staff countless hours during exam season. The PDF output is clean and ready to print."',
    avatar: "https://i.pravatar.cc/150?u=c",
  },
  {
    name: "Kavita Patel",
    role: "Teacher, Saraswati Vidyalaya",
    text: '"Adding custom questions is seamless and very easy to manage for daily use."',
    avatar: "https://i.pravatar.cc/150?u=d",
  },
  {
    name: "Jignesh Mehta",
    role: "Coordinator, Sunrise School",
    text: '"We standardized our exam format across all classes. It brought consistency and saved a lot of effort."',
    avatar: "https://i.pravatar.cc/150?u=e",
  },
  {
    name: "Pooja Trivedi",
    role: "Teacher, Knowledge Hub School",
    text: '"The platform is simple yet powerful. Even non-tech teachers started using it without any training."',
    avatar: "https://i.pravatar.cc/150?u=f",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 sm:py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <div className="mb-12">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white">
            Trusted by Leading Schools
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm font-semibold uppercase tracking-widest mt-3">
            Join the digital revolution in education
          </p>
        </div>

        {/* GRID: 3 columns on desktop → EXACT 2 rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <div
              key={i}
              className="bg-white/10 p-6 rounded-2xl text-left border border-white/10"
            >
              {/* Stars */}
              <div className="flex gap-1 text-yellow-400 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-yellow-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-white text-base font-semibold italic leading-relaxed">
                {item.text}
              </p>

              {/* User */}
              <div className="flex items-center gap-4 mt-6">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <span className="block text-white font-semibold text-sm">
                    {item.name}
                  </span>
                  <span className="block text-gray-400 text-xs uppercase tracking-widest">
                    {item.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

// import React from 'react';
// import { Star } from 'lucide-react';

// const testimonials = [
//   {
//     name: 'Rajeshbhai Patel',
//     role: 'Principal, Bright School',
//     text: '"PaperGen has completely transformed how our teachers approach examinations. What used to take days now takes minutes."',
//     avatar: 'https://i.pravatar.cc/150?u=a'
//   },
//   {
//     name: 'Anjaliben Shah',
//     role: 'Snr Teacher, Vidya Sankul',
//     text: '"The question bank quality is exceptional. It exactly matches the GSEB standards our students are tested on."',
//     avatar: 'https://i.pravatar.cc/150?u=b'
//   },
//   {
//     name: 'Maheshbhai Desai',
//     role: 'Vice Principal, Shree Academy',
//     text: '"PaperGen saved our staff countless hours during exam season. The PDF output is clean, consistent, and ready to print every time."',
//     avatar: 'https://i.pravatar.cc/150?u=c'
//   },
//   {
//     name: 'Kavita Patel',
//     role: 'Teacher, Saraswati Vidyalaya',
//     text: '"Adding custom questions is seamless, and organizing sections is very intuitive. It fits perfectly with our daily workflow."',
//     avatar: 'https://i.pravatar.cc/150?u=d'
//   }
// ];

// const Testimonials: React.FC = () => {
//   return (
//     <section className="py-16 sm:py-20 bg-gray-900">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">

//         {/* Heading */}
//         <div className="mb-10 sm:mb-14">
//           <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white">
//             Trusted by Leading Schools
//           </h2>
//           <p className="text-gray-400 text-xs sm:text-sm font-semibold uppercase tracking-widest mt-3">
//             Join the digital revolution in education
//           </p>
//         </div>

//         {/* Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
//           {testimonials.map((item, i) => (
//             <div
//               key={i}
//               className="bg-white/10 backdrop-blur-sm p-6 sm:p-8 rounded-2xl text-left border border-white/10"
//             >
//               {/* Stars */}
//               <div className="flex gap-1 text-yellow-400 mb-4">
//                 {[1, 2, 3, 4, 5].map((s) => (
//                   <Star key={s} className="w-4 h-4 fill-yellow-400" />
//                 ))}
//               </div>

//               {/* Text */}
//               <p className="text-white text-base sm:text-lg font-semibold italic leading-relaxed">
//                 {item.text}
//               </p>

//               {/* User */}
//               <div className="flex items-center gap-4 mt-6">
//                 <img
//                   src={item.avatar}
//                   alt={item.name}
//                   className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
//                 />
//                 <div>
//                   <span className="block text-white font-semibold text-sm sm:text-base">
//                     {item.name}
//                   </span>
//                   <span className="block text-gray-400 text-xs uppercase tracking-widest">
//                     {item.role}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//       </div>
//     </section>
//   );
// };

// export default Testimonials;
