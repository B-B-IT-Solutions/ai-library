jest.mock("@/auth");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, ctestData, ntestData, renderAsyncRSC } from "@tests";
import { cookies } from "next/headers";

import { auth } from "@/auth";

import MainLayout from "./layout";

const cookiesMock = cookies as jest.MockedFunction<typeof cookies>;
const authMock = auth as jest.MockedFunction<typeof auth>;

const assertRendered = () => {
   const layout = screen.getByTestId("main-layout");
   const test1 = screen.getByTestId("test-1");

   assertInDocument(layout);
   assertInDocument(test1);
};

describe("MainLayout rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      window.matchMedia = ctestData.createMatchMedia(false);
   });

   it("MainLayout - session defined - rendered", async () => {
      const reqCookies = ntestData.cookies({});
      const session = ntestData.session();
      cookiesMock.mockResolvedValue(reqCookies);
      authMock.mockResolvedValue(session);

      const { container } = await renderAsyncRSC(MainLayout, {
         children: <div data-testid="test-1"></div>,
      });

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("MainLayout - session undefined - rendered", async () => {
      const reqCookies = ntestData.cookies({});
      cookiesMock.mockResolvedValue(reqCookies);
      authMock.mockResolvedValue(null);

      const { container } = await renderAsyncRSC(MainLayout, {
         children: <div data-testid="test-1"></div>,
      });

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
