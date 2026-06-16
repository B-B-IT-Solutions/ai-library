import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderWithReactQuery } from "@tests";

import { CopyCollectionUrlButton } from "./copy-collection-url-button";

const assertRendered = () => {
   const copyBtn = screen.getByTestId("copy-collection-url-btn");
   assertInDocument(copyBtn);
};

describe("CopyCollectionUrlButton rendering tests", () => {
   it("rendered - test", async () => {
      const collection = dtestData.dCollection(1);

      const { container } = renderWithReactQuery(
         <CopyCollectionUrlButton collection={collection} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
