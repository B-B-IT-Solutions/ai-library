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

describe("TiptapEditor functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("TiptapEditor - onChange called when editor updates - test", async () => {
      const mockEditor = createMockEditor("Updated content");
      mockUseEditor.mockReturnValue(mockEditor as any);

      const onChangeFn = jest.fn();

      render(<TiptapEditor value="" onChange={onChangeFn} />);

      await waitFor(() => {
         assertRendered();
         expect(mockUseEditor).toHaveBeenCalledTimes(1);
      });

      const onUpdateCallback = mockUseEditor.mock.calls[0][0].onUpdate;
      // Simulate editor update
      if (onUpdateCallback) {
         onUpdateCallback({ editor: mockEditor as any });
      }

      expect(mockEditor.storage.markdown.getMarkdown).toHaveBeenCalled();
      expect(onChangeFn).toHaveBeenCalledWith("Updated content");
   });
});
