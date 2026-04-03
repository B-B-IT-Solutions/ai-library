import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument } from "@tests";

import { NewTemplateLoading } from "./loading";

const assertRendered = () => {
   const loading = screen.getByTestId("new-template-loading");
   assertInDocument(loading);
};

describe("NewTemplateLoading rendering tests", () => {
   it("rendered test", async () => {
      const { container } = render(<NewTemplateLoading />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
