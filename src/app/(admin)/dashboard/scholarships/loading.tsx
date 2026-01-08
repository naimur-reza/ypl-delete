"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ScholarshipsLoading() {
  return (
    <div className="flex-1 space-y-6 p-6 animate-in fade-in-50 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-4 w-52" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="border-b bg-muted/50 px-6 py-4">
          <div className="flex items-center gap-6">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16 ml-auto" />
          </div>
        </div>
        <div className="divide-y">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="px-6 py-4">
              <div className="flex items-center gap-6">
                <Skeleton className="h-4 w-4 rounded" />
                <div className="flex items-center gap-3 flex-1">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-56" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-8 w-8 rounded ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
