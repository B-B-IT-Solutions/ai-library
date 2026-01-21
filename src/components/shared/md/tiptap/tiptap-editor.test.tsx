import { render, screen, waitFor } from "@testing-library/react";
import {
   assertInDocument,
   assertNotInDocument,
   assertStringifyEqual,
} from "@tests";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";

import { cn } from "@/lib/utils";

import { TiptapEditor } from "./tiptap-editor";

// Mock the Toolbar component
jest.mock("./toolbar", () => ({
   Toolbar: ({ editor }: { editor: any }) => (
      <div data-testid="toolbar">Toolbar</div>
   ),
}));

const mockUseEditor = useEditor as jest.MockedFunction<typeof useEditor>;

const createMockEditor = (content: string = "") => {
   return {
      storage: {
         markdown: {
            getMarkdown: jest.fn(() => content),
         },
      },
      commands: {
         setContent: jest.fn(),
      },
      chain: jest.fn(() => ({
         focus: jest.fn().mockReturnThis(),
         toggleBold: jest.fn().mockReturnThis(),
         run: jest.fn(),
      })),
      isActive: jest.fn(() => false),
   };
};

type EditorConfigType = ReturnType<typeof createEditorConfig>;

const createEditorConfig = (
   value: string,
   placeholder = "Start typing...",
   minHeight = 200,
   className?: string
) => {
   return {
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
      onUpdate: expect.any(Function),
   };
};

const assertRendered = () => {
   const editor = screen.getByTestId("tiptap-editor");
   const toolbar = screen.getByTestId("toolbar");
   const editorContent = screen.getByTestId("editor-content");

   assertInDocument(toolbar);
   assertInDocument(editor);
   assertInDocument(editorContent);
};

const assertNotRendered = () => {
   const editor = screen.queryByTestId("tiptap-editor");
   assertNotInDocument(editor);
};

const assertEditorConfig = (
   expectedConfig: EditorConfigType,
   actualConfig: EditorConfigType
) => {
   expect(actualConfig.immediatelyRender).toEqual(
      expectedConfig.immediatelyRender
   );
   assertStringifyEqual(actualConfig.extensions, expectedConfig.extensions);
   expect(actualConfig.content).toEqual(expectedConfig.content);
   expect(actualConfig.editorProps).toEqual(expectedConfig.editorProps);
};

describe("TiptapEditor rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("TiptapEditor - editor null - test", async () => {
      mockUseEditor.mockReturnValue(null as any);

      const onChangeFn = jest.fn();
      const { container } = render(
         <TiptapEditor value="" onChange={onChangeFn} />
      );

      await waitFor(() => {
         assertNotRendered();
         expect(container.firstChild).toBeNull();
      });

      expect(container).toMatchSnapshot();
   });

   it("TiptapEditor - renders with default props - test", async () => {
      const mockEditor = createMockEditor();
      mockUseEditor.mockReturnValue(mockEditor as any);

      const value = "test 123";
      const onChangeFn = jest.fn();
      const { container } = render(
         <TiptapEditor value={value} onChange={onChangeFn} />
      );

      const expectedConfig = createEditorConfig(value);
      await waitFor(() => {
         assertRendered();
         expect(mockUseEditor).toHaveBeenCalledTimes(1);
         const actualConfig = mockUseEditor.mock
            .calls[0][0] as EditorConfigType;
         assertEditorConfig(expectedConfig, actualConfig);
      });

      expect(container).toMatchSnapshot();
   });

   it("TiptapEditor - renders with custom props - test", async () => {
      const mockEditor = createMockEditor();
      mockUseEditor.mockReturnValue(mockEditor as any);

      const value = "test 456";
      const placeholder = "placeholder 456";
      const minHeight = 500;
      const className = "flex-1";
      const onChangeFn = jest.fn();

      const { container } = render(
         <TiptapEditor
            value={value}
            placeholder={placeholder}
            minHeight={minHeight}
            className={className}
            onChange={onChangeFn}
         />
      );

      const expectedConfig = createEditorConfig(
         value,
         placeholder,
         minHeight,
         className
      );

      await waitFor(() => {
         assertRendered();
         expect(mockUseEditor).toHaveBeenCalledTimes(1);
         const actualConfig = mockUseEditor.mock
            .calls[0][0] as EditorConfigType;
         assertEditorConfig(expectedConfig, actualConfig);
      });

      expect(container).toMatchSnapshot();
   });
});

// describe("TiptapEditor functionality tests", () => {
//    beforeEach(() => {
//       jest.clearAllMocks();
//    });

//    it("TiptapEditor - useEditor called with correct configuration - test", () => {
//       const mockEditor = createMockEditor();
//       mockUseEditor.mockReturnValue(mockEditor as any);

//       const mockOnChange = jest.fn();
//       const value = "# Test content";

//       render(<TiptapEditor value={value} onChange={mockOnChange} />);

//       expect(mockUseEditor).toHaveBeenCalledWith(
//          expect.objectContaining({
//             immediatelyRender: false,
//             content: value,
//             extensions: expect.any(Array),
//             editorProps: expect.any(Object),
//             onUpdate: expect.any(Function),
//          })
//       );
//    });

//    it("TiptapEditor - useEditor called with StarterKit extension - test", () => {
//       const mockEditor = createMockEditor();
//       mockUseEditor.mockReturnValue(mockEditor as any);

//       const mockOnChange = jest.fn();

//       render(<TiptapEditor value="" onChange={mockOnChange} />);

//       const config = mockUseEditor.mock.calls[0][0];
//       expect(config.extensions).toBeDefined();
//       expect(config.extensions.length).toBeGreaterThan(0);
//    });

