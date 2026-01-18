"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  label: string;
}

interface UniversitySidebarProps {
  steps: Step[];
}

export function UniversitySidebar({ steps }: UniversitySidebarProps) {
  const [activeSection, setActiveSection] = useState<string>(steps[0]?.id || "");

  useEffect(() => {
    const handleScroll = () => {
      const sections = steps.map((step) => step.id);
      const scrollPosition = window.scrollY + 200; // Offset for sticky header

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [steps]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Offset for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
      <div className="p-4 bg-slate-50 border-b border-slate-200">
        <h3 className="font-bold text-slate-900">Quick Navigation</h3>
      </div>
      <nav className="flex flex-col">
        {steps.map((step) => {
          const isActive = activeSection === step.id;
          return (
            <button
              key={step.id}
              onClick={() => scrollToSection(step.id)}
              className={cn(
                "px-4 py-3 text-sm font-medium text-left transition-all flex items-center justify-between border-b border-slate-100 last:border-0",
                isActive
                  ? "text-primary bg-primary/10 border-l-4 border-primary"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent"
              )}
            >
              <span>{step.label}</span>
              <ChevronRight
                className={cn(
                  "w-4 h-4 transition-opacity",
                  isActive ? "opacity-100" : "opacity-0"
                )}
              />
            </button>
          );
        })}
      </nav>
    </div>
  );
}
