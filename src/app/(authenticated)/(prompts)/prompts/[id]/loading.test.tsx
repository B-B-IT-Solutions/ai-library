import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument } from "@tests";

import { TemplateDetailLoading } from "./loading";

const assertRendered = () => {
   const loading = screen.getByTestId("template-loading");
   assertInDocument(loading);
};

describe("TemplateDetailLoading rendering tests", () => {
   it("rendered test", async () => {
      const { container } = render(<TemplateDetailLoading />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