//    it("TiptapEditor - onChange called when editor updates - test", () => {
//       const mockEditor = createMockEditor("Updated content");
//       mockUseEditor.mockReturnValue(mockEditor as any);

//       const mockOnChange = jest.fn();

//       render(<TiptapEditor value="" onChange={mockOnChange} />);

//       // Get the onUpdate callback from useEditor
//       const onUpdateCallback = mockUseEditor.mock.calls[0][0].onUpdate;

//       // Simulate editor update
//       if (onUpdateCallback) {
//          onUpdateCallback({ editor: mockEditor as any });
//       }

//       expect(mockEditor.storage.markdown.getMarkdown).toHaveBeenCalled();
//       expect(mockOnChange).toHaveBeenCalledWith("Updated content");
//    });

//    it("TiptapEditor - setContent called when value prop changes - test", async () => {
//       const mockEditor = createMockEditor("");
//       mockUseEditor.mockReturnValue(mockEditor as any);

//       const mockOnChange = jest.fn();
//       const initialValue = "Initial content";

//       const { rerender } = render(
//          <TiptapEditor value={initialValue} onChange={mockOnChange} />
//       );

//       await waitFor(() => {
//          const toolbar = screen.getByTestId("toolbar");
//          assertInDocument(toolbar);
//       });

//       // Change the value prop
//       const newValue = "New content";
//       mockEditor.storage.markdown.getMarkdown.mockReturnValue(initialValue);

//       rerender(<TiptapEditor value={newValue} onChange={mockOnChange} />);

//       await waitFor(() => {
//          expect(mockEditor.commands.setContent).toHaveBeenCalledWith(newValue);
//       });
//    });

//    it("TiptapEditor - setContent not called when value is same as current content - test", async () => {
//       const currentContent = "Same content";
//       const mockEditor = createMockEditor(currentContent);
//       mockUseEditor.mockReturnValue(mockEditor as any);

//       const mockOnChange = jest.fn();

//       const { rerender } = render(
//          <TiptapEditor value={currentContent} onChange={mockOnChange} />
//       );

//       await waitFor(() => {
//          const toolbar = screen.getByTestId("toolbar");
//          assertInDocument(toolbar);
//       });

//       // Clear previous calls
//       jest.clearAllMocks();

//       // Rerender with same value
//       rerender(<TiptapEditor value={currentContent} onChange={mockOnChange} />);

//       // setContent should not be called since content hasn't changed
//       expect(mockEditor.commands.setContent).not.toHaveBeenCalled();
//    });

//    it("TiptapEditor - renders Toolbar component with editor - test", async () => {
//       const mockEditor = createMockEditor();
//       mockUseEditor.mockReturnValue(mockEditor as any);

//       const mockOnChange = jest.fn();

//       render(<TiptapEditor value="" onChange={mockOnChange} />);

//       await waitFor(() => {
//          const toolbar = screen.getByTestId("toolbar");
//          assertInDocument(toolbar);
//       });
//    });

//    it("TiptapEditor - renders EditorContent component with editor - test", async () => {
//       const mockEditor = createMockEditor();
//       mockUseEditor.mockReturnValue(mockEditor as any);

//       const mockOnChange = jest.fn();

//       render(<TiptapEditor value="" onChange={mockOnChange} />);

//       await waitFor(() => {
//          const editorContent = screen.getByTestId("editor-content");
//          assertInDocument(editorContent);
//       });
//    });

//    it("TiptapEditor - useEditor called with default placeholder - test", () => {
//       const mockEditor = createMockEditor();
//       mockUseEditor.mockReturnValue(mockEditor as any);

//       const mockOnChange = jest.fn();

//       render(<TiptapEditor value="" onChange={mockOnChange} />);

//       const config = mockUseEditor.mock.calls[0][0];
//       expect(config.extensions).toBeDefined();
//    });

//    it("TiptapEditor - useEditor called with default minHeight - test", () => {
//       const mockEditor = createMockEditor();
//       mockUseEditor.mockReturnValue(mockEditor as any);

//       const mockOnChange = jest.fn();

//       render(<TiptapEditor value="" onChange={mockOnChange} />);

//       expect(mockUseEditor).toHaveBeenCalledWith(
//          expect.objectContaining({
//             editorProps: expect.objectContaining({
//                attributes: expect.objectContaining({
//                   style: "min-height: 200px",
//                }),
//             }),
//          })
//       );
//    });
// });

// describe("TiptapEditor editor props tests", () => {
//    beforeEach(() => {
//       jest.clearAllMocks();
//    });

//    it("TiptapEditor - editor props contain correct CSS classes - test", () => {
//       const mockEditor = createMockEditor();
//       mockUseEditor.mockReturnValue(mockEditor as any);

//       const mockOnChange = jest.fn();

//       render(<TiptapEditor value="" onChange={mockOnChange} />);

//       const config = mockUseEditor.mock.calls[0][0];
//       expect(config.editorProps.attributes.class).toContain("prose");
//       expect(config.editorProps.attributes.class).toContain("prose-sm");
//       expect(config.editorProps.attributes.class).toContain("max-w-none");
//       expect(config.editorProps.attributes.class).toContain(
//          "focus:outline-none"
//       );
//       expect(config.editorProps.attributes.class).toContain("px-4");
//       expect(config.editorProps.attributes.class).toContain("py-3");
//    });

//    it("TiptapEditor - immediatelyRender is false - test", () => {
//       const mockEditor = createMockEditor();
//       mockUseEditor.mockReturnValue(mockEditor as any);

//       const mockOnChange = jest.fn();

//       render(<TiptapEditor value="" onChange={mockOnChange} />);

//       const config = mockUseEditor.mock.calls[0][0];
//       expect(config.immediatelyRender).toBe(false);
//    });
// });
