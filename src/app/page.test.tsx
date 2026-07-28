jest.mock("@/components/shared/wrappers/layout", () => ({
   PublicLayoutWrapper: ({ children }: { children: ReactNode }) => {
      return <div data-testid="public-layout-wrapper">{children}</div>;
   },
}));

jest.mock("@/data/actions/auth-utils");

import { ReactNode } from "react";
import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, renderAsyncRSC } from "@tests";

import { RootPage } from "./page";

const assertRendered = () => {
   const layout = screen.getByTestId("public-layout-wrapper");
   const page = screen.getByTestId("public-page");
   const highlightsSection = screen.getByTestId("highlights-section");
   const highlightCards = screen.getAllByTestId("highlight-card");

   assertInDocument(layout);
   assertInDocument(page);
   assertInDocument(highlightsSection);
   expect(highlightCards).toHaveLength(4);
};

describe("RootPage rendering tests", () => {
   it("render - test", async () => {
      const { container } = await renderAsyncRSC(RootPage, {});

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
