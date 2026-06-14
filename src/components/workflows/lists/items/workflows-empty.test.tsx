import { render, screen, waitFor } from "@testing-library/react";
import { assertInDocument } from "@tests";

import { WorkflowsEmpty } from "./workflows-empty";

const assertWorfklowsEmptyRendered = () => {
   const empty = screen.getByTestId("workflows-empty");
   const btn = screen.getByTestId("create-workflow-btn");

   assertInDocument(empty);
   assertInDocument(btn);
};

const assertWorkflowsFilterEmptyRendered = () => {
   const empty = screen.getByTestId("workflows-filter-empty");
   assertInDocument(empty);
};

describe("WorkflowsEmpty rendering tests", () => {
   it("hasActiveFilters true - test", async () => {
      const { container } = render(<WorkflowsEmpty hasActiveFilters={true} />);

      await waitFor(() => {
         assertWorkflowsFilterEmptyRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("hasActiveFilters false - test", async () => {
      const { container } = render(<WorkflowsEmpty hasActiveFilters={false} />);

      await waitFor(() => {
         assertWorfklowsEmptyRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
