// import { useState } from "react";
// interface Option {
//   value: string;
//   label: string;
// }

// interface CustomSelectProps {
//   options: Option[];
//   value: string;
//   onChange: (value: string) => void;
//   placeholder?: string;
// }

// const CustomSelect = ({ options, value, onChange, placeholder }) => {
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="relative w-full">
//       <button
//         type="button"
//         onClick={() => setOpen(!open)}
//         className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-left font-bold"
//       >
//         {options.find(o => o.value === value)?.label || placeholder}
//       </button>

//       {open && (
//         <div className="absolute z-50 mt-2 w-full max-h-60 overflow-y-auto bg-white border rounded-2xl shadow-xl">
//           {options.map(opt => (
//             <div
//               key={opt.value}
//               onClick={() => {
//                 onChange(opt.value);
//                 setOpen(false);
//               }}
//               className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm"
//             >
//               {opt.label}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomSelect;
import React, { useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
}) => {
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative w-full">
      {/* Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full px-4 py-3 sm:px-5 sm:py-4 bg-gray-50 rounded-2xl text-left text-sm font-bold border border-transparent focus:outline-none focus:ring-4 focus:ring-brand-blue/5"
      >
        {selected ? selected.label : placeholder}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 w-full max-h-60 overflow-y-auto bg-white border border-gray-100 rounded-2xl shadow-xl">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;