"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function HeroSkeleton() {
  return (
    <div className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background overlay animation */}
      <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

      {/* Content Container */}
      <div className="relative h-full flex items-center px-6 sm:px-12 lg:px-20 max-w-[1400px] mx-auto">
        <div className="max-w-3xl w-full">
          <div className="flex flex-col gap-6">
            {/* Tagline skeleton */}
            <Skeleton className="h-4 w-64 bg-white/10" />

            {/* Headline skeleton */}
            <div className="space-y-3">
              <Skeleton className="h-12 sm:h-14 lg:h-16 w-full bg-white/10" />
              <Skeleton className="h-12 sm:h-14 lg:h-16 w-3/4 bg-white/10" />
            </div>

            {/* Stats Grid skeleton */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 py-6 my-2 border-y border-white/10 bg-white/5 backdrop-blur-sm rounded-xl p-6">
              {[1, 2, 3].map((idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <Skeleton className="h-10 sm:h-12 w-24 bg-white/10" />
                  <Skeleton className="h-4 w-20 bg-white/10" />
                </div>
              ))}
            </div>

            {/* CTA Buttons skeleton */}
            <div className="flex flex-wrap gap-4 mt-2">
              <Skeleton className="h-12 w-40 rounded-full bg-white/10" />
              <Skeleton className="h-12 w-36 rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      </div>

      {/* Dot Navigation skeleton */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 sm:gap-4 p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10">
        {[1, 2, 3].map((idx) => (
          <Skeleton
            key={idx}
            className={`h-2 rounded-full bg-white/20 ${
              idx === 1 ? "w-8 sm:w-12" : "w-2"
            }`}
          />
        ))}
      </div>

      {/* Shimmer animation overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent animate-pulse" />
    </div>
  );
}
