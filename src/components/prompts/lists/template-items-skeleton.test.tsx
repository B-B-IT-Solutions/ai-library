import { render, screen } from "@testing-library/react";
import { assertInDocument } from "@tests";

import { DListViewMode } from "@/data/types/domain/common";

import { TemplateItemsSkeleton } from "./template-items-skeleton";

const assertRendered = () => {
   const skeleton = screen.getByTestId("template-items-skeleton");
   assertInDocument(skeleton);
};

describe("TemplateItemsSkeleton rendering tests", () => {
   it("grid view - default count - test", async () => {
      const { container } = render(
         <TemplateItemsSkeleton viewMode={DListViewMode.GRID} />
      );

      assertRendered();
      expect(container).toMatchSnapshot();
   });

   it("list view - default count - test", async () => {
      const { container } = render(
         <TemplateItemsSkeleton viewMode={DListViewMode.LIST} />
      );

      assertRendered();
      expect(container).toMatchSnapshot();
   });

   it("grid view - custom count - test", async () => {
      const { container } = render(
         <TemplateItemsSkeleton viewMode={DListViewMode.GRID} count={3} />
      );

      assertRendered();
      expect(container).toMatchSnapshot();
   });
});
