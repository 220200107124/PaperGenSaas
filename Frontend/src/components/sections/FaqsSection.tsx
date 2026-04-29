import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Is PaperGen aligned with the current GSEB curriculum?",
    a: "Yes, our question bank is strictly aligned with the latest Gujarati Medium GSEB curriculum for Standards 1-8, covering all major subjects.",
  },
  {
    q: "Can I add my own custom questions?",
    a: "Absolutely! School admins and teachers can add their own private questions that only their institution can access.",
  },
  {
    q: "Does it support multiple sections like A, B, and C?",
    a: "Yes, our paper builder allows you to organize questions into customized sections with specific instructions and marks for each.",
  },
  {
    q: "What types of papers can I generate?",
    a: "You can generate everything from weekly unit tests and semester exams to full-scale annual examination papers.",
  },
];

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="py-16 sm:py-20 bg-gray-50 ">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900">
            Common Questions
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm font-semibold uppercase tracking-widest mt-3">
            Everything you need to know about the platform
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-5 sm:p-6 text-left"
              >
                <span className="text-sm sm:text-base font-semibold text-gray-900 pr-4 sm:pr-8 leading-tight hover:text-brand-blue">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 shrink-0 transition-transform duration-500 ${
                    openIndex === index
                      ? "rotate-180 text-brand-blue"
                      : "text-gray-400"
                  }`}
                />
              </button>

              <div
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? "max-h-86 opacity-100"
                    : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm text-gray-500 leading-relaxed sm:text-base">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQs;
