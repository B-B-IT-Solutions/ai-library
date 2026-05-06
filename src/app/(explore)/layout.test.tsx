jest.mock("@/data/actions/auth-utils");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, renderAsyncRSC } from "@tests";

import { isAuthenticated } from "@/data/actions/auth-utils";

import { ExploreLayout } from "./layout";

const isAuthenticatedMock = isAuthenticated as jest.MockedFunction<
   typeof isAuthenticated
>;

const assertRendered = () => {
   const layout = screen.getByTestId("explore-layout");
   const test1 = screen.getByTestId("test-1");

   assertInDocument(layout);
   assertInDocument(test1);
};

describe("ExploreLayout rendering tests", () => {
   it("authenticate true - test", async () => {
      isAuthenticatedMock.mockResolvedValue(true);

      const { container } = await renderAsyncRSC(ExploreLayout, {
         children: <div data-testid="test-1"></div>,
      });

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("authenticate false - test", async () => {
      isAuthenticatedMock.mockResolvedValue(false);

      const { container } = await renderAsyncRSC(ExploreLayout, {
         children: <div data-testid="test-1"></div>,
      });

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
