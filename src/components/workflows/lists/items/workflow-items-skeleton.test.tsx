import { render, screen } from "@testing-library/react";
import { assertInDocument } from "@tests";

import { DListViewMode } from "@/data/types/domain/common";

import { WorkflowItemsSkeleton } from "./workflow-items-skeleton";

const assertRendered = () => {
   const skeleton = screen.getByTestId("workflow-items-skeleton");
   assertInDocument(skeleton);
};

describe("WorkflowItemsSkeleton rendering tests", () => {
   it("grid view - default count - test", async () => {
      const { container } = render(
         <WorkflowItemsSkeleton viewMode={DListViewMode.GRID} />
      );

      assertRendered();
      expect(container).toMatchSnapshot();
   });

   it("list view - default count - test", async () => {
      const { container } = render(
         <WorkflowItemsSkeleton viewMode={DListViewMode.LIST} />
      );

      assertRendered();
      expect(container).toMatchSnapshot();
   });

   it("grid view - custom count - test", async () => {
      const { container } = render(
         <WorkflowItemsSkeleton viewMode={DListViewMode.GRID} count={3} />
      );

      assertRendered();
      expect(container).toMatchSnapshot();
   });
});
