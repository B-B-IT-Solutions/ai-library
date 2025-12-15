import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, ntestData, renderAsyncRSC } from "@tests";
import { cookies } from "next/headers";

import MainLayout from "./layout";

const cookiesMock = cookies as jest.MockedFunction<typeof cookies>;

const assertRendered = () => {
   const layout = screen.getByTestId("main-layout");
   const test1 = screen.getByTestId("test-1");

   assertInDocument(layout);
   assertInDocument(test1);
};

describe("MainLayout rendering tests", () => {
   it("MainLayout rendered", async () => {
      const reqCookies = ntestData.cookies({});
      cookiesMock.mockResolvedValue(reqCookies);

      const { container } = await renderAsyncRSC(MainLayout, {
         children: <div data-testid="test-1"></div>,
      });

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
