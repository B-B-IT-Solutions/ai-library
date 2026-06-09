import { render, screen } from "@testing-library/react";
import { assertInDocument } from "@tests";

import { DListViewMode } from "@/data/types/domain/common";

import { PromptItemsSkeleton } from "./prompt-items-skeleton";

const assertRendered = () => {
   const skeleton = screen.getByTestId("template-items-skeleton");
   assertInDocument(skeleton);
};

describe("PromptItemsSkeleton rendering tests", () => {
   it("grid view - default count - test", async () => {
      const { container } = render(
         <PromptItemsSkeleton viewMode={DListViewMode.GRID} />
      );

      assertRendered();
      expect(container).toMatchSnapshot();
   });

   it("list view - default count - test", async () => {
      const { container } = render(
         <PromptItemsSkeleton viewMode={DListViewMode.LIST} />
      );

      assertRendered();
      expect(container).toMatchSnapshot();
   });

   it("grid view - custom count - test", async () => {
      const { container } = render(
         <PromptItemsSkeleton viewMode={DListViewMode.GRID} count={3} />
      );

      assertRendered();
      expect(container).toMatchSnapshot();
   });
});
