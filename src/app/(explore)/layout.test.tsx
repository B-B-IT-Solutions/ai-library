jest.mock("@/components/shared/wrappers/layout", () => ({
   PublicLayoutWrapper: ({ children }: { children: ReactNode }) => {
      return <div data-testid="public-layout-wrapper">{children}</div>;
   },
}));

jest.mock("@/data/actions/auth-utils");

import { ReactNode } from "react";
import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, renderAsyncRSC } from "@tests";

import { ExploreLayout } from "./layout";

const assertRendered = () => {
   const layout = screen.getByTestId("public-layout-wrapper");
   const test1 = screen.getByTestId("test-1");

   assertInDocument(layout);
   assertInDocument(test1);
};

describe("ExploreLayout rendering tests", () => {
   it("rendered - test", async () => {
      const { container } = await renderAsyncRSC(ExploreLayout, {
         children: <div data-testid="test-1"></div>,
      });

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
