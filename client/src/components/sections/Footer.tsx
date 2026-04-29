// import React from 'react';
import { GraduationCap, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
return (
<footer className="bg-white border-t border-gray-100 pt-16 pb-8">
<div className="max-w-7xl mx-auto px-4 sm:px-6">

    {/* Top Section */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b">

      {/* Brand */}
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-gray-900">PaperGen</span>
        </div>

        <p className="text-sm text-gray-500 leading-relaxed">
          The premier SaaS platform for Gujarati Medium schools. Simplifying exam paper creation across institutions.
        </p>

        <div className="flex gap-3">
          {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
            <div
              key={i}
              className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:text-blue-600 cursor-pointer"
            >
              <Icon className="w-4 h-4" />
            </div>
          ))}
        </div>
      </div>

      {/* Platform */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-5">
          Platform
        </h4>
        <ul className="space-y-3 text-sm text-gray-500">
          <li><a href="#">Features</a></li>
          <li><a href="/pricing">Pricing</a></li>
          <li><a href="/documentations">Documentation</a></li>
          <li><a href="/updates">Updates</a></li>
        </ul>
      </div>

      {/* Company */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-5">
          Company
        </h4>
        <ul className="space-y-3 text-sm text-gray-500">
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/careers">Careers</a></li>
          <li><a href="/security">Security</a></li>
        </ul>
      </div>

      {/* Contact */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-5">
          Contact
        </h4>
        <ul className="space-y-4 text-sm text-gray-500">
          <li>Surat, Gujarat, India</li>
          <li><a href="mailTo:support@papergen.com">support@papergen.com</a></li>
        </ul>
      </div>

    </div>

    {/* Bottom Section */}
    <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
      <span>© 2026 PaperGen Technologies. All rights reserved.</span>

      <div className="flex gap-6">
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="/terms">Terms of Service</a>
      </div>
    </div>

  </div>
</footer>

);
};

export default Footer;


// import React from 'react';
// import { GraduationCap, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

// const Footer = () => {
// return (
// <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
// <div className="max-w-7xl mx-auto px-4 sm:px-6">

//     {/* Grid Layout */}
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b">

//       {/* Row 1 - Full width */}
//       <div className="sm:col-span-2 md:col-span-4 space-y-5">
//         <div className="flex items-center gap-2">
//           <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
//             <GraduationCap className="text-white w-5 h-5" />
//           </div>
//           <span className="font-bold text-lg text-gray-900">PaperGen</span>
//         </div>

//         <p className="text-sm text-gray-500 max-w-xl">
//           The premier SaaS platform for Gujarati Medium schools. Simplifying exam paper creation across institutions.
//         </p>

//         <div className="flex gap-3">
//           {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
//             <div
//               key={i}
//               className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:text-blue-600 cursor-pointer"
//             >
//               <Icon className="w-4 h-4" />
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Row 2 - Two columns */}
//       <div>
//         <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-5">
//           Platform
//         </h4>
//         <ul className="space-y-3 text-sm text-gray-500">
//           <li>Features</li>
//           <li>Pricing</li>
//           <li>Documentation</li>
//           <li>Updates</li>
//         </ul>
//       </div>

//       <div>
//         <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-5">
//           Company
//         </h4>
//         <ul className="space-y-3 text-sm text-gray-500">
//           <li>About</li>
//           <li>Contact</li>
//           <li>Careers</li>
//           <li>Security</li>
//         </ul>
//       </div>

//       {/* Row 3 - Full width */}
//       <div className="sm:col-span-2 md:col-span-4">
//         <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-5">
//           Contact
//         </h4>
//         <ul className="space-y-3 text-sm text-gray-500">
//           <li>Surat, Gujarat, India</li>
//           <li>support@papergen.com</li>
//         </ul>
//       </div>

//     </div>

//     {/* Bottom */}
//     <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
//       <span>© 2026 PaperGen Technologies. All rights reserved.</span>

//       <div className="flex gap-6">
//         <span>Privacy Policy</span>
//         <span>Terms of Service</span>
//       </div>
//     </div>

//   </div>
// </footer>

// );
// };

// export default Footer;