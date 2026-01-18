"use client";

import { useMemo, useCallback, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-300 rounded-md p-4 bg-gray-50 min-h-[300px] flex items-center justify-center">
      <p className="text-gray-500">Loading editor...</p>
    </div>
  ),
});

interface MDEWrapperProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MDEWrapper({
  value,
  onChange,
  placeholder,
}: MDEWrapperProps) {
  // Use a ref to track the current onChange callback to avoid stale closures
  const onChangeRef = useRef(onChange);
  
  // Keep the ref updated with the latest onChange callback
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Create a stable onChange handler that uses the ref
  const handleChange = useCallback((val: string) => {
    onChangeRef.current(val);
  }, []);

  const options = useMemo(() => {
    return {
      spellChecker: false,
      placeholder: placeholder || "Start typing...",
      status: false,
      minHeight: "300px",
      toolbar: [
        "bold",
        "italic",
        "heading",
        "|",
        "quote",
        "unordered-list",
        "ordered-list",
        "|",
        "link",
        "image",
        "|",
        "preview",
        "side-by-side",
        "fullscreen",
        "|",
        "guide",
      ],
    };
  }, [placeholder]);

  return (
    <div className="w-full mde-wrapper">
      <style jsx global>{`
        .mde-wrapper .EasyMDEContainer {
          width: 100%;
        }
        .mde-wrapper .EasyMDEContainer .CodeMirror {
          min-height: 300px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
        }
        .mde-wrapper .editor-toolbar {
          border: 1px solid #e5e7eb;
          border-bottom: none;
          border-radius: 0.375rem 0.375rem 0 0;
          background: #f9fafb;
        }
        .mde-wrapper .CodeMirror-scroll {
          min-height: 300px;
        }
      `}</style>
      <SimpleMDE 
        value={value} 
        onChange={handleChange} 
        options={options as any} 
      />
    </div>
  );
}
