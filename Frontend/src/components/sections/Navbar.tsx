import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center shadow-lg shadow-brand-blue/20 group-hover:rotate-6 transition-transform">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          <div>
            <span className="font-black text-xl text-gray-900 leading-tight block mb-[2px]">
              PaperGen
            </span>
            <span className="text-[10px] uppercase tracking-widest font-black text-brand-blue/60 block -mt-1">
              Gujarati Medium
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm font-bold text-gray-600 hover:text-brand-blue transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-sm font-bold text-gray-600 hover:text-brand-blue transition-colors"
          >
            How it Works
          </a>
          <a
            href="#faqs"
            className="text-sm font-bold text-gray-600 hover:text-brand-blue transition-colors"
          >
            FAQs
          </a>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          {/* <button onClick={() => navigate('/login')} className="sm:hidden text-sm font-bold text-gray-600 hover:text-brand-blue transition-colors px-2 lg:px-4 py-2">
                                Sign In
                            </button> */}
          <button
            onClick={() => navigate("/login")}
            className="hidden sm:inline-block text-sm font-bold text-gray-800 hover:text-brand-blue transition-colors px-2 lg:px-4 py-[10px] bg-gray-200 rounded-xl"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/school-register")}
            className="hidden md:block px-4 lg:px-6 py-3 bg-brand-blue text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-blue/20 hover:bg-blue-800 transition-all active:scale-95"
          >
            Get Started
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-500 hover:text-brand-blue transition-colors"
          >
            <span className="block w-5 h-0.5 bg-current mb-1.5 rounded-full"></span>
            <span className="block w-5 h-0.5 bg-current mb-1.5 rounded-full"></span>
            <span className="block w-5 h-0.5 bg-current rounded-full"></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-lg py-4 px-4 sm:px-6 flex flex-col gap-4 animate-in slide-in-from-top-4 z-40">
          <a
            href="#features"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-base font-bold text-gray-600 hover:text-brand-blue transition-colors py-2 border-b border-gray-50"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-base font-bold text-gray-600 hover:text-brand-blue transition-colors py-2 border-b border-gray-50"
          >
            How it Works
          </a>
          <a
            href="#faqs"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-base font-bold text-gray-600 hover:text-brand-blue transition-colors py-2 border-b border-gray-50"
          >
            FAQs
          </a>
          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate("/login");
              }}
              className="w-full text-center font-bold text-gray-800 hover:text-brand-blue transition-colors py-3 bg-gray-200 rounded-xl"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate("/school-register");
              }}
              className="w-full text-center text-white font-bold bg-brand-blue hover:bg-blue-800 transition-colors py-4 rounded-xl shadow-lg shadow-brand-blue/20 uppercase tracking-widest text-xs"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
    // <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
    //   <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
    //     {/* Logo */}
    //     <div
    //       className="flex items-center gap-2 cursor-pointer"
    //       onClick={() => navigate('/')}
    //     >
    //       <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
    //         <GraduationCap className="text-white w-5 h-5" />
    //       </div>
    //       <span className="font-bold text-lg text-gray-900">PaperGen</span>
    //     </div>

    //     {/* Desktop Menu */}
    //     <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
    //       <a href="#features" className="hover:text-blue-600">Features</a>
    //       <a href="#how-it-works" className="hover:text-blue-600">How it Works</a>
    //       <a href="#faqs" className="hover:text-blue-600">FAQs</a>
    //     </nav>

    //     {/* Right Actions */}
    //     <div className="hidden md:flex items-center gap-4">
    //       <button
    //         onClick={() => navigate('/login')}
    //         className="text-sm font-semibold text-gray-600 hover:text-blue-600"
    //       >
    //         Sign In
    //       </button>
    //       <button
    //         onClick={() => navigate('/school-register')}
    //         className="px-5 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-blue-700"
    //       >
    //         Get Started
    //       </button>
    //     </div>

    //     {/* Mobile Toggle */}
    //     <button
    //       className="md:hidden"
    //       onClick={() => setIsOpen(!isOpen)}
    //     >
    //       {isOpen ? <X /> : <Menu />}
    //     </button>
    //   </div>

    //   {/* Mobile Menu */}
    //   {isOpen && (
    //     <div className="md:hidden px-4 pb-4 space-y-4 border-t bg-white">
    //       <a href="#features" className="block text-gray-700">Features</a>
    //       <a href="#how-it-works" className="block text-gray-700">How it Works</a>
    //       <a href="#faqs" className="block text-gray-700">FAQs</a>

    //       <div className="pt-4 border-t flex flex-col gap-3">
    //         <button
    //           onClick={() => navigate('/login')}
    //           className="w-full text-left text-gray-700"
    //         >
    //           Sign In
    //         </button>
    //         <button
    //           onClick={() => navigate('/school-register')}
    //           className="w-full bg-blue-600 text-white py-2 rounded-lg"
    //         >
    //           Get Started
    //         </button>
    //       </div>
    //     </div>
    //   )}
    // </header>
  );
};

export default Navbar;
