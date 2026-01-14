"use client";

import "./tiptap-editor.css";

import { FC, useEffect } from "react";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
   AlignCenter,
   AlignLeft,
   AlignRight,
   Bold,
   Code,
   Heading1,
   Heading2,
   Heading3,
   Italic,
   List,
   ListOrdered,
   Quote,
   Redo,
   Strikethrough,
   UnderlineIcon,
   Undo,
} from "lucide-react";
import { Markdown } from "tiptap-markdown";

import { cn } from "@/lib/utils";

const ToolbarButton: FC<{
   onClick: () => void;
   isActive?: boolean;
   icon: React.ReactNode;
   title: string;
}> = ({ onClick, isActive, icon, title }) => (
   <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
         "p-2 rounded hover:bg-slate-100 transition-colors",
         isActive ? "bg-slate-200 text-blue-600" : "text-slate-700"
      )}
   >
      {icon}
   </button>
);

type TiptapEditorProps = {
   value: string;
   onChange: (value: string) => void;
   placeholder?: string;
   minHeight?: number;
   className?: string;
};

export const TiptapEditor: FC<TiptapEditorProps> = ({
   value,
   onChange,
   placeholder = "Start typing...",
   minHeight = 200,
   className,
}) => {
   const editor = useEditor({
      immediatelyRender: false,
      extensions: [
         StarterKit.configure({
            heading: {
               levels: [1, 2, 3],
            },
         }),
         Markdown,
         Placeholder.configure({
            placeholder,
         }),
         Underline,
         TextAlign.configure({
            types: ["heading", "paragraph"],
         }),
      ],
      content: value,
      editorProps: {
         attributes: {
            class: cn(
               "prose prose-sm max-w-none focus:outline-none",
               "px-4 py-3",
               className
            ),
            style: `min-height: ${minHeight}px`,
         },
      },
      onUpdate: ({ editor }) => {
         const markdown = editor.storage.markdown.getMarkdown();
         onChange(markdown);
      },
   });

   useEffect(() => {
      if (editor && value !== editor.storage.markdown.getMarkdown()) {
         editor.commands.setContent(value);
      }
   }, [value, editor]);

   if (!editor) {
      return null;
   }

   return (
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
         {/* Toolbar */}
         <div className="flex flex-wrap gap-1 p-2 border-b border-slate-200 bg-slate-50">
            <ToolbarButton
               onClick={() => editor.chain().focus().toggleBold().run()}
               isActive={editor.isActive("bold")}
               icon={<Bold className="w-4 h-4" />}
               title="Bold"
            />
            <ToolbarButton
               onClick={() => editor.chain().focus().toggleItalic().run()}
               isActive={editor.isActive("italic")}
               icon={<Italic className="w-4 h-4" />}
               title="Italic"
            />
            <ToolbarButton
               onClick={() => editor.chain().focus().toggleUnderline().run()}
               isActive={editor.isActive("underline")}
               icon={<UnderlineIcon className="w-4 h-4" />}
               title="Underline"
            />
            <ToolbarButton
               onClick={() => editor.chain().focus().toggleStrike().run()}
               isActive={editor.isActive("strike")}
               icon={<Strikethrough className="w-4 h-4" />}
               title="Strikethrough"
            />

            <div className="w-px h-6 bg-slate-300 mx-1" />

            <ToolbarButton
               onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
               }
               isActive={editor.isActive("heading", { level: 1 })}
               icon={<Heading1 className="w-4 h-4" />}
               title="Heading 1"
            />
            <ToolbarButton
               onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
               }
               isActive={editor.isActive("heading", { level: 2 })}
               icon={<Heading2 className="w-4 h-4" />}
               title="Heading 2"
            />
            <ToolbarButton
               onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
               }
               isActive={editor.isActive("heading", { level: 3 })}
               icon={<Heading3 className="w-4 h-4" />}
               title="Heading 3"
            />

            <div className="w-px h-6 bg-slate-300 mx-1" />

            <ToolbarButton
               onClick={() => editor.chain().focus().toggleBulletList().run()}
               isActive={editor.isActive("bulletList")}
               icon={<List className="w-4 h-4" />}
               title="Bullet List"
            />
            <ToolbarButton
               onClick={() => editor.chain().focus().toggleOrderedList().run()}
               isActive={editor.isActive("orderedList")}
               icon={<ListOrdered className="w-4 h-4" />}
               title="Numbered List"
            />

            <div className="w-px h-6 bg-slate-300 mx-1" />

            <ToolbarButton
               onClick={() => editor.chain().focus().setTextAlign("left").run()}
               isActive={editor.isActive({ textAlign: "left" })}
               icon={<AlignLeft className="w-4 h-4" />}
               title="Align Left"
            />
            <ToolbarButton
               onClick={() =>
                  editor.chain().focus().setTextAlign("center").run()
               }
               isActive={editor.isActive({ textAlign: "center" })}
               icon={<AlignCenter className="w-4 h-4" />}
               title="Align Center"
            />
            <ToolbarButton
               onClick={() =>
                  editor.chain().focus().setTextAlign("right").run()
               }
               isActive={editor.isActive({ textAlign: "right" })}
               icon={<AlignRight className="w-4 h-4" />}
               title="Align Right"
            />

            <div className="w-px h-6 bg-slate-300 mx-1" />

            <ToolbarButton
               onClick={() => editor.chain().focus().toggleCodeBlock().run()}
               isActive={editor.isActive("codeBlock")}
               icon={<Code className="w-4 h-4" />}
               title="Code Block"
            />
            <ToolbarButton
               onClick={() => editor.chain().focus().toggleBlockquote().run()}
               isActive={editor.isActive("blockquote")}
               icon={<Quote className="w-4 h-4" />}
               title="Quote"
            />

            <div className="w-px h-6 bg-slate-300 mx-1" />

            <ToolbarButton
               onClick={() => editor.chain().focus().undo().run()}
               isActive={false}
               icon={<Undo className="w-4 h-4" />}
               title="Undo"
            />
            <ToolbarButton
               onClick={() => editor.chain().focus().redo().run()}
               isActive={false}
               icon={<Redo className="w-4 h-4" />}
               title="Redo"
            />
         </div>

         {/* Editor Content */}
         <EditorContent editor={editor} />
      </div>
   );
};
