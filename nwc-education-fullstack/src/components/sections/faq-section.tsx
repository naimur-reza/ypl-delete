"use client";

import React, { useState } from "react";
import { ChevronRight, GraduationCap } from "lucide-react";

type FAQItem = {
  id: string | number;
  question: string;
  answer: string;
};

interface FaqSectionProps {
  faqs?: FAQItem[];
  title?: string;
}

const fallbackFaqs: FAQItem[] = [
  {
    id: 1,
    question: "Why study abroad?",
    answer:
      "Studying abroad opens doors to new cultures, world-class education, and global career opportunities. It challenges you to grow personally and professionally while making lifelong friends from around the world.",
  },
  {
    id: 2,
    question: "Where and what to study?",
    answer:
      "Choosing the right destination and course is crucial. Consider factors like university rankings, post-study work rights, tuition fees, and lifestyle preferences. We help match your profile to the perfect institution.",
  },
  {
    id: 3,
    question: "How do I apply?",
    answer:
      "Our counselors guide you through the entire application process, from drafting your Statement of Purpose (SOP) to gathering transcripts and submitting your application before deadlines.",
  },
  {
    id: 4,
    question: "After receiving an offer",
    answer:
      "Once you have an offer, you need to accept it, pay your deposit, and organize your finances. This is also the time to start looking into accommodation options.",
  },
];

export function FaqSection({ faqs, title }: FaqSectionProps = {}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const items = faqs && faqs.length ? faqs : fallbackFaqs;

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          <div className="relative w-full min-h-[420px] lg:min-h-[520px]">
            <div className="absolute top-8 left-4 w-72 h-72 bg-primary rounded-tl-[90px] rounded-tr-[90px] rounded-bl-[90px] transform -rotate-12 z-0" />
            <div className="absolute -top-4 right-4 w-80 h-80 bg-primary rounded-tr-[110px] rounded-tl-[110px] rounded-br-[110px] transform rotate-6 z-0 opacity-60" />
            <div className="absolute bottom-8 -left-4 w-72 h-72 bg-primary rounded-bl-[90px] rounded-br-[90px] rounded-tl-[90px] transform -rotate-6 z-0 opacity-80" />
            <div className="absolute inset-0 z-10 my-4 lg:my-0">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800"
                alt="Students"
                className="w-full h-full object-cover rounded-[40px] shadow-2xl relative z-10"
                style={{ objectPosition: "center top" }}
              />
              <div className="absolute bottom-10 -right-4 lg:-right-8 bg-white p-4 rounded-2xl shadow-xl z-20 animate-bounce-slow border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      Success Rate
                    </p>
                    <p className="text-xl font-bold text-gray-900">98%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <h2 className="section-title relative inline-block text-3xl md:text-4xl font-bold">
                {title || "Your study abroad steps"}
                <span className="absolute -bottom-3 left-0 w-20 h-1.5 bg-primary rounded-full"></span>
              </h2>
            </div>

            <div className="space-y-4">
              {items.map((faq, index) => {
                const isOpen = openIndex === index;

                return (
                  <div
                    key={faq.id}
                    className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                      isOpen
                        ? "border-red-200 bg-red-50/50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full flex items-center justify-between p-5 text-left group cursor-pointer"
                    >
                      <span
                        className={`text-lg font-bold transition-colors ${
                          isOpen
                            ? "text-red-600"
                            : "text-gray-800 group-hover:text-gray-900"
                        }`}
                      >
                        {faq.question}
                      </span>
                      <span
                        className={`transform transition-transform duration-300 ${
                          isOpen ? "rotate-90 text-red-500" : "text-gray-400"
                        }`}
                      >
                        <ChevronRight size={20} />
                      </span>
                    </button>

                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="p-5 pt-0 text-gray-600 leading-relaxed flex gap-4">
                          <div className="hidden sm:block mt-1 shrink-0">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                isOpen
                                  ? "bg-red-100 text-red-500"
                                  : "bg-gray-100"
                              }`}
                            >
                              <ChevronRight size={18} />
                            </div>
                          </div>
                          <div>{faq.answer}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
