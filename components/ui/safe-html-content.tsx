"use client";

import { cn } from "@/lib/utils";

interface SafeHtmlContentProps {
  content: string;
  className?: string;
}

export function SafeHtmlContent({ content, className }: SafeHtmlContentProps) {
  if (!content) return null;

  return (
    <div
      className={cn("prose prose-slate max-w-none dark:prose-invert", className)}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
