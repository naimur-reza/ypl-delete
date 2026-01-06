'use client';

import { 
  GraduationCap, 
  FileCheck, 
  PlaneTakeoff, 
  MessageCircle, 
  ArrowRight,
  School 
} from 'lucide-react';

const services = [
  {
    title: "Career Counseling",
    description: "Confused about which course to choose? Our experts analyze your profile to find the perfect match for your career goals.",
    icon: GraduationCap,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "University Admissions",
    description: "We handle the complex application process, ensuring your SOPs and documents meet the high standards of UK universities.",
    icon: School,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Visa Assistance",
    description: "Our dedicated visa team guides you through financial documentation and interviews to maximize your visa success rate.",
    icon: FileCheck,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Pre-Departure Support",
    description: "From finding accommodation to booking flights, we help you settle in comfortably before you even land in the UK.",
    icon: PlaneTakeoff,
    color: "bg-orange-100 text-orange-600",
  },
];

export default function HowWeHelp() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
            Our Services
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Your Journey, <span className="text-slate-900/50">Simplified.</span>
          </h3>
          <p className="text-slate-600 text-lg">
            We don't just help you apply; we walk with you from your first query until you attend your first class.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100"
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className="w-7 h-7" />
              </div>
              
              {/* Content */}
              <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                {service.title}
              </h4>
              <p className="text-slate-500 leading-relaxed mb-4">
                {service.description}
              </p>
 
            </div>
          ))}
        </div>
 

      </div>
    </section>
  );
}