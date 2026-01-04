import { render, screen } from "@testing-library/react";
import { assertInDocument } from "@tests";

import { MarkdownRenderer } from "./markdown-renderer";

const assertRendered = (container: HTMLElement) => {
   const renderer = screen.getByTestId("markdown-renderer");
   assertInDocument(renderer);
};

describe("MarkdownRenderer rendering tests", () => {
   it("MarkdownRenderer - classnem undefined - rendered test", () => {
      const { container } = render(
         <MarkdownRenderer> text 1</MarkdownRenderer>
      );

      assertRendered(container);

      expect(container).toMatchSnapshot();
   });

   it("MarkdownRenderer - classnem defined - rendered test", () => {
      const { container } = render(
         <MarkdownRenderer className="flex-1"> text 1</MarkdownRenderer>
      );

      assertRendered(container);

      expect(container).toMatchSnapshot();
   });
});
