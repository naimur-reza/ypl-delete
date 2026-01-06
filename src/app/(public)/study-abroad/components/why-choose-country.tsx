"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { GraduationCap, Globe2, Building2, CheckCircle, Users, BookOpen } from "lucide-react";

interface DestinationSection {
  id: string;
  title: string;
  slug: string;
  image?: string | null;
  content?: string | null;
  displayOrder: number;
  isActive: boolean;
}

interface WhyChooseCountryProps {
  countryName: string;
  sections?: DestinationSection[];
}

// Static fallback content for when no sections are configured
const staticFeatures = [
  {
    title: "World-Class Education",
    description: `Home to some of the world's top-ranking universities and innovative teaching methods.`,
    icon: GraduationCap,
    color: "blue",
  },
  {
    title: "Global Recognition",
    description: "Degrees recognized and respected by employers and institutions worldwide.",
    icon: Globe2,
    color: "emerald",
  },
  {
    title: "Cultural Diversity",
    description: "Experience a vibrant multicultural environment and meet students from around the globe.",
    icon: Building2,
    color: "purple",
  },
  {
    title: "Work Opportunities",
    description: "Post-study work visas and part-time work opportunities while you study.",
    icon: CheckCircle,
    color: "orange",
  },
  {
    title: "Research Excellence",
    description: "Access to cutting-edge research facilities and opportunities to work with experts.",
    icon: BookOpen,
    color: "pink",
  },
  {
    title: "Student Support",
    description: "Comprehensive support services for international students to help you settle in.",
    icon: Users,
    color: "cyan",
  },
];

export function WhyChooseCountry({ countryName, sections = [] }: WhyChooseCountryProps) {
  const activeSections = sections.filter((s) => s.isActive);
  const [activeTab, setActiveTab] = useState(0);

  // If no dynamic sections, show static fallback
  if (activeSections.length === 0) {
    return (
      <section className="relative w-full py-16 md:py-24 px-6 overflow-hidden bg-white">
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-sm font-bold tracking-widest text-blue-600 uppercase bg-blue-50 px-4 py-2 rounded-full">
              Why Study Here
            </span>
            <h2 className="mt-6 text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Why Choose{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-emerald-600">
                {countryName}?
              </span>
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Discover the benefits of studying in {countryName} and how it can shape your future career.
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {staticFeatures.map((item, index) => (
              <div
                key={index}
                className="group bg-slate-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300 border border-slate-100"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-${item.color}-100 text-${item.color}-600 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Dynamic sections with tabs
  const currentSection = activeSections[activeTab];

  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden bg-slate-50">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Why choose the {countryName}
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-primary/70">
              for your studies?
            </span>
          </h2>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {activeSections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => setActiveTab(index)}
              className={cn(
                "px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 border-2",
                activeTab === index
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/25"
                  : "bg-white text-slate-700 border-slate-200 hover:border-primary/50 hover:text-primary"
              )}
            >
              {section.title}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Side */}
            <div className="relative aspect-4/3 lg:aspect-auto lg:h-full min-h-[300px] lg:min-h-[500px]">
              {currentSection?.image ? (
                <Image
                  src={currentSection.image}
                  alt={currentSection.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <GraduationCap className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">No image available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Content Side */}
            <div className="p-8 md:p-12 lg:p-16 relative">
              {/* Decorative Element */}
              <div className="absolute top-8 right-8 w-24 h-24 opacity-10">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" className="text-primary" />
                  <path d="M50 5 L50 30 M50 70 L50 95 M5 50 L30 50 M70 50 L95 50" stroke="currentColor" strokeWidth="2" className="text-primary" />
                </svg>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                {currentSection?.title}
              </h3>

              {currentSection?.content ? (
                <div className="prose prose-slate prose-lg max-w-none">
                  <MarkdownContent content={currentSection.content} />
                </div>
              ) : (
                <p className="text-slate-600 leading-relaxed">
                  Detailed information about {currentSection?.title} will be available soon.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
