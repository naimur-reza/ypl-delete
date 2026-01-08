"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { GraduationCap } from "lucide-react";

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

export function WhyChooseCountry({
  countryName,
  sections = [],
}: WhyChooseCountryProps) {
  const activeSections = sections.filter((s) => s.isActive);
  const [activeTab, setActiveTab] = useState(0);

  // Don't render if no sections
  if (activeSections.length === 0) {
    return null;
  }

  const currentSection = activeSections[activeTab];

  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden bg-muted/30">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Why choose the {countryName}
            <br />
            for your studies?
          </h2>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {activeSections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => setActiveTab(index)}
              className={cn(
                "px-6 py-2.5 rounded-full cursor-pointer text-sm font-medium transition-all duration-300 border",
                activeTab === index
                  ? "bg-secondary text-secondary-foreground border-secondary"
                  : "bg-white text-foreground border-border hover:border-secondary/50 hover:text-secondary"
              )}
            >
              {section.title}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Side */}
            <div className="relative aspect-4/3 lg:aspect-auto lg:h-full min-h-[300px] lg:min-h-[400px] p-4 lg:p-6">
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                {currentSection?.image ? (
                  <Image
                    src={currentSection.image}
                    alt={currentSection.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <GraduationCap className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-sm">No image available</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Content Side */}
            <div className="p-6 lg:p-10 relative flex flex-col justify-center">
              {/* Decorative Element */}
              <div className="absolute top-6 right-6 w-20 h-20 opacity-10">
                <svg
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="75"
                    cy="25"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary"
                  />
                  <circle
                    cx="75"
                    cy="25"
                    r="12"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary"
                    strokeDasharray="4 4"
                  />
                </svg>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-5">
                {currentSection?.title}
              </h3>

              {currentSection?.content ? (
                <div className="prose prose-slate max-w-none text-muted-foreground leading-relaxed">
                  <MarkdownContent content={currentSection.content} />
                </div>
              ) : (
                <p className="text-muted-foreground leading-relaxed">
                  Detailed information about {currentSection?.title} will be
                  available soon.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
