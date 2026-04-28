jest.mock("@/data/actions/collection");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";
import mockRouter from "next-router-mock";

import { CollectionCard } from "./collection-card";

const assertRendered = () => {
   const card = screen.getByTestId("collection-item-card");
   const link = screen.getByTestId("collection-link");
   const name = screen.getByTestId("name");
   const moreOptionsBtn = screen.getByTestId("more-options-btn");

   assertInDocument(card);
   assertInDocument(link);
   assertInDocument(name);
   assertInDocument(moreOptionsBtn);
};

describe("CollectionCard rendering tests", () => {
   it("isPublic true - test", async () => {
      const collection = dtestData.dCollection(1);
      collection.isPublic = true;
      collection.templateCount = 1;

      const { container } = render(<CollectionCard collection={collection} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("isPublic false - test", async () => {
      const collection = dtestData.dCollection(1);
      collection.isPublic = false;
      collection.templateCount = 5;

      const { container } = render(<CollectionCard collection={collection} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("description null - test", async () => {
      const collection = dtestData.dCollection(1);
      collection.description = null;
      collection.color = null;

      const { container } = render(<CollectionCard collection={collection} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CollectionCard functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/collections");
   });

   it("card clicked - navigates to collection - test", async () => {
      const collection = dtestData.dCollection(1);
      render(<CollectionCard collection={collection} />);

      await waitFor(() => {
         assertRendered();
      });

      const link = screen.getByTestId("collection-link");
      await userEvent.click(link);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual(`/collections/${collection.id}`);
      });
   });
});
