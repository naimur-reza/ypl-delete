"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const SummernoteEditor = dynamic(() => import("./summernote-editor"), {
  ssr: false,
  loading: () => <Skeleton className="h-[300px] w-full rounded-md" />,
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  editorKey?: string | number; // Key to force re-mount when changed
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  label,
  editorKey,
}: RichTextEditorProps) {
  return (
    <div className="space-y-2 w-full">
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className="min-h-[300px]">
        <SummernoteEditor
          key={editorKey} // Force re-mount when key changes
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
