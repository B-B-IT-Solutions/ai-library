import { render } from "@testing-library/react";

import { components } from "./components";

describe("List components rendering tests", () => {
   it("ul - renders unordered list with correct classes", () => {
      const UlComponent = components.ul!;
      const { container } = render(
         <UlComponent>
            <li>Item 1</li>
            <li>Item 2</li>
         </UlComponent>
      );

      const ul = container.querySelector("ul");
      expect(ul).toHaveClass("list-disc", "list-inside", "space-y-1", "my-2");
      expect(container).toMatchSnapshot();
   });

   it("ol - renders ordered list with correct classes", () => {
      const OlComponent = components.ol!;
      const { container } = render(
         <OlComponent>
            <li>Item 1</li>
            <li>Item 2</li>
         </OlComponent>
      );

      const ol = container.querySelector("ol");
      expect(ol).toHaveClass(
         "list-decimal",
         "list-inside",
         "space-y-1",
         "my-2"
      );
      expect(container).toMatchSnapshot();
   });

   it("li - renders list item with correct classes", () => {
      const LiComponent = components.li!;
      const { container } = render(<LiComponent>List item</LiComponent>);

      const li = container.querySelector("li");
      expect(li).toHaveClass("ml-4");
      expect(container).toMatchSnapshot();
   });
});

describe("Paragraph component rendering tests", () => {
   it("p - renders paragraph without alignment", () => {
      const PComponent = components.p!;
      const { container } = render(
         <PComponent node={{ properties: {} } as any}>
            Paragraph text
         </PComponent>
      );

      const p = container.querySelector("p");
      expect(p).toHaveClass("my-2");
      expect(container).toMatchSnapshot();
   });

   it("p - renders paragraph with center alignment", () => {
      const PComponent = components.p!;
      const { container } = render(
         <PComponent node={{ properties: { align: "center" } } as any}>
            Centered text
         </PComponent>
      );

      const p = container.querySelector("p");
      expect(p).toHaveClass("my-2", "text-center");
      expect(container).toMatchSnapshot();
   });

   it("p - renders paragraph with right alignment", () => {
      const PComponent = components.p!;
      const { container } = render(
         <PComponent node={{ properties: { align: "right" } } as any}>
            Right aligned text
         </PComponent>
      );

      const p = container.querySelector("p");
      expect(p).toHaveClass("my-2", "text-right");
      expect(container).toMatchSnapshot();
   });

   it("p - renders paragraph with left alignment", () => {
      const PComponent = components.p!;
      const { container } = render(
         <PComponent node={{ properties: { align: "left" } } as any}>
            Left aligned text
         </PComponent>
      );

      const p = container.querySelector("p");
      expect(p).toHaveClass("my-2", "text-left");
      expect(container).toMatchSnapshot();
   });
});

describe("Heading components rendering tests", () => {
   it("h1 - renders heading without alignment", () => {
      const H1Component = components.h1!;
      const { container } = render(
         <H1Component node={{ properties: {} } as any}>Heading 1</H1Component>
      );

      const h1 = container.querySelector("h1");
      expect(h1).toHaveClass("text-2xl", "font-bold", "my-3");
      expect(container).toMatchSnapshot();
   });

   it("h1 - renders heading with center alignment", () => {
      const H1Component = components.h1!;
      const { container } = render(
         <H1Component node={{ properties: { align: "center" } } as any}>
            Centered Heading 1
         </H1Component>
      );

      const h1 = container.querySelector("h1");
      expect(h1).toHaveClass("text-2xl", "font-bold", "my-3", "text-center");
      expect(container).toMatchSnapshot();
   });

   it("h1 - renders heading with right alignment", () => {
      const H1Component = components.h1!;
      const { container } = render(
         <H1Component node={{ properties: { align: "right" } } as any}>
            Right Aligned Heading 1
         </H1Component>
      );

      const h1 = container.querySelector("h1");
      expect(h1).toHaveClass("text-2xl", "font-bold", "my-3", "text-right");
      expect(container).toMatchSnapshot();
   });

   it("h1 - renders heading with left alignment", () => {
      const H1Component = components.h1!;
      const { container } = render(
         <H1Component node={{ properties: { align: "left" } } as any}>
            Left Aligned Heading 1
         </H1Component>
      );

      const h1 = container.querySelector("h1");
      expect(h1).toHaveClass("text-2xl", "font-bold", "my-3", "text-left");
      expect(container).toMatchSnapshot();
   });

   it("h2 - renders heading without alignment", () => {
      const H2Component = components.h2!;
      const { container } = render(
         <H2Component node={{ properties: {} } as any}>Heading 2</H2Component>
      );

      const h2 = container.querySelector("h2");
      expect(h2).toHaveClass("text-xl", "font-bold", "my-2");
      expect(container).toMatchSnapshot();
   });

   it("h2 - renders heading with center alignment", () => {
      const H2Component = components.h2!;
      const { container } = render(
         <H2Component node={{ properties: { align: "center" } } as any}>
            Centered Heading 2
         </H2Component>
      );

      const h2 = container.querySelector("h2");
      expect(h2).toHaveClass("text-xl", "font-bold", "my-2", "text-center");
      expect(container).toMatchSnapshot();
   });

   it("h2 - renders heading with right alignment", () => {
      const H2Component = components.h2!;
      const { container } = render(
         <H2Component node={{ properties: { align: "right" } } as any}>
            Right Aligned Heading 2
         </H2Component>
      );

      const h2 = container.querySelector("h2");
      expect(h2).toHaveClass("text-xl", "font-bold", "my-2", "text-right");
      expect(container).toMatchSnapshot();
   });

   it("h2 - renders heading with left alignment", () => {
      const H2Component = components.h2!;
      const { container } = render(
         <H2Component node={{ properties: { align: "left" } } as any}>
            Left Aligned Heading 2
         </H2Component>
      );

      const h2 = container.querySelector("h2");
      expect(h2).toHaveClass("text-xl", "font-bold", "my-2", "text-left");
      expect(container).toMatchSnapshot();
   });

   it("h3 - renders heading without alignment", () => {
      const H3Component = components.h3!;
      const { container } = render(
         <H3Component node={{ properties: {} } as any}>Heading 3</H3Component>
      );

      const h3 = container.querySelector("h3");
      expect(h3).toHaveClass("text-lg", "font-bold", "my-2");
      expect(container).toMatchSnapshot();
   });

   it("h3 - renders heading with center alignment", () => {
      const H3Component = components.h3!;
      const { container } = render(
         <H3Component node={{ properties: { align: "center" } } as any}>
            Centered Heading 3
         </H3Component>
      );

      const h3 = container.querySelector("h3");
      expect(h3).toHaveClass("text-lg", "font-bold", "my-2", "text-center");
      expect(container).toMatchSnapshot();
   });

   it("h3 - renders heading with right alignment", () => {
      const H3Component = components.h3!;
      const { container } = render(
         <H3Component node={{ properties: { align: "right" } } as any}>
            Right Aligned Heading 3
         </H3Component>
      );

      const h3 = container.querySelector("h3");
      expect(h3).toHaveClass("text-lg", "font-bold", "my-2", "text-right");
      expect(container).toMatchSnapshot();
   });

   it("h3 - renders heading with left alignment", () => {
      const H3Component = components.h3!;
      const { container } = render(
         <H3Component node={{ properties: { align: "left" } } as any}>
            Left Aligned Heading 3
         </H3Component>
      );

      const h3 = container.querySelector("h3");
      expect(h3).toHaveClass("text-lg", "font-bold", "my-2", "text-left");
      expect(container).toMatchSnapshot();
   });
});

