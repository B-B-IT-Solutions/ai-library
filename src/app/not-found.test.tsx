import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument } from "@tests";

import NotFoundPage from "./not-found";

const assertRendered = () => {
   const page = screen.getByTestId("not-found-page");
   assertInDocument(page);
};

describe("NotFoundPage rendering tests", () => {
   it("NotFoundPage rendered", async () => {
      const { container } = render(<NotFoundPage />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
