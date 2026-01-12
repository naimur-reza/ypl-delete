"use client";

import { useMemo, useCallback, useEffect } from "react";
import { createEditor, Descendant, Editor, Transforms, Element as SlateElement } from "slate";
import { Slate, Editable, withReact, RenderElementProps, RenderLeafProps } from "slate-react";
import { withHistory } from "slate-history";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Link,
  Undo,
  Redo,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SlateEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Define custom types for our editor
type CustomElement = { type: string; children: CustomText[] };
type CustomText = { text: string; bold?: boolean; italic?: boolean; underline?: boolean };

declare module "slate" {
  interface CustomTypes {
    Editor: Editor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const LIST_TYPES = ["numbered-list", "bulleted-list"];
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

// Convert HTML string to Slate nodes
const htmlToSlate = (html: string): Descendant[] => {
  if (!html || html.trim() === "") {
    return [{ type: "paragraph", children: [{ text: "" }] }];
  }

  // Create a temporary DOM element to parse HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const body = doc.body;

  const parseNode = (node: Node): Descendant[] => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";
      return text ? [{ text }] : [];
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const tagName = element.tagName.toLowerCase();
      const children: Descendant[] = [];

      Array.from(element.childNodes).forEach((child) => {
        children.push(...parseNode(child));
      });

      // Handle empty elements
      if (children.length === 0) {
        children.push({ text: "" });
      }

      switch (tagName) {
        case "h1":
          return [{ type: "heading-one", children }];
        case "h2":
          return [{ type: "heading-two", children }];
        case "h3":
          return [{ type: "heading-three", children }];
        case "blockquote":
          return [{ type: "block-quote", children }];
        case "ul":
          return [{ type: "bulleted-list", children }];
        case "ol":
          return [{ type: "numbered-list", children }];
        case "li":
          return [{ type: "list-item", children }];
        case "strong":
        case "b":
          return children.map((child) => {
            if ("text" in child) {
              return { ...child, bold: true };
            }
            return child;
          });
        case "em":
        case "i":
          return children.map((child) => {
            if ("text" in child) {
              return { ...child, italic: true };
            }
            return child;
          });
        case "u":
          return children.map((child) => {
            if ("text" in child) {
              return { ...child, underline: true };
            }
            return child;
          });
        case "p":
        case "div":
          return [{ type: "paragraph", children }];
        default:
          return [{ type: "paragraph", children }];
      }
    }

    return [{ type: "paragraph", children: [{ text: "" }] }];
  };

  const nodes = parseNode(body);
  return nodes.length > 0 ? nodes : [{ type: "paragraph", children: [{ text: "" }] }];
};

// Convert Slate nodes to HTML string
const slateToHtml = (nodes: Descendant[]): string => {
  const serialize = (node: Descendant): string => {
    if ("text" in node) {
      let text = node.text;
      if (node.bold) text = `<strong>${text}</strong>`;
      if (node.italic) text = `<em>${text}</em>`;
      if (node.underline) text = `<u>${text}</u>`;
      return text;
    }

    const children = node.children.map((n) => serialize(n as Descendant)).join("");

    switch (node.type) {
      case "heading-one":
        return `<h1>${children}</h1>`;
      case "heading-two":
        return `<h2>${children}</h2>`;
      case "heading-three":
        return `<h3>${children}</h3>`;
      case "block-quote":
        return `<blockquote>${children}</blockquote>`;
      case "bulleted-list":
        return `<ul>${children}</ul>`;
      case "numbered-list":
        return `<ol>${children}</ol>`;
      case "list-item":
        return `<li>${children}</li>`;
      case "paragraph":
        return `<p>${children}</p>`;
      default:
        return `<p>${children}</p>`;
    }
  };

  return nodes.map((node) => serialize(node)).join("");
};

const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format as keyof typeof marks] === true : false;
};

const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor: Editor, format: string) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: selection,
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    })
  );

  return !!match;
};

