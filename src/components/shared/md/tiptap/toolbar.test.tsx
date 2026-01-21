import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument } from "@tests";
import { Editor } from "@tiptap/react";
import { isObject } from "es-toolkit/compat";

import { Toolbar } from "./toolbar";

// Create chainable mock methods
const createChainableMock = () => {
   const methods = {
      focus: jest.fn(),
      toggleBold: jest.fn(),
      toggleItalic: jest.fn(),
      toggleUnderline: jest.fn(),
      toggleStrike: jest.fn(),
      toggleHeading: jest.fn(),
      toggleBulletList: jest.fn(),
      toggleOrderedList: jest.fn(),
      setTextAlign: jest.fn(),
      toggleCodeBlock: jest.fn(),
      toggleBlockquote: jest.fn(),
      undo: jest.fn(),
      redo: jest.fn(),
      run: jest.fn(),
   };

   // Make all methods return the methods object for chaining
   Object.keys(methods).forEach((key) => {
      methods[key as keyof typeof methods].mockReturnValue(methods);
   });

   return methods;
};

const createMockEditor = (activeStates: Record<string, boolean> = {}) => {
   const chainMethods = createChainableMock();

   return {
      chain: jest.fn(() => chainMethods),
      isActive: jest.fn((format: string, params?: any) => {
         if (params) {
            const key = `${format}-${JSON.stringify(params)}`;
            return activeStates[key] || false;
         }
         if (isObject(format)) {
            const key = JSON.stringify(format);
            return activeStates[key] || false;
         }
         return activeStates[format] || false;
      }),
   } as unknown as Editor;
};

const assertRendered = () => {
   const toolbar = screen.getByTestId("toolbar");
   assertInDocument(toolbar);
};

const assertButtonsRendered = () => {
   const buttons = screen.getAllByRole("button");
   expect(buttons).toHaveLength(16);

   expect(screen.getByTitle("Bold")).toBeInTheDocument();
   expect(screen.getByTitle("Italic")).toBeInTheDocument();
   expect(screen.getByTitle("Underline")).toBeInTheDocument();
   expect(screen.getByTitle("Strikethrough")).toBeInTheDocument();
   expect(screen.getByTitle("Heading 1")).toBeInTheDocument();
   expect(screen.getByTitle("Heading 2")).toBeInTheDocument();
   expect(screen.getByTitle("Heading 3")).toBeInTheDocument();
   expect(screen.getByTitle("Bullet List")).toBeInTheDocument();
   expect(screen.getByTitle("Numbered List")).toBeInTheDocument();
   expect(screen.getByTitle("Align Left")).toBeInTheDocument();
   expect(screen.getByTitle("Align Center")).toBeInTheDocument();
   expect(screen.getByTitle("Align Right")).toBeInTheDocument();
   expect(screen.getByTitle("Code Block")).toBeInTheDocument();
   expect(screen.getByTitle("Quote")).toBeInTheDocument();
   expect(screen.getByTitle("Undo")).toBeInTheDocument();
   expect(screen.getByTitle("Redo")).toBeInTheDocument();
};

