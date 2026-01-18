"use client";

import { Search, FileText, Send, Award } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Explore Programs",
    description: "Browse through our curated list of scholarships matched to your country and course.",
    icon: Search,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: 2,
    title: "Check Eligibility",
    description: "Read the criteria carefully to ensure you match the academic and language requirements.",
    icon: FileText,
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: 3,
    title: "Submit Application",
    description: "Complete your profile, upload documents, and apply directly through our partner portal.",
    icon: Send,
    color: "bg-orange-100 text-orange-600",
  },
  {
    id: 4,
    title: "Get Awarded",
    description: "Receive your offer letter and scholarship confirmation to begin your journey.",
    icon: Award,
    color: "bg-green-100 text-green-600",
  },
];

export default function HowToApplySteps() {
  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
            Application Process
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            How to Apply for <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">Scholarships</span>
          </h3>
          <p className="text-slate-600 text-lg">
            Start your application in 4 simple steps. We guide you at every stage to maximize your chances.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden lg:block absolute top-[60px] left-[10%] right-[10%] h-0.5 bg-slate-100 -z-10" />

            {steps.map((step) => (
                <div key={step.id} className="relative group bg-white p-6 rounded-2xl border border-slate-100 hover:border-blue-100 hover:shadow-xl transition-all duration-300 text-center">
                    <div className={`w-16 h-16 mx-auto ${step.color} rounded-2xl flex items-center justify-center mb-6 text-2xl shadow-sm group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                        <step.icon className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h4>
                    <p className="text-slate-500 leading-relaxed">{step.description}</p>
                </div>
            ))}
        </div>

      </div>
    </section>
  );
}
