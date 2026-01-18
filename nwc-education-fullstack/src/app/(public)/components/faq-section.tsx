"use client";

import React, { useState } from "react";
import {
  ChevronRight,
  GraduationCap,
  Globe,
  FileText,
  CheckCircle,
  Plane,
  Smile,
} from "lucide-react";

interface FaqSectionProps {
  universityId?: string;
  countryId?: string;
}

export function FaqSection({ universityId, countryId }: FaqSectionProps = {}) {
  // Track which step is currently open
  // Changed default to null so none are open initially, matching the reference image state
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleStep = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const steps = [
    {
      id: 1,
      title: "Why study abroad?",
      icon: GraduationCap,
      content:
        "Studying abroad opens doors to new cultures, world-class education, and global career opportunities. It challenges you to grow personally and professionally while making lifelong friends from around the world.",
    },
    {
      id: 2,
      title: "Where and what to study?",
      icon: Globe,
      content:
        "Choosing the right destination and course is crucial. Consider factors like university rankings, post-study work rights, tuition fees, and lifestyle preferences. We help match your profile to the perfect institution.",
    },
    {
      id: 3,
      title: "How do I apply?",
      icon: FileText,
      content:
        "Our counselors guide you through the entire application process, from drafting your Statement of Purpose (SOP) to gathering transcripts and submitting your application before deadlines.",
    },
    {
      id: 4,
      title: "After receiving an offer",
      icon: CheckCircle,
      content:
        "Congratulations! Once you have an offer, you need to accept it, pay your deposit, and organize your finances. This is also the time to start looking into accommodation options.",
    },
    {
      id: 5,
      title: "Prepare to depart",
      icon: Plane,
      content:
        "From visa applications to booking flights and packing essentials. We provide pre-departure briefings to ensure you are fully prepared for your journey and know what to expect upon arrival.",
    },
    {
      id: 6,
      title: "Arrive and thrive",
      icon: Smile,
      content:
        "Welcome to your new home! We offer guidance on opening bank accounts, registering with a GP, and connecting with student communities so you can settle in smoothly and start thriving.",
    },
  ];

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Key Change: Reduced gap to gap-6/lg:gap-8 for "no whitespace" look.
           Used items-stretch to ensure the image column is as tall as the content column.
        */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Left Side: Image & Abstract Shapes */}
          {/* Key Change: Removed fixed widths, added min-height for large screens to ensure a tall portrait image */}
          <div className="relative w-full min-h-[500px] lg:min-h-[700px]">
            <div className="relative w-full h-full">
              {/* Abstract Petal Backgrounds - Scaled up significantly for the larger image area */}
              {/* Top Left - Orange */}
              <div className="absolute top-8 left-4 w-72 h-72 bg-primary rounded-tl-[90px] rounded-tr-[90px] rounded-bl-[90px] transform -rotate-12 z-0"></div>

              {/* Top Right - Blue (Primary) */}
              <div className="absolute -top-4 right-4 w-80 h-80 bg-primary rounded-tr-[110px] rounded-tl-[110px] rounded-br-[110px] transform rotate-6 z-0 opacity-60"></div>

              {/* Bottom Left - Green (Primary) */}
              <div className="absolute bottom-8 -left-4 w-72 h-72 bg-primary rounded-bl-[90px] rounded-br-[90px] rounded-tl-[90px] transform -rotate-6 z-0 opacity-80"></div>

              {/* The Student Image - set to w-full h-full object-cover */}
              <div className="absolute inset-0 z-10 my-4 lg:my-0">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800"
                  alt="Happy student holding laptop"
                  className="w-full h-full object-cover rounded-[40px] shadow-2xl relative z-10"
                  style={{ objectPosition: "center top" }}
                />

                {/* Decorative floating badge */}
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
          </div>

          {/* Right Side: Header & Accordion List */}
          <div className="flex flex-col justify-center">
            {/* Key Change: Header moved inside the right column */}
            <div className="mb-8">
              <h2 className="section-title relative inline-block text-3xl md:text-4xl font-bold">
                Your study abroad steps
                {/* Orange Underline Accent */}
                <span className="absolute -bottom-3 left-0 w-20 h-1.5 bg-primary rounded-full"></span>
              </h2>
            </div>

            <div className="space-y-4">
              {steps.map((step, index) => {
                const isOpen = openIndex === index;
                const Icon = step.icon;

                return (
                  <div
                    key={step.id}
                    // Updated border colors to match reference image better (reddish/pinkish when open)
                    className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                      isOpen
                        ? "border-red-200 bg-red-50/50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <button
                      onClick={() => toggleStep(index)}
                      className="w-full flex items-center justify-between p-5 text-left group cursor-pointer"
                    >
                      <span
                        className={`text-lg font-bold transition-colors ${
                          isOpen
                            ? "text-red-600"
                            : "text-gray-800 group-hover:text-gray-900"
                        }`}
                      >
                        {step.title}
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
                          {/* Icon shown inside expanded content */}
                          <div className="hidden sm:block mt-1 shrink-0">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                isOpen
                                  ? "bg-red-100 text-red-500"
                                  : "bg-gray-100"
                              }`}
                            >
                              <Icon size={18} />
                            </div>
                          </div>
                          <div>{step.content}</div>
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
