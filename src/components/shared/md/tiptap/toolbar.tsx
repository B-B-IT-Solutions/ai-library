"use client";

import { FC } from "react";
import { Editor } from "@tiptap/react";
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

import { ToolbarButton } from "./toolbar-button";

type ToolbarProps = {
   editor: Editor;
};

const divider = () => {
   return <div className="w-px h-6 bg-slate-300 mx-1" />;
};

export const Toolbar: FC<ToolbarProps> = ({ editor }) => {
   return (
      <div
         className="flex flex-wrap gap-1 p-2 border-b border-slate-200 bg-slate-50"
         data-testid="toolbar"
      >
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

         {divider()}

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

         {divider()}

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

         {divider()}

         <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
            icon={<AlignLeft className="w-4 h-4" />}
            title="Align Left"
         />
         <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
            icon={<AlignCenter className="w-4 h-4" />}
            title="Align Center"
         />
         <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
            icon={<AlignRight className="w-4 h-4" />}
            title="Align Right"
         />

         {divider()}

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

         {divider()}

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
   );
};