describe("Toolbar rendering tests", () => {
   it("Toolbar - rendered - test", async () => {
      const mockEditor = createMockEditor();
      const { container } = render(<Toolbar editor={mockEditor} />);

      await waitFor(() => {
         assertRendered();
         assertButtonsRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("Toolbar button active states", () => {
   it("Toolbar - bold button is active when bold is active", async () => {
      const mockEditor = createMockEditor({ bold: true });
      render(<Toolbar editor={mockEditor} />);

      await waitFor(() => {
         assertRendered();
      });

      const boldButton = screen.getByTitle("Bold");
      expect(boldButton).toHaveClass("bg-slate-200", "text-blue-600");
   });

   it("Toolbar - italic button is active when italic is active", async () => {
      const mockEditor = createMockEditor({ italic: true });
      render(<Toolbar editor={mockEditor} />);

      await waitFor(() => {
         assertRendered();
      });

      const italicButton = screen.getByTitle("Italic");
      expect(italicButton).toHaveClass("bg-slate-200", "text-blue-600");
   });

   it("Toolbar - heading buttons are active based on heading level", async () => {
      const mockEditor = createMockEditor({
         'heading-{"level":1}': true,
      });
      render(<Toolbar editor={mockEditor} />);

      await waitFor(() => {
         assertRendered();
      });

      const h1Button = screen.getByTitle("Heading 1");
      const h2Button = screen.getByTitle("Heading 2");
      const h3Button = screen.getByTitle("Heading 3");

      expect(h1Button).toHaveClass("bg-slate-200", "text-blue-600");
      expect(h2Button).not.toHaveClass("bg-slate-200", "text-blue-600");
      expect(h3Button).not.toHaveClass("bg-slate-200", "text-blue-600");
   });

   it("Toolbar - list buttons are active when lists are active", async () => {
      const mockEditor = createMockEditor({
         bulletList: true,
      });
      render(<Toolbar editor={mockEditor} />);

      await waitFor(() => {
         assertRendered();
      });

      const bulletButton = screen.getByTitle("Bullet List");
      const orderedButton = screen.getByTitle("Numbered List");

      expect(bulletButton).toHaveClass("bg-slate-200", "text-blue-600");
      expect(orderedButton).not.toHaveClass("bg-slate-200", "text-blue-600");
   });

   it("Toolbar - alignment buttons are active based on text alignment", async () => {
      const textAlignKey = JSON.stringify({ textAlign: "center" });
      const mockEditor = createMockEditor({
         [textAlignKey]: true,
      });
      render(<Toolbar editor={mockEditor} />);

      await waitFor(() => {
         assertRendered();
      });

      const leftButton = screen.getByTitle("Align Left");
      const centerButton = screen.getByTitle("Align Center");
      const rightButton = screen.getByTitle("Align Right");

      expect(leftButton).not.toHaveClass("bg-slate-200", "text-blue-600");
      expect(centerButton).toHaveClass("bg-slate-200", "text-blue-600");
      expect(rightButton).not.toHaveClass("bg-slate-200", "text-blue-600");
   });

   it("Toolbar - undo and redo buttons are never active", async () => {
      const mockEditor = createMockEditor();
      render(<Toolbar editor={mockEditor} />);

      await waitFor(() => {
         assertRendered();
      });

      const undoButton = screen.getByTitle("Undo");
      const redoButton = screen.getByTitle("Redo");

      expect(undoButton).not.toHaveClass("bg-slate-200", "text-blue-600");
      expect(redoButton).not.toHaveClass("bg-slate-200", "text-blue-600");
   });
});

describe("Toolbar functionality tests", () => {
   it("Toolbar - isActive called for all format checks - test", async () => {
      const mockEditor = createMockEditor();
      render(<Toolbar editor={mockEditor} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(mockEditor.isActive).toHaveBeenCalledTimes(14);
      expect(mockEditor.isActive).toHaveBeenCalledWith("bold");
      expect(mockEditor.isActive).toHaveBeenCalledWith("italic");
      expect(mockEditor.isActive).toHaveBeenCalledWith("underline");
      expect(mockEditor.isActive).toHaveBeenCalledWith("strike");
      expect(mockEditor.isActive).toHaveBeenCalledWith("heading", { level: 1 });
      expect(mockEditor.isActive).toHaveBeenCalledWith("heading", { level: 2 });
      expect(mockEditor.isActive).toHaveBeenCalledWith("heading", { level: 3 });
      expect(mockEditor.isActive).toHaveBeenCalledWith("bulletList");
      expect(mockEditor.isActive).toHaveBeenCalledWith("orderedList");
      expect(mockEditor.isActive).toHaveBeenCalledWith({ textAlign: "left" });
      expect(mockEditor.isActive).toHaveBeenCalledWith({ textAlign: "center" });
      expect(mockEditor.isActive).toHaveBeenCalledWith({ textAlign: "right" });
      expect(mockEditor.isActive).toHaveBeenCalledWith("codeBlock");
      expect(mockEditor.isActive).toHaveBeenCalledWith("blockquote");
   });

   it("Toolbar - bold btn clicked - test", async () => {
      const mockEditor = createMockEditor();
      render(<Toolbar editor={mockEditor} />);

      await waitFor(() => {
         assertRendered();
      });

      const boldButton = screen.getByTitle("Bold");
      await userEvent.click(boldButton);

      expect(mockEditor.chain).toHaveBeenCalled();
      const chain = mockEditor.chain();
      expect(chain.focus).toHaveBeenCalledTimes(1);
      expect(chain.toggleBold).toHaveBeenCalled();
      expect(chain.run).toHaveBeenCalledTimes(1);
   });

   it("Toolbar - italic btn clicked - test", async () => {
      const mockEditor = createMockEditor();
      render(<Toolbar editor={mockEditor} />);

      await waitFor(() => {
         assertRendered();
      });

      const italicButton = screen.getByTitle("Italic");
      await userEvent.click(italicButton);

      const chain = mockEditor.chain();
      expect(chain.focus).toHaveBeenCalledTimes(1);
      expect(chain.toggleItalic).toHaveBeenCalled();
      expect(chain.run).toHaveBeenCalledTimes(1);
   });

   it("Toolbar - underline btn clicked - test", async () => {
      const mockEditor = createMockEditor();
      render(<Toolbar editor={mockEditor} />);

      await waitFor(() => {
         assertRendered();
      });

      const underlineBtn = screen.getByTitle("Underline");
      await userEvent.click(underlineBtn);

      const chain = mockEditor.chain();
      expect(chain.focus).toHaveBeenCalledTimes(1);
      expect(chain.toggleUnderline).toHaveBeenCalled();
      expect(chain.run).toHaveBeenCalledTimes(1);
   });

   it("Toolbar - underline btn clicked - test", async () => {
      const mockEditor = createMockEditor();
      render(<Toolbar editor={mockEditor} />);

      await waitFor(() => {
         assertRendered();
      });

      const strikethroughBtn = screen.getByTitle("Strikethrough");
      await userEvent.click(strikethroughBtn);

      const chain = mockEditor.chain();
      expect(chain.focus).toHaveBeenCalledTimes(1);
      expect(chain.toggleStrike).toHaveBeenCalledTimes(1);
      expect(chain.run).toHaveBeenCalledTimes(1);
   });

   it("Toolbar - heading 1 btn clicked - test with correct params", async () => {
      const mockEditor = createMockEditor();
      render(<Toolbar editor={mockEditor} />);

      await waitFor(() => {
         assertRendered();
      });

      const h1Button = screen.getByTitle("Heading 1");
      await userEvent.click(h1Button);

      const chain = mockEditor.chain();
      expect(chain.focus).toHaveBeenCalledTimes(1);
      expect(chain.toggleHeading).toHaveBeenCalledTimes(1);
      expect(chain.toggleHeading).toHaveBeenCalledWith({ level: 1 });
      expect(chain.run).toHaveBeenCalledTimes(1);
   });

   it("Toolbar - heading 2 btn clicked - test with correct params", async () => {
      const mockEditor = createMockEditor();
      render(<Toolbar editor={mockEditor} />);

      await waitFor(() => {
         assertRendered();
      });

      const h1Button = screen.getByTitle("Heading 2");
      await userEvent.click(h1Button);

      const chain = mockEditor.chain();
      expect(chain.focus).toHaveBeenCalledTimes(1);
      expect(chain.toggleHeading).toHaveBeenCalledTimes(1);
      expect(chain.toggleHeading).toHaveBeenCalledWith({ level: 2 });
      expect(chain.run).toHaveBeenCalledTimes(1);
   });

   it("Toolbar - heading 3 btn clicked - test with correct params", async () => {
      const mockEditor = createMockEditor();
      render(<Toolbar editor={mockEditor} />);

      await waitFor(() => {
         assertRendered();
      });

      const h1Button = screen.getByTitle("Heading 3");
      await userEvent.click(h1Button);

      const chain = mockEditor.chain();
      expect(chain.focus).toHaveBeenCalledTimes(1);
      expect(chain.toggleHeading).toHaveBeenCalledTimes(1);
      expect(chain.toggleHeading).toHaveBeenCalledWith({ level: 3 });
      expect(chain.run).toHaveBeenCalledTimes(1);
   });

   it("Toolbar - bullet list btn clicked - test", async () => {
      const mockEditor = createMockEditor();
      render(<Toolbar editor={mockEditor} />);

      await waitFor(() => {
         assertRendered();
      });

      const bulletButton = screen.getByTitle("Bullet List");
      await userEvent.click(bulletButton);

      const chain = mockEditor.chain();
      expect(chain.focus).toHaveBeenCalledTimes(1);
      expect(chain.toggleBulletList).toHaveBeenCalledTimes(1);
      expect(chain.run).toHaveBeenCalledTimes(1);
   });

   it("Toolbar - ordered list btn clicked - test", async () => {
      const mockEditor = createMockEditor();
      render(<Toolbar editor={mockEditor} />);

      await waitFor(() => {
         assertRendered();
      });

      const orderedButton = screen.getByTitle("Numbered List");
      await userEvent.click(orderedButton);

      const chain = mockEditor.chain();
      expect(chain.focus).toHaveBeenCalledTimes(1);
      expect(chain.toggleOrderedList).toHaveBeenCalledTimes(1);
      expect(chain.run).toHaveBeenCalledTimes(1);
   });

   it("Toolbar - align left btn clicked - test", async () => {
      const mockEditor = createMockEditor();
      render(<Toolbar editor={mockEditor} />);

      await waitFor(() => {
         assertRendered();
      });

      const letBtn = screen.getByTitle("Align Left");
      await userEvent.click(letBtn);

      const chain = mockEditor.chain();
      expect(chain.focus).toHaveBeenCalledTimes(1);
      expect(chain.setTextAlign).toHaveBeenCalledTimes(1);
      expect(chain.setTextAlign).toHaveBeenCalledWith("left");
      expect(chain.run).toHaveBeenCalledTimes(1);
   });

   it("Toolbar - align center btn clicked - test", async () => {
      const mockEditor = createMockEditor();
      render(<Toolbar editor={mockEditor} />);

      await waitFor(() => {
         assertRendered();
      });

      const centerButton = screen.getByTitle("Align Center");
      await userEvent.click(centerButton);

      const chain = mockEditor.chain();
      expect(chain.focus).toHaveBeenCalledTimes(1);
      expect(chain.setTextAlign).toHaveBeenCalledTimes(1);
      expect(chain.setTextAlign).toHaveBeenCalledWith("center");
      expect(chain.run).toHaveBeenCalledTimes(1);
   });

   it("Toolbar - align right btn clicked - test", async () => {
      const mockEditor = createMockEditor();
      render(<Toolbar editor={mockEditor} />);

      await waitFor(() => {
         assertRendered();
      });

      const letBtn = screen.getByTitle("Align Right");
      await userEvent.click(letBtn);

      const chain = mockEditor.chain();
      expect(chain.focus).toHaveBeenCalledTimes(1);
      expect(chain.setTextAlign).toHaveBeenCalledTimes(1);
      expect(chain.setTextAlign).toHaveBeenCalledWith("right");
      expect(chain.run).toHaveBeenCalledTimes(1);
   });

   it("Toolbar - code block btn clicked - test", async () => {
      const mockEditor = createMockEditor();
      render(<Toolbar editor={mockEditor} />);

      await waitFor(() => {
         assertRendered();
      });

      const codeButton = screen.getByTitle("Code Block");
      await userEvent.click(codeButton);

      const chain = mockEditor.chain();
      expect(chain.focus).toHaveBeenCalledTimes(1);
      expect(chain.toggleCodeBlock).toHaveBeenCalledTimes(1);
      expect(chain.run).toHaveBeenCalledTimes(1);
   });

   it("Toolbar - blockquote btn clicked - test", async () => {
      const mockEditor = createMockEditor();
      render(<Toolbar editor={mockEditor} />);

      await waitFor(() => {
         assertRendered();
      });

      const quoteButton = screen.getByTitle("Quote");
      await userEvent.click(quoteButton);

      const chain = mockEditor.chain();
      expect(chain.focus).toHaveBeenCalledTimes(1);
      expect(chain.toggleBlockquote).toHaveBeenCalledTimes(1);
      expect(chain.run).toHaveBeenCalledTimes(1);
   });

   it("Toolbar - undo btn clicked - test", async () => {
      const mockEditor = createMockEditor();
      render(<Toolbar editor={mockEditor} />);

      await waitFor(() => {
         assertRendered();
      });

      const undoButton = screen.getByTitle("Undo");
      await userEvent.click(undoButton);

      const chain = mockEditor.chain();
      expect(chain.focus).toHaveBeenCalledTimes(1);
      expect(chain.undo).toHaveBeenCalledTimes(1);
      expect(chain.run).toHaveBeenCalledTimes(1);
   });

   it("Toolbar - redo btn clicked - test", async () => {
      const mockEditor = createMockEditor();
      render(<Toolbar editor={mockEditor} />);

      await waitFor(() => {
         assertRendered();
      });

      const redoButton = screen.getByTitle("Redo");
      await userEvent.click(redoButton);

      const chain = mockEditor.chain();
      expect(chain.focus).toHaveBeenCalledTimes(1);
      expect(chain.redo).toHaveBeenCalledTimes(1);
      expect(chain.run).toHaveBeenCalledTimes(1);
   });
});
