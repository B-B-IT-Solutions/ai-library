import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument } from "@tests";

import LoadingPage from "./loading";

const assertRendered = () => {
   const page = screen.getByTestId("loading-page");
   assertInDocument(page);
};

describe("LoadingPage rendering tests", () => {
   it("LoadingPage rendered", async () => {
      const { container } = render(<LoadingPage />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
