jest.mock("@/data/actions/collection");

import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderWithReactQuery,
   renderWithRouter,
} from "@tests";
import mockRouter from "next-router-mock";

import { CollectionCard } from "./collection-card";

const assertRendered = () => {
   assertInDocument(screen.getByTestId("collection-item-card"));
   assertInDocument(screen.getByTestId("more-options-btn"));
};

describe("CollectionCard rendering tests", () => {
   it("rendered - test", async () => {
      const collection = dtestData.dCollection(1);
      const { container } = renderWithReactQuery(
         <CollectionCard collection={collection} />
      );

      await waitFor(() => {
         assertRendered();
         assertInDocument(screen.getByText(collection.name));
      });

      expect(container).toMatchSnapshot();
   });

   it("isPublic true - test", async () => {
      const collection = { ...dtestData.dCollection(1), isPublic: true };
      const { container } = renderWithReactQuery(
         <CollectionCard collection={collection} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container.querySelector(".lucide-globe")).toBeInTheDocument();
      expect(container.querySelector(".lucide-lock")).not.toBeInTheDocument();
   });

   it("isPublic false - test", async () => {
      const collection = { ...dtestData.dCollection(1), isPublic: false };
      const { container } = renderWithReactQuery(
         <CollectionCard collection={collection} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container.querySelector(".lucide-lock")).toBeInTheDocument();
      expect(container.querySelector(".lucide-globe")).not.toBeInTheDocument();
   });

   it("description shown - test", async () => {
      const collection = dtestData.dCollection(1);
      renderWithReactQuery(<CollectionCard collection={collection} />);

      await waitFor(() => {
         assertInDocument(screen.getByText(collection.description!));
         assertNotInDocument(screen.queryByText("Keine Beschreibung"));
      });
   });

   it("no description - fallback shown - test", async () => {
      const collection = { ...dtestData.dCollection(1), description: null };
      renderWithReactQuery(<CollectionCard collection={collection} />);

      await waitFor(() => {
         assertInDocument(screen.getByText("Keine Beschreibung"));
         assertNotInDocument(
            screen.queryByText(dtestData.dCollection(1).description!)
         );
      });
   });

   it("templateCount 1 - singular label - test", async () => {
      const collection = { ...dtestData.dCollection(1), templateCount: 1 };
      renderWithReactQuery(<CollectionCard collection={collection} />);

      await waitFor(() => {
         assertInDocument(screen.getByText("1 Vorlage"));
      });
   });

   it("templateCount many - plural label - test", async () => {
      const collection = { ...dtestData.dCollection(1), templateCount: 5 };
      renderWithReactQuery(<CollectionCard collection={collection} />);

      await waitFor(() => {
         assertInDocument(screen.getByText("5 Vorlagen"));
      });
   });
});

describe("CollectionCard functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/collections");
   });

   it("card link clicked - navigates to collection - test", async () => {
      const collection = dtestData.dCollection(1);
      renderWithRouter(
         <CollectionCard collection={collection} />,
         "/collections"
      );

      await waitFor(() => {
         assertRendered();
      });

      const link = screen.getByTestId("mock-link");
      await userEvent.click(link);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual(`/collections/${collection.id}`);
      });
   });

   it("more options trigger clicked - edit and delete shown - test", async () => {
      const collection = dtestData.dCollection(1);
      renderWithRouter(<CollectionCard collection={collection} />);

      await waitFor(() => {
         assertRendered();
         assertNotInDocument(screen.queryByTestId("edit-collection-menu-item"));
         assertNotInDocument(
            screen.queryByTestId("delete-collection-menu-item")
         );
      });

      const triggerBtn = screen.getByTestId("more-options-trigger-btn");
      await userEvent.click(triggerBtn);

      await waitFor(() => {
         assertInDocument(screen.getByTestId("edit-collection-menu-item"));
         assertInDocument(screen.getByTestId("delete-collection-menu-item"));
      });
   });
});
