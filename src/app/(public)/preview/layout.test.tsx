jest.mock("@/components/shared/wrappers/layout", () => ({
   PublicLayoutWrapper: ({ children }: { children: ReactNode }) => {
      return <div data-testid="public-layout-wrapper">{children}</div>;
   },
}));

import { ReactNode } from "react";
import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { assertInDocument, ctestData, renderAsyncRSC } from "@tests";
import mockRouter from "next-router-mock";

import PublicLayout from "./layout";

const assertRendered = () => {
   const layout = screen.getByTestId("public-layout-wrapper");
   const test1 = screen.getByTestId("test-1");

   assertInDocument(layout);
   assertInDocument(test1);
};

describe("PublicLayout rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      window.matchMedia = ctestData.createMatchMedia(false);
   });

   it("PublicLayout rendered test", async () => {
      const { container } = await renderAsyncRSC(PublicLayout, {
         children: <div data-testid="test-1"></div>,
      });

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
