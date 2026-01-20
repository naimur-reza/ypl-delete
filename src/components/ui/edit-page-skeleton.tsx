"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function EditPageSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Form Content */}
      <div className="rounded-xl border bg-card p-6 space-y-6 border-border">
        {/* Basic Fields */}
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-24 w-full" />
          </div>

          {/* Image Upload Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-32 w-32 rounded-lg" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t" />

        {/* Advanced Fields */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  );
}

