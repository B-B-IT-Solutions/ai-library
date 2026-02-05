jest.mock("@/data/actions/auth-utils");

import { screen, waitFor } from "@testing-library/dom";
import {
   assertInDocument,
   assertNotInDocument,
   ctestData,
   dtestData,
   ntestData,
   renderAsyncRSC,
} from "@tests";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { isAuthenticated, requireUser } from "@/data/actions/auth-utils";

import {
   AuthenticatedLayoutWrapper,
   Props,
} from "./layout-wrapper-authenticated";

const cookiesMock = cookies as jest.MockedFunction<typeof cookies>;
const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;

const isAuthenticatedMock = isAuthenticated as jest.MockedFunction<
   typeof isAuthenticated
>;
const redirectMock = redirect as jest.MockedFunction<typeof redirect>;

const assertRendered = () => {
   const wrapper = screen.getByTestId("authenticated-layout-wrapper");
   const sidebar = screen.getByTestId("sidebar");
   const test1 = screen.getByTestId("test-1");

   assertInDocument(wrapper);
   assertInDocument(sidebar);
   assertInDocument(test1);
};

const assertNotRendered = () => {
   const wrapper = screen.queryByTestId("authenticated-layout-wrapper");
   const sidebar = screen.queryByTestId("sidebar");
   const test1 = screen.queryByTestId("test-1");

   assertNotInDocument(wrapper);
   assertNotInDocument(sidebar);
   assertNotInDocument(test1);
};

describe("AuthenticatedLayoutWrapper rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      window.matchMedia = ctestData.createMatchMedia(false);
   });

   it("AuthenticatedLayoutWrapper - isAuthenticated false - test", async () => {
      isAuthenticatedMock.mockResolvedValue(false);

      const props: Props = {
         children: <div data-testid="test-1"></div>,
      };
      const { container } = await renderAsyncRSC(
         AuthenticatedLayoutWrapper,
         props
      );

      await waitFor(() => {
         assertNotRendered();
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/auth/sign-in");
         expect(cookiesMock).not.toHaveBeenCalled();
         expect(requireUserMock).not.toHaveBeenCalled();
      });

      expect(container).toMatchSnapshot();
   });

   it("AuthenticatedLayoutWrapper - isAuthenticated true - test", async () => {
      isAuthenticatedMock.mockResolvedValue(true);
      const reqCookies = ntestData.cookies({});
      const user = dtestData.dLoginUser();
      cookiesMock.mockResolvedValue(reqCookies);
      requireUserMock.mockResolvedValue(user);

      const props: Props = {
         children: <div data-testid="test-1"></div>,
      };
      const { container } = await renderAsyncRSC(
         AuthenticatedLayoutWrapper,
         props
      );

      await waitFor(() => {
         assertRendered();
         expect(redirectMock).not.toHaveBeenCalled();
         expect(cookiesMock).toHaveBeenCalledTimes(1);
         expect(requireUserMock).toHaveBeenCalledTimes(1);
      });
      expect(container).toMatchSnapshot();
   });
});
