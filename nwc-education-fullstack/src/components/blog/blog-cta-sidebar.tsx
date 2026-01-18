"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface BlogCTASidebarProps {
  className?: string;
}

export function BlogCTASidebar({ className }: BlogCTASidebarProps) {
  return (
    <div
      className={`bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden ${className}`}
    >
      {/* Decorative Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full text-primary">
          <circle cx="80" cy="20" r="15" fill="currentColor" />
          <circle cx="60" cy="50" r="10" fill="currentColor" />
          <circle cx="85" cy="70" r="8" fill="currentColor" />
          <path
            d="M10 80 Q 30 60 50 80 T 90 80"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
          />
        </svg>
      </div>

      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-3 leading-snug">
          Take the first step toward studying abroad!
        </h3>
        <p className="text-slate-300 text-sm mb-6">
          Get personalized guidance from our expert counselors.
        </p>
        <Link href="/apply-now">
          <Button
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl group"
          >
            Free consultation
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