describe("Code component rendering tests", () => {
   it("code - renders inline code without className", () => {
      const CodeComponent = components.code!;
      const { container } = render(<CodeComponent>inline code</CodeComponent>);

      const code = container.querySelector("code");
      expect(code).toHaveClass(
         "bg-slate-100",
         "px-1.5",
         "py-0.5",
         "rounded",
         "text-sm",
         "font-mono"
      );
      expect(container.querySelector("pre")).toBeNull();
      expect(container).toMatchSnapshot();
   });

   it("code - renders block code with className", () => {
      const CodeComponent = components.code!;
      const { container } = render(
         <CodeComponent className="language-javascript">
            const x = 10;
         </CodeComponent>
      );

      const pre = container.querySelector("pre");
      expect(pre).toHaveClass(
         "bg-slate-100",
         "p-3",
         "rounded",
         "my-2",
         "overflow-x-auto"
      );

      const code = container.querySelector("code");
      expect(code).toHaveClass("text-sm", "font-mono");
      expect(container).toMatchSnapshot();
   });
});

describe("Formatting components rendering tests", () => {
   it("blockquote - renders blockquote with correct classes", () => {
      const BlockquoteComponent = components.blockquote!;
      const { container } = render(
         <BlockquoteComponent>Quote text</BlockquoteComponent>
      );

      const blockquote = container.querySelector("blockquote");
      expect(blockquote).toHaveClass(
         "border-l-4",
         "border-slate-300",
         "pl-4",
         "italic",
         "my-2"
      );
      expect(container).toMatchSnapshot();
   });

   it("strong - renders bold text with correct classes", () => {
      const StrongComponent = components.strong!;
      const { container } = render(
         <StrongComponent>Bold text</StrongComponent>
      );

      const strong = container.querySelector("strong");
      expect(strong).toHaveClass("font-bold");
      expect(container).toMatchSnapshot();
   });

   it("em - renders italic text with correct classes", () => {
      const EmComponent = components.em!;
      const { container } = render(<EmComponent>Italic text</EmComponent>);

      const em = container.querySelector("em");
      expect(em).toHaveClass("italic");
      expect(container).toMatchSnapshot();
   });

   it("del - renders strikethrough text with correct classes", () => {
      const DelComponent = components.del!;
      const { container } = render(<DelComponent>Deleted text</DelComponent>);

      const del = container.querySelector("del");
      expect(del).toHaveClass("line-through", "text-slate-500");
      expect(container).toMatchSnapshot();
   });

   it("u - renders underlined text with correct classes", () => {
      const UComponent = components.u!;
      const { container } = render(<UComponent>Underlined text</UComponent>);

      const u = container.querySelector("u");
      expect(u).toHaveClass("underline");
      expect(container).toMatchSnapshot();
   });
});

describe("Utility components rendering tests", () => {
   it("hr - renders horizontal rule with correct classes", () => {
      const HrComponent = components.hr!;
      const { container } = render(<HrComponent />);

      const hr = container.querySelector("hr");
      expect(hr).toHaveClass("my-4", "border-slate-300");
      expect(container).toMatchSnapshot();
   });

   it("br - renders line break", () => {
      const BrComponent = components.br!;
      const { container } = render(<BrComponent />);

      const br = container.querySelector("br");
      expect(br).toBeInTheDocument();
      expect(container).toMatchSnapshot();
   });
});
