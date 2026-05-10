jest.mock("@/data/actions/auth-utils");

import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, renderAsyncRSC } from "@tests";
import mockRouter from "next-router-mock";

import { isAuthenticated } from "@/data/actions/auth-utils";

import { Props, PublicLayoutWrapper } from "./layout-wrapper-pulbic";

const isAuthenticatedMock = isAuthenticated as jest.MockedFunction<
   typeof isAuthenticated
>;

const assertRendered = () => {
   const wrapper = screen.getByTestId("public-layout-wrapper");
   const test1 = screen.getByTestId("test-1");

   assertInDocument(wrapper);
   assertInDocument(test1);
};

describe("PublicLayoutWrapper rendering tests", () => {
   it("isAuthenticated false - test", async () => {
      isAuthenticatedMock.mockResolvedValue(false);

      const props: Props = {
         children: <div data-testid="test-1"></div>,
      };

      const { container } = await renderAsyncRSC(PublicLayoutWrapper, props);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("isAuthenticated true - test", async () => {
      isAuthenticatedMock.mockResolvedValue(true);

      const props: Props = {
         children: <div data-testid="test-1"></div>,
      };

      const { container } = await renderAsyncRSC(PublicLayoutWrapper, props);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PublicLayout functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/");
   });

   it("isAuthenticated false - sign-in link clicked - test", async () => {
      isAuthenticatedMock.mockResolvedValue(false);

      await renderAsyncRSC(PublicLayoutWrapper, {
         children: <div data-testid="test-1"></div>,
      });

      await waitFor(() => {
         assertRendered();
      });

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.asPath).toEqual("/");
      });

      const signInLink = screen.getByTestId("sign-in-link");
      await userEvent.click(signInLink);

      await waitFor(() => {
         expect(mockRouter.asPath).toEqual(`/auth/sign-in`);
      });
   });

   it("isAuthenticated false - sign-up link clicked - test", async () => {
      isAuthenticatedMock.mockResolvedValue(false);

      await renderAsyncRSC(PublicLayoutWrapper, {
         children: <div data-testid="test-1"></div>,
      });

      await waitFor(() => {
         assertRendered();
      });

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.asPath).toEqual("/");
      });

      const signUpLink = screen.getByTestId("sign-up-link");
      await userEvent.click(signUpLink);

      await waitFor(() => {
         expect(mockRouter.asPath).toEqual(`/auth/sign-up`);
      });
   });
});
