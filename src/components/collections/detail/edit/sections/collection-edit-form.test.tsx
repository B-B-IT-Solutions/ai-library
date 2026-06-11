jest.mock("@/data/actions/collection");

import { render, screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { CollectionEditForm } from "./collection-edit-form";

const assertRendered = () => {
   assertInDocument(screen.getByTestId("collection-edit-form"));
};

const assertFormRendered = () => {
   const name = screen.getByTestId("name");
   const description = screen.getByTestId("description");
   const color = screen.getByTestId("color");

   assertInDocument(name);
   assertInDocument(description);
   assertInDocument(color);
};

describe("CollectionEditForm rendering tests", () => {
   it("create mode - test", async () => {
      const { container } = render(<CollectionEditForm />);

      await waitFor(() => {
         assertRendered();
         assertFormRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("edit mode - test", async () => {
      const collection = dtestData.dCollection(1);

      const { container } = render(
         <CollectionEditForm collection={collection} />
      );

      await waitFor(() => {
         assertRendered();
         assertFormRendered();
      });

      expect(container).toMatchSnapshot();

      expect(container).toMatchSnapshot();
   });
});
