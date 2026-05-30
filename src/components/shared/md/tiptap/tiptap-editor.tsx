"use client";

import "./tiptap-editor.css";

import { FC, useEffect } from "react";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";

import { cn } from "@/lib/utils";

import { Toolbar } from "./toolbar";

type TiptapEditorProps = {
   value?: string;
   onChange: (value: string) => void;
   placeholder?: string;
   minHeight?: number;
   className?: string;
   "data-testid"?: string;
};

export const TiptapEditor: FC<TiptapEditorProps> = ({
   value = "",
   onChange,
   placeholder = "Start typing...",
   minHeight = 200,
   className,
   "data-testid": testid = "tiptap-editor",
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
         Underline,
         Placeholder.configure({
            placeholder,
         }),
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
      <div
         className="border border-slate-200 rounded-lg overflow-hidden bg-white"
         data-testid={testid}
      >
         <Toolbar editor={editor} />
         <EditorContent editor={editor} />
      </div>
   );
};
