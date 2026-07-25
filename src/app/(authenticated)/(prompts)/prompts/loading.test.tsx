import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument } from "@tests";

import { TemplatesLoading } from "./loading";

const assertRendered = () => {
   const loading = screen.getByTestId("templates-loading");
   assertInDocument(loading);
};

describe("TemplatesLoading rendering tests", () => {
   it("rendered test", async () => {
      const { container } = render(<TemplatesLoading />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
