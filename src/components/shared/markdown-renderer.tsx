"use client";

import { useEffect } from "react";
import Typography from "@tiptap/extension-typography";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { marked } from "marked";

type MarkdownRendererProps = {
   content: string;
   className?: string;
};

export function MarkdownRenderer({
   content,
   className = "",
}: MarkdownRendererProps) {
   const editor = useEditor({
      extensions: [StarterKit, Typography],
      content: "",
      editable: false,
      immediatelyRender: false,
      editorProps: {
         attributes: {
            class: "prose prose-slate max-w-none focus:outline-none",
         },
      },
   });

   useEffect(() => {
      if (!editor || !content) {
         return;
      }

      const parseMarkdown = async () => {
         const html = await marked.parse(content);
         editor.commands.setContent(html);
      };

      parseMarkdown();
   }, [content, editor]);

   return <EditorContent editor={editor} className={className} />;
}
