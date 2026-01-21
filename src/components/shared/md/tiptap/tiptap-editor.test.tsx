import { render, screen, waitFor } from "@testing-library/react";
import { assertInDocument } from "@tests";
import { useEditor } from "@tiptap/react";

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

const assertRendered = () => {
   const editor = screen.getByTestId("tiptap-editor");
   const toolbar = screen.getByTestId("toolbar");
   // const editorContent = screen.getByTestId("editor-content");

   assertInDocument(toolbar);
   assertInDocument(editor);
   // assertInDocument(editorContent);
};

describe("TiptapEditor rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("TiptapEditor - renders with default props - test", async () => {
      const mockEditor = createMockEditor();
      mockUseEditor.mockReturnValue(mockEditor as any);

      const mockOnChange = jest.fn();
      const { container } = render(
         <TiptapEditor value="" onChange={mockOnChange} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   // it("TiptapEditor - renders with custom placeholder - test", async () => {
   //    const mockEditor = createMockEditor();
   //    mockUseEditor.mockReturnValue(mockEditor as any);

   //    const mockOnChange = jest.fn();
   //    const placeholder = "Custom placeholder text";

   //    render(
   //       <TiptapEditor
   //          value=""
   //          onChange={mockOnChange}
   //          placeholder={placeholder}
   //       />
   //    );

   //    await waitFor(() => {
   //       assertRendered();
   //    });

   //    // Verify useEditor was called with correct placeholder config
   //    expect(mockUseEditor).toHaveBeenCalledWith(
   //       expect.objectContaining({
   //          extensions: expect.arrayContaining([
   //             expect.objectContaining({
   //                name: "placeholder",
   //             }),
   //          ]),
   //       })
   //    );
   // });

   // it("TiptapEditor - renders with custom minHeight - test", async () => {
   //    const mockEditor = createMockEditor();
   //    mockUseEditor.mockReturnValue(mockEditor as any);

   //    const mockOnChange = jest.fn();
   //    const minHeight = 300;

   //    render(
   //       <TiptapEditor value="" onChange={mockOnChange} minHeight={minHeight} />
   //    );

   //    await waitFor(() => {
   //       const toolbar = screen.getByTestId("toolbar");
   //       assertInDocument(toolbar);
   //    });

   //    // Verify useEditor was called with correct style
   //    expect(mockUseEditor).toHaveBeenCalledWith(
   //       expect.objectContaining({
   //          editorProps: expect.objectContaining({
   //             attributes: expect.objectContaining({
   //                style: `min-height: ${minHeight}px`,
   //             }),
   //          }),
   //       })
   //    );
   // });

   // it("TiptapEditor - renders with custom className - test", async () => {
   //    const mockEditor = createMockEditor();
   //    mockUseEditor.mockReturnValue(mockEditor as any);

   //    const mockOnChange = jest.fn();
   //    const className = "custom-class";

   //    render(
   //       <TiptapEditor value="" onChange={mockOnChange} className={className} />
   //    );

   //    await waitFor(() => {
   //       const toolbar = screen.getByTestId("toolbar");
   //       assertInDocument(toolbar);
   //    });

   //    // Verify useEditor was called with className in attributes
   //    expect(mockUseEditor).toHaveBeenCalledWith(
   //       expect.objectContaining({
   //          editorProps: expect.objectContaining({
   //             attributes: expect.objectContaining({
   //                class: expect.stringContaining(className),
   //             }),
   //          }),
   //       })
   //    );
   // });

   // it("TiptapEditor - returns null when editor is not initialized - test", () => {
   //    mockUseEditor.mockReturnValue(null as any);

   //    const mockOnChange = jest.fn();
   //    const { container } = render(
   //       <TiptapEditor value="" onChange={mockOnChange} />
   //    );

   //    expect(container.firstChild).toBeNull();
   //    expect(screen.queryByTestId("toolbar")).not.toBeInTheDocument();
   //    expect(screen.queryByTestId("editor-content")).not.toBeInTheDocument();
   // });

   // it("TiptapEditor - renders container with correct classes - test", async () => {
   //    const mockEditor = createMockEditor();
   //    mockUseEditor.mockReturnValue(mockEditor as any);

   //    const mockOnChange = jest.fn();
   //    const { container } = render(
   //       <TiptapEditor value="" onChange={mockOnChange} />
   //    );

   //    await waitFor(() => {
   //       const toolbar = screen.getByTestId("toolbar");
   //       assertInDocument(toolbar);
   //    });

   //    const wrapper = container.querySelector("div");
   //    expect(wrapper).toHaveClass(
   //       "border",
   //       "border-slate-200",
   //       "rounded-lg",
   //       "overflow-hidden",
   //       "bg-white"
   //    );
   // });
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
