import { render, screen } from "@testing-library/react";
import { assertInDocument } from "@tests";

import { DListViewMode } from "@/data/types/domain/common";

import { WorkflowsSkeleton } from "./workflows-skeleton";

const assertRendered = () => {
   const skeleton = screen.getByTestId("workflows-skeleton");
   assertInDocument(skeleton);
};

describe("WorkflowsSkeleton rendering tests", () => {
   it("grid view - default count - test", async () => {
      const { container } = render(
         <WorkflowsSkeleton viewMode={DListViewMode.GRID} />
      );

      assertRendered();
      expect(container).toMatchSnapshot();
   });

   it("list view - default count - test", async () => {
      const { container } = render(
         <WorkflowsSkeleton viewMode={DListViewMode.LIST} />
      );

      assertRendered();
      expect(container).toMatchSnapshot();
   });

   it("grid view - custom count - test", async () => {
      const { container } = render(
         <WorkflowsSkeleton viewMode={DListViewMode.GRID} count={3} />
      );

      assertRendered();
      expect(container).toMatchSnapshot();
   });
});
