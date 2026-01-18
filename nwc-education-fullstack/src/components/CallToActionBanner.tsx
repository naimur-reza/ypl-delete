import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Link from "next/link";

interface CallToActionBannerProps {}

export default function CallToActionBanner({}: CallToActionBannerProps) {
  const applyNowUrl = "/apply-now";

  return (
    <section className="   bg-white">
      <div className="relative mx-auto  overflow-hidden   bg-slate-900 shadow-2xl">
        {/* 1. Background Image with Zoom Effect */}
        <div className="absolute inset-0 h-full w-full">
          <Image
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1600&auto=format&fit=crop"
            alt="Students studying abroad"
            fill
            className="object-cover object-center opacity-90 transition-transform duration-700 hover:scale-105"
            priority
          />

          {/* 2. linear Overlays for Readability */}
          {/* Dark overlay at the bottom/center for text */}
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/60 to-slate-950/30" />

          {/* Subtle blue glow from the bottom */}
        </div>

        {/* 3. Content Container */}
        <div className="relative z-10 flex flex-col  items-center text-center   px-6 py-24   md:py-32 lg:px-16">
          <h2 className="max-w-4xl text-4xl font-serif font-bold tracking-tight text-white md:text-5xl lg:text-6xl leading-[1.1]">
            Take the first step towards
            <br className="hidden md:block" /> studying abroad.
          </h2>

          <p className="mt-6 max-w-2xl text-lg text-slate-300 md:text-xl leading-relaxed">
            Join thousands of students who have transformed their careers and
            lives through international education. We are here to guide you.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link href={applyNowUrl}>
              <Button
                size="lg"
                className={cn(
                  "group relative h-14 px-8 rounded-full text-lg font-bold transition-all duration-300",
                  "bg-primary text-white hover:bg-primary/90   border-0"
                )}
              >
                Book Free Counselling
                <div className="ml-2 w-8 h-8 rounded-full bg-slate-900/10 flex items-center justify-center group-hover:bg-slate-900/20 transition-colors">
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
