"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { addHeadingIds } from "@/lib/toc-utils";

interface HTMLContentProps {
  content: string;
  className?: string;
  /** If true, adds IDs to h2/h3 headings for anchor linking */
  generateIds?: boolean;
}

/**
 * Reusable component for rendering HTML content from rich text editors like CKEditor.
 * Uses Tailwind child selectors for styling.
 * 
 * @example
 * <HTMLContent content={blogPost.content} />
 * <HTMLContent content={event.description} className="text-sm" />
 * <HTMLContent content={blog.content} generateIds /> // For TOC support
 */
export function HTMLContent({ content, className, generateIds = false }: HTMLContentProps) {
  // Memoize the processed HTML to avoid re-processing on every render
  const htmlContent = useMemo(() => {
    if (!content) return "";
    let html = content;
    if (generateIds) {
      html = addHeadingIds(html);
    }
    return html;
  }, [content, generateIds]);

  if (!content) return null;

  return (
    <div 
      className={cn(
        // Base text styling
        "text-slate-700 leading-relaxed",
        // Heading styles with scroll margin for anchor links
        "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-slate-900 [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:scroll-mt-24",
        "[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:scroll-mt-24",
        "[&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:scroll-mt-24",
        "[&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-slate-900 [&_h4]:mt-4 [&_h4]:mb-2",
        // Paragraph styles
        "[&_p]:mb-5 [&_p]:leading-relaxed [&_p]:text-slate-600",
        // List styles
        "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:my-5",
        "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:my-5",
        "[&_li]:text-slate-600",
        // Inline styles
        "[&_strong]:text-slate-900 [&_strong]:font-semibold",
        "[&_em]:italic",
        "[&_a]:text-primary [&_a]:underline [&_a]:hover:text-primary/80",
        // Code styles
        "[&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono",
        "[&_pre]:bg-slate-900 [&_pre]:text-slate-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-5",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
        // Blockquote styles
        "[&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600 [&_blockquote]:my-5",
        // Horizontal rule
        "[&_hr]:border-slate-200 [&_hr]:my-8",
        // Table styles
        "[&_table]:w-full [&_table]:border-collapse [&_table]:my-5",
        "[&_th]:border [&_th]:border-slate-200 [&_th]:bg-slate-50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold",
        "[&_td]:border [&_td]:border-slate-200 [&_td]:px-3 [&_td]:py-2",
        // Image styles
        "[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-5",
        "[&_figure]:my-5",
        "[&_figcaption]:text-sm [&_figcaption]:text-slate-500 [&_figcaption]:text-center [&_figcaption]:mt-2",
        // Media embed styles
        "[&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:my-5 [&_iframe]:rounded-lg",
        // Custom className
        className
      )}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
