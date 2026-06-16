import { render, screen } from "@testing-library/react";
import { assertInDocument } from "@tests";

import { DListViewMode } from "@/data/types/domain/common";

import { PromptsSkeleton } from "./prompt-skeleton";

const assertRendered = () => {
   const skeleton = screen.getByTestId("prompts-skeleton");
   assertInDocument(skeleton);
};

describe("PromptItemsSkeleton rendering tests", () => {
   it("grid view - default count - test", async () => {
      const { container } = render(
         <PromptsSkeleton viewMode={DListViewMode.GRID} />
      );

      assertRendered();
      expect(container).toMatchSnapshot();
   });

   it("list view - default count - test", async () => {
      const { container } = render(
         <PromptsSkeleton viewMode={DListViewMode.LIST} />
      );

      assertRendered();
      expect(container).toMatchSnapshot();
   });

   it("grid view - custom count - test", async () => {
      const { container } = render(
         <PromptsSkeleton viewMode={DListViewMode.GRID} count={3} />
      );

      assertRendered();
      expect(container).toMatchSnapshot();
   });
});
