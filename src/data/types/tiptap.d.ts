import "@tiptap/core";

declare module "@tiptap/core" {
   // required to use "tiptap-markdown";
   interface Storage {
      markdown: {
         getMarkdown: () => string;
      };
   }
}
