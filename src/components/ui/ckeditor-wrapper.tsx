"use client";

import { useRef, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Bold,
  Essentials,
  Italic,
  Mention,
  Paragraph,
  Undo,
  Heading,
  Link,
  List,
  BlockQuote,
  Indent,
  IndentBlock,
  Table,
  TableToolbar,
  MediaEmbed,
  Image,
  ImageToolbar,
  ImageUpload,
  ImageCaption,
  ImageStyle,
  ImageResize,
  LinkImage,
  Alignment,
  FontSize,
  FontFamily,
  FontColor,
  FontBackgroundColor,
  Highlight,
  HorizontalLine,
  RemoveFormat,
  SourceEditing,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";

interface CKEditorWrapperProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function CKEditorWrapper({
  value,
  onChange,
  placeholder,
}: CKEditorWrapperProps) {
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  return (
    <div className="w-full ckeditor-wrapper">
      <style jsx global>{`
        .ckeditor-wrapper .ck-editor__editable {
          min-height: 300px;
          max-height: 600px;
        }
        
        .ckeditor-wrapper .ck.ck-editor__main > .ck-editor__editable {
          border: 1px solid #e5e7eb;
          border-top: none;
          border-radius: 0 0 0.375rem 0.375rem;
        }
        
        .ckeditor-wrapper .ck.ck-editor__top .ck-sticky-panel .ck-toolbar {
          border: 1px solid #e5e7eb;
          border-bottom: none;
          border-radius: 0.375rem 0.375rem 0 0;
          background: #f9fafb;
        }
        
        .ckeditor-wrapper .ck.ck-toolbar {
          background: #f9fafb;
        }
        
        .ckeditor-wrapper .ck-focused {
          border-color: hsl(var(--primary)) !important;
          box-shadow: 0 0 0 1px hsl(var(--primary)) !important;
        }
      `}</style>
      <CKEditor
        editor={ClassicEditor}
        config={{
          licenseKey: 'GPL', // Use the free GPL license
          toolbar: {
            items: [
              "undo",
              "redo",
              "|",
              "heading",
              "|",
              "fontSize",
              "fontFamily",
              "fontColor",
              "fontBackgroundColor",
              "|",
              "bold",
              "italic",
              "highlight",
              "|",
              "alignment",
              "|",
              "numberedList",
              "bulletedList",
              "|",
              "outdent",
              "indent",
              "|",
              "link",
              "blockQuote",
              "insertTable",
              "mediaEmbed",
              "|",
              "horizontalLine",
              "removeFormat",
              "|",
              "sourceEditing",
            ],
          },
          plugins: [
            Bold,
            Essentials,
            Italic,
            Mention,
            Paragraph,
            Undo,
            Heading,
            Link,
            List,
            BlockQuote,
            Indent,
            IndentBlock,
            Table,
            TableToolbar,
            MediaEmbed,
            Image,
            ImageToolbar,
            ImageUpload,
            ImageCaption,
            ImageStyle,
            ImageResize,
            LinkImage,
            Alignment,
            FontSize,
            FontFamily,
            FontColor,
            FontBackgroundColor,
            Highlight,
            HorizontalLine,
            RemoveFormat,
            SourceEditing,
          ],
          placeholder: placeholder || "Start typing...",
          heading: {
            options: [
              {
                model: "paragraph",
                title: "Paragraph",
                class: "ck-heading_paragraph",
              },
              {
                model: "heading1",
                view: "h1",
                title: "Heading 1",
                class: "ck-heading_heading1",
              },
              {
                model: "heading2",
                view: "h2",
                title: "Heading 2",
                class: "ck-heading_heading2",
              },
              {
                model: "heading3",
                view: "h3",
                title: "Heading 3",
                class: "ck-heading_heading3",
              },
              {
                model: "heading4",
                view: "h4",
                title: "Heading 4",
                class: "ck-heading_heading4",
              },
            ],
          },
          table: {
            contentToolbar: [
              "tableColumn",
              "tableRow",
              "mergeTableCells",
            ],
          },
          image: {
            toolbar: [
              "imageStyle:inline",
              "imageStyle:block",
              "imageStyle:side",
              "|",
              "toggleImageCaption",
              "imageTextAlternative",
              "|",
              "linkImage",
            ],
          },
        }}
        data={value}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChangeRef.current(data);
        }}
      />
    </div>
  );
}
