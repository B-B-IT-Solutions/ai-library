export const useEditor = jest.fn();

export const EditorContent = ({ editor }: { editor: any }) => {
   console.log("editor-content");
   return <div data-testid="editor-content">Editor Content</div>;
};
