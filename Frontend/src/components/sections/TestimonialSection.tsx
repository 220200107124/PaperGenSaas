import React, { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  // {
  //   name: "Bindiya Babariya",
  //   role: "CEO, HomeServe Pro",
  //   text: '"Working with Kryyvix was the best decision for our business. They understood our needs and delivered a website that truly represents our brand quality."',
  //   avatar: "https://i.pravatar.cc/150?u=bindiya",
  // },
  {
    name: "Rajeshbhai Patel",
    role: "Principal, Bright School",
    text: '"PaperGen has completely transformed how our teachers approach examinations. What used to take days now takes minutes."',
    // avatar: "https://i.pravatar.cc/150?u=a",
    avatar: "https://tse1.mm.bing.net/th/id/OIP.jS5TpucdX1Y0lo3Nw6lf7wHaHV?w=505&h=500&rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  {
    name: "Anjaliben Shah",
    role: "Snr Teacher, Vidya Sankul",
    text: '"The question bank quality is exceptional. It exactly matches the GSEB standards our students are tested on."',
    // avatar: "https://i.pravatar.cc/150?u=b",
    avatar: "https://tse1.mm.bing.net/th/id/OIP.jS5TpucdX1Y0lo3Nw6lf7wHaHV?w=505&h=500&rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  {
    name: "Maheshbhai Desai",
    role: "Vice Principal, Shree Academy",
    text: '"PaperGen saved our staff countless hours during exam season. The PDF output is clean and ready to print."',
    avatar: "https://tse1.mm.bing.net/th/id/OIP.jS5TpucdX1Y0lo3Nw6lf7wHaHV?w=505&h=500&rs=1&pid=ImgDetMain&o=7&rm=3",
    // avatar: "https://i.pravatar.cc/150?u=c",
  },
  {
    name: "Kavita Patel",
    role: "Teacher, Saraswati Vidyalaya",
    text: '"Adding custom questions is seamless and very easy to manage for daily use."',
    avatar: "https://tse1.mm.bing.net/th/id/OIP.jS5TpucdX1Y0lo3Nw6lf7wHaHV?w=505&h=500&rs=1&pid=ImgDetMain&o=7&rm=3",
    // avatar: "https://i.pravatar.cc/150?u=d",
  },
  {
    name: "Jignesh Mehta",
    role: "Coordinator, Sunrise School",
    text: '"We standardized our exam format across all classes. It brought consistency and saved a lot of effort."',
    avatar: "https://tse1.mm.bing.net/th/id/OIP.jS5TpucdX1Y0lo3Nw6lf7wHaHV?w=505&h=500&rs=1&pid=ImgDetMain&o=7&rm=3",
    // avatar: "https://i.pravatar.cc/150?u=e",
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <section className="py-20 sm:py-28 bg-[#FDFBF7] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Header */}
        <div className="mb-12 sm:mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-gray-900 tracking-tight leading-tight">
            Words from Our Partners
          </h2>
          <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto font-medium">
            The trust we earn is the work we're proudest of.
          </p>
        </div>

        {/* Slide Card Container */}
        <div className="bg-[#FAF6F0] rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-14 lg:p-16 text-center border border-[#F2ECE1] shadow-[0_15px_40px_-15px_rgba(28,25,23,0.05)] transition-all duration-500 ease-in-out transform hover:scale-[1.01] max-w-3xl mx-auto relative group">
          
          {/* Gold Star rating */}
          <div className="flex justify-center gap-1.5 text-amber-500 mb-8 sm:mb-10">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-5 sm:w-6 h-5 sm:h-6 fill-amber-500 stroke-amber-500" />
            ))}
          </div>

          {/* Testimonial Quote */}
          <blockquote className="text-xl sm:text-2xl md:text-3xl font-serif text-gray-800 italic leading-relaxed mb-8 sm:mb-12 max-w-2xl mx-auto">
            {testimonials[currentIndex].text}
          </blockquote>

          {/* Author Details */}
          <div className="flex items-center justify-center gap-4">
            <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
              <img
                src={testimonials[currentIndex].avatar}
                alt={testimonials[currentIndex].name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left">
              <span className="block font-black text-gray-900 text-base sm:text-lg leading-tight">
                {testimonials[currentIndex].name}
              </span>
              <span className="block text-xs sm:text-sm text-gray-500 font-medium">
                {testimonials[currentIndex].role}
              </span>
            </div>
          </div>

        </div>

        {/* Slide Controls */}
        <div className="flex items-center justify-center gap-6 mt-10">
          {/* Prev Button */}
          <button
            onClick={() => setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
            className="w-12 h-12 rounded-full border border-gray-200 bg-[#FAF6F0]/50 hover:bg-[#FAF6F0] text-gray-600 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Indicator Pills */}
          <div className="flex items-center gap-2.5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`transition-all duration-300 rounded-full ${
                  currentIndex === i
                    ? "w-8 h-2.5 bg-teal-700"
                    : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
            className="w-12 h-12 rounded-full border border-amber-500 bg-[#FAF6F0]/50 hover:bg-[#FAF6F0] text-amber-600 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
