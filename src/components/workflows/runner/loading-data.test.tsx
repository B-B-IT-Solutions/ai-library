import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument } from "@tests";

import { LoadingWorkflowData } from "./loading-data";

const assertRendered = () => {
   const loading = screen.getByTestId("loading-workflow-data");
   assertInDocument(loading);
};

describe("LoadingWorkflowData rendering tests", () => {
   it("rendered - test", async () => {
      const { container } = render(<LoadingWorkflowData />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
