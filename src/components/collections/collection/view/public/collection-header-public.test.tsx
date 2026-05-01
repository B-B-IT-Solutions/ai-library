jest.mock("@/data/actions/collection");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderWithReactQuery } from "@tests";

import { PublicCollectionHeader } from "./collection-header-public";

const assertRendered = () => {
   const header = screen.getByTestId("collection-header-public");
   const overview = screen.getByTestId("overview");
   const badge = screen.getByTestId("public-badge");

   assertInDocument(header);
   assertInDocument(overview);
   assertInDocument(badge);
};

describe("PublicCollectionHeader rendering tests", () => {
   it("description defined - test", async () => {
      const collection = dtestData.dCollection(1);

      const { container } = renderWithReactQuery(
         <PublicCollectionHeader collection={collection} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("description null - test", async () => {
      const collection = dtestData.dCollection(1);
      collection.description = null;

      const { container } = renderWithReactQuery(
         <PublicCollectionHeader collection={collection} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
