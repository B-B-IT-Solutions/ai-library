export { type UseEditorOptions } from "@tiptap/react";
import * as tiptap from "@tiptap/react";

export class Editor {
   public storage: any;
   public commands: any;
   public isActive: jest.Mock;
   public chain: jest.Mock;
   private _chainMethods: any;

   constructor(options: Partial<tiptap.EditorOptions> = {}) {
      this.storage = {
         markdown: {
            getMarkdown: jest.fn(() => options.content || ""),
         },
      };

      this.commands = {
         setContent: jest.fn(),
      };

      // Create a single instance of chain methods that will be reused
      this._chainMethods = {
         focus: jest.fn().mockReturnThis(),
         toggleBold: jest.fn().mockReturnThis(),
         toggleItalic: jest.fn().mockReturnThis(),
         toggleUnderline: jest.fn().mockReturnThis(),
         toggleStrike: jest.fn().mockReturnThis(),
         toggleHeading: jest.fn().mockReturnThis(),
         toggleBulletList: jest.fn().mockReturnThis(),
         toggleOrderedList: jest.fn().mockReturnThis(),
         setTextAlign: jest.fn().mockReturnThis(),
         toggleCodeBlock: jest.fn().mockReturnThis(),
         toggleBlockquote: jest.fn().mockReturnThis(),
         undo: jest.fn().mockReturnThis(),
         redo: jest.fn().mockReturnThis(),
         run: jest.fn(),
      };

      // Chain method returns the same instance every time
      this.chain = jest.fn(() => this._chainMethods);

      this.isActive = jest.fn(() => false);
   }
}

export const useEditor = jest.fn().mockReturnValue(new Editor());

export const EditorContent = ({ editor }: { editor: Editor }) => {
   return <div data-testid="editor-content">Editor Content</div>;
};
