"use client";

import { useEffect, useRef } from "react";

// Dynamically import jQuery and Summernote to avoid SSR issues
let $: any;
let summernoteLoaded = false;

const loadSummernote = async () => {
  if (typeof window !== "undefined" && !summernoteLoaded) {
    // Make jQuery available globally
    if (!(window as any).jQuery) {
      const jQuery = (await import("jquery")).default;
      (window as any).jQuery = jQuery;
      (window as any).$ = jQuery;
      $ = jQuery;
    } else {
      $ = (window as any).jQuery;
    }

    // Load Summernote CSS and JS
    await import("summernote/dist/summernote-lite.min.css");
    await import("summernote/dist/summernote-lite.min.js");
    summernoteLoaded = true;
  }
};

interface SummernoteEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SummernoteEditor({
  value,
  onChange,
  placeholder,
}: SummernoteEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const isInitializedRef = useRef(false);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!editorRef.current) return;
    if (typeof window === "undefined") return;

    let isMounted = true;

    const initializeEditor = async () => {
      await loadSummernote();
      
      if (!editorRef.current || !isMounted) return;
      const $editor = $(editorRef.current);

      // ALWAYS destroy existing instance first to prevent stuck states
      if (isInitializedRef.current) {
        try {
          $editor.summernote("destroy");
          isInitializedRef.current = false;
        } catch (e) {
          // Ignore destroy errors
        }
      }

      // Initialize Summernote fresh
      $editor.summernote({
        placeholder: placeholder || "Start typing...",
        height: 300,
        minHeight: 300,
        maxHeight: 600,
        focus: false,
        toolbar: [
          ["style", ["style"]],
          ["font", ["bold", "italic", "underline", "clear"]],
          ["fontname", ["fontname"]],
          ["fontsize", ["fontsize"]],
          ["color", ["color"]],
          ["para", ["ul", "ol", "paragraph"]],
          ["table", ["table"]],
          ["insert", ["link", "picture", "video"]],
          ["view", ["fullscreen", "codeview", "help"]],
        ],
        fontNames: [
          "Arial",
          "Arial Black",
          "Comic Sans MS",
          "Courier New",
          "Helvetica",
          "Impact",
          "Lucida Grande",
          "Tahoma",
          "Times New Roman",
          "Verdana",
        ],
        fontSizes: ["8", "9", "10", "11", "12", "14", "16", "18", "20", "24", "36", "48"],
        callbacks: {
          onChange: (contents: string) => {
            if (isMounted) {
              onChangeRef.current(contents);
            }
          },
          onInit: () => {
            // Set initial value after initialization
            if (value && isMounted) {
              $editor.summernote("code", value);
            }
          },
        },
      });

      isInitializedRef.current = true;

      // Set initial value if provided
      if (value && isMounted) {
        $editor.summernote("code", value);
      }
    };

    initializeEditor();

    // Cleanup
    return () => {
      isMounted = false;
      if (editorRef.current && isInitializedRef.current) {
        const $editor = $(editorRef.current);
        if ($editor.summernote) {
          try {
            $editor.summernote("destroy");
          } catch (e) {
            // Ignore destroy errors
          }
        }
        isInitializedRef.current = false;
      }
    };
  }, []); // Empty deps - only run once on mount

  // Update editor content when value prop changes externally
  useEffect(() => {
    if (!editorRef.current || !isInitializedRef.current) return;
    if (typeof window === "undefined") return;

    const updateContent = async () => {
      await loadSummernote();
      if (!editorRef.current) return;
      
      const $editor = $(editorRef.current);
      const currentContent = $editor.summernote("code");

      // Only update if the value has changed externally
      if (currentContent !== value) {
        $editor.summernote("code", value || "");
      }
    };

    updateContent();
  }, [value]);

  return (
    <div className="w-full summernote-wrapper">
      <style jsx global>{`
        .summernote-wrapper .note-editor {
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          overflow: hidden;
        }

        .summernote-wrapper .note-toolbar {
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          padding: 0.5rem;
        }

        .summernote-wrapper .note-editable {
          min-height: 300px;
          max-height: 600px;
          overflow-y: auto;
          padding: 1rem;
          background: white;
        }

        .summernote-wrapper .note-editable:focus {
          outline: none;
          border-color: hsl(var(--primary));
          box-shadow: 0 0 0 1px hsl(var(--primary));
        }

        .summernote-wrapper .note-btn-group .note-btn {
          border: 1px solid #d1d5db;
          background: white;
          color: #374151;
          padding: 0.375rem 0.75rem;
          margin: 0 0.125rem;
          border-radius: 0.25rem;
        }

        .summernote-wrapper .note-btn-group .note-btn:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .summernote-wrapper .note-btn-group .note-btn.active {
          background: #e5e7eb;
          border-color: #6b7280;
        }

        .summernote-wrapper .note-dropdown-menu {
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .summernote-wrapper .note-dropdown-menu .note-dropdown-item {
          padding: 0.5rem 1rem;
          color: #374151;
        }

        .summernote-wrapper .note-dropdown-menu .note-dropdown-item:hover {
          background: #f3f4f6;
        }

        .summernote-wrapper .note-editable p {
          margin-bottom: 0.5rem;
        }

        .summernote-wrapper .note-editable h1,
        .summernote-wrapper .note-editable h2,
        .summernote-wrapper .note-editable h3,
        .summernote-wrapper .note-editable h4,
        .summernote-wrapper .note-editable h5,
        .summernote-wrapper .note-editable h6 {
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          font-weight: bold;
        }

        .summernote-wrapper .note-editable ul {
          list-style-type: disc;
          margin-left: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .summernote-wrapper .note-editable ol {
          list-style-type: decimal;
          margin-left: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .summernote-wrapper .note-editable blockquote {
          border-left: 4px solid #d1d5db;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #6b7280;
        }

        .summernote-wrapper .note-editable table {
          border-collapse: collapse;
          width: 100%;
          margin: 1rem 0;
        }

        .summernote-wrapper .note-editable table td,
        .summernote-wrapper .note-editable table th {
          border: 1px solid #d1d5db;
          padding: 0.5rem;
        }

        .summernote-wrapper .note-editable table th {
          background: #f9fafb;
          font-weight: bold;
        }

        .summernote-wrapper .note-editable img {
          max-width: 100%;
          height: auto;
          margin: 0.5rem 0;
        }
      `}</style>
      <textarea ref={editorRef} defaultValue={value || ""} />
    </div>
  );
}

