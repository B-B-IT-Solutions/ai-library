jest.mock("@/data/actions/collection");

import React from "react";
import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData, renderWithReactQuery } from "@tests";
import mockRouter from "next-router-mock";

import { TemplateItemCard } from "./template-item-card";

const assertRendered = () => {
   const entryCard = screen.getByTestId("template-item-card");
   const viewDetailsTitle = screen.getByTestId("view-details-link-title");
   const categories = screen.getByTestId("categories");
   const usePromptBtn = screen.getByTestId("use-prompt-btn");
   const moreOptionsBtn = screen.getByTestId("prompt-more-options-btn");

   assertInDocument(entryCard);
   assertInDocument(viewDetailsTitle);
   assertInDocument(categories);
   assertInDocument(usePromptBtn);
   assertInDocument(moreOptionsBtn);
};

describe("TemplateItemCard rendering tests", () => {
   it("currentCollection undefined - test", async () => {
      const collections = dtestData.dCollectionPreviews();
      const prompt = dtestData.dPrompt();

      const { container } = renderWithReactQuery(
         <TemplateItemCard prompt={prompt} collections={collections} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("currentCollection defined - test", async () => {
      const collections = dtestData.dCollections();
      const prompt = dtestData.dPrompt();
      const collection = dtestData.dCollectionPreview();

      const { container } = renderWithReactQuery(
         <TemplateItemCard
            prompt={prompt}
            collections={collections}
            currentCollection={collection}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("TemplateItemCard ref tests", () => {
   it("ref is forwarded to the Item DOM element - test", async () => {
      const ref = React.createRef<HTMLDivElement>();
      const prompt = dtestData.dPrompt();
      const collections = dtestData.dCollectionPreviews();

      renderWithReactQuery(
         <TemplateItemCard
            prompt={prompt}
            collections={collections}
            ref={ref}
         />
      );

      await waitFor(() => {
         const item = screen.getByTestId("template-item-card");
         expect(ref.current).not.toBeNull();
         expect(ref.current).toBe(item);
      });
   });
});

describe("TemplateItemCard functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/");
   });

   it("title - view detail link clicked - currentCollection undefined - test", async () => {
      const prompt = dtestData.dPrompt();
      const collections = dtestData.dCollectionPreviews();

      renderWithReactQuery(
         <TemplateItemCard prompt={prompt} collections={collections} />
      );

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const viewDetailsTitle = screen.getByTestId("view-details-link-title");
      userEvent.click(viewDetailsTitle);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual(`/templates/${prompt.id}`);
      });
   });

   it("title - view detail link clicked - currentCollection defined - test", async () => {
      const prompt = dtestData.dPrompt();
      const collections = dtestData.dCollections();
      const collection = dtestData.dCollectionPreview();

      renderWithReactQuery(
         <TemplateItemCard
            prompt={prompt}
            collections={collections}
            currentCollection={collection}
         />
      );

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const viewDetailsTitle = screen.getByTestId("view-details-link-title");
      userEvent.click(viewDetailsTitle);

      await waitFor(() => {
         expect(mockRouter.asPath).toEqual(
            `/templates/${prompt.id}?collectionId=${collection.id}`
         );
      });
   });
});