const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type),
    split: true,
  });

  let newProperties: Partial<SlateElement>;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    } as Partial<SlateElement>;
  } else {
    newProperties = {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    } as Partial<SlateElement>;
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const Element = ({ attributes, children, element }: RenderElementProps) => {
  const style = { textAlign: (element as any).align };
  switch (element.type) {
    case "heading-one":
      return (
        <h1 style={style} {...attributes} className="text-3xl font-bold mb-2">
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 style={style} {...attributes} className="text-2xl font-bold mb-2">
          {children}
        </h2>
      );
    case "heading-three":
      return (
        <h3 style={style} {...attributes} className="text-xl font-bold mb-2">
          {children}
        </h3>
      );
    case "block-quote":
      return (
        <blockquote style={style} {...attributes} className="border-l-4 border-gray-300 pl-4 italic my-2">
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return (
        <ul style={style} {...attributes} className="list-disc list-inside my-2">
          {children}
        </ul>
      );
    case "numbered-list":
      return (
        <ol style={style} {...attributes} className="list-decimal list-inside my-2">
          {children}
        </ol>
      );
    case "list-item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    default:
      return (
        <p style={style} {...attributes} className="mb-2">
          {children}
        </p>
      );
  }
};

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

export default function SlateEditor({ value, onChange, placeholder }: SlateEditorProps) {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const initialValue = useMemo(() => {
    try {
      return htmlToSlate(value);
    } catch {
      return [{ type: "paragraph", children: [{ text: "" }] }];
    }
  }, []);

  // Note: Slate editor manages its own state internally
  // The value prop is used for initial value only
  // Changes are handled through the onChange callback

  const handleChange = useCallback(
    (newValue: Descendant[]) => {
      const html = slateToHtml(newValue);
      onChange(html);
    },
    [onChange]
  );

  return (
    <div className="w-full border border-gray-200 rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-200 flex-wrap">
        <ToolbarButton
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark(editor, "bold");
          }}
          active={isMarkActive(editor, "bold")}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark(editor, "italic");
          }}
          active={isMarkActive(editor, "italic")}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark(editor, "underline");
          }}
          active={isMarkActive(editor, "underline")}
          title="Underline"
        >
          <Underline className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolbarButton
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlock(editor, "heading-one");
          }}
          active={isBlockActive(editor, "heading-one")}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlock(editor, "heading-two");
          }}
          active={isBlockActive(editor, "heading-two")}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlock(editor, "heading-three");
          }}
          active={isBlockActive(editor, "heading-three")}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolbarButton
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlock(editor, "bulleted-list");
          }}
          active={isBlockActive(editor, "bulleted-list")}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlock(editor, "numbered-list");
          }}
          active={isBlockActive(editor, "numbered-list")}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlock(editor, "block-quote");
          }}
          active={isBlockActive(editor, "block-quote")}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolbarButton
          onMouseDown={(e) => {
            e.preventDefault();
            editor.undo();
          }}
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onMouseDown={(e) => {
            e.preventDefault();
            editor.redo();
          }}
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <Slate editor={editor} initialValue={initialValue} onChange={handleChange}>
        <Editable
          renderElement={Element}
          renderLeaf={Leaf}
          placeholder={placeholder || "Start typing..."}
          className="min-h-[300px] max-h-[600px] p-4 overflow-y-auto prose prose-sm max-w-none focus:outline-none"
          style={{ minHeight: "300px" }}
        />
      </Slate>
    </div>
  );
}

const ToolbarButton = ({
  active,
  children,
  onMouseDown,
  title,
}: {
  active?: boolean;
  children: React.ReactNode;
  onMouseDown: (e: React.MouseEvent) => void;
  title: string;
}) => {
  return (
    <button
      type="button"
      onMouseDown={onMouseDown}
      className={cn(
        "p-2 rounded hover:bg-gray-200 transition-colors",
        active && "bg-gray-300"
      )}
      title={title}
    >
      {children}
    </button>
  );
};

