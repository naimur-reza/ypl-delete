"use client";

import dynamic from "next/dynamic";
import "quill/dist/quill.snow.css";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] bg-gray-50 border border-gray-200 rounded-lg animate-pulse flex items-center justify-center">
      <span className="text-gray-400">Loading editor...</span>
    </div>
  ),
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link", "image"],
    ["blockquote", "code-block"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "align",
  "link",
  "image",
  "blockquote",
  "code-block",
];

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  return (
    <div className="rich-text-editor">
      <style jsx global>{`
        /* Reset any conflicting styles */
        .rich-text-editor .ql-snow {
          box-sizing: border-box;
        }
        
        .rich-text-editor .ql-snow * {
          box-sizing: border-box;
        }

        .rich-text-editor .ql-container {
          border: 1px solid #e5e7eb;
          border-top: none;
          border-radius: 0 0 0.5rem 0.5rem;
          font-size: 1rem;
          min-height: 250px;
        }

        .rich-text-editor .ql-toolbar {
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem 0.5rem 0 0;
          background: #f9fafb;
        }

        .rich-text-editor .ql-editor {
          min-height: 250px;
          max-height: 400px;
          overflow-y: auto;
        }

        .rich-text-editor .ql-editor.ql-blank::before {
          font-style: normal;
          color: #9ca3af;
        }

        /* Ensure SVG icons display correctly */
        .rich-text-editor .ql-toolbar button svg {
          width: 18px;
          height: 18px;
        }

        .rich-text-editor .ql-toolbar .ql-stroke {
          stroke: #374151;
        }

        .rich-text-editor .ql-toolbar .ql-fill {
          fill: #374151;
        }

        .rich-text-editor .ql-toolbar button:hover .ql-stroke,
        .rich-text-editor .ql-toolbar button.ql-active .ql-stroke {
          stroke: #6366f1;
        }

        .rich-text-editor .ql-toolbar button:hover .ql-fill,
        .rich-text-editor .ql-toolbar button.ql-active .ql-fill {
          fill: #6366f1;
        }

        .rich-text-editor .ql-toolbar .ql-picker {
          color: #374151;
        }

        .rich-text-editor .ql-toolbar .ql-picker-options {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || "Start typing..."}
      />
    </div>
  );
}