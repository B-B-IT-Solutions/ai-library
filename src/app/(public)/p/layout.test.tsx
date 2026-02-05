import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { assertInDocument, ctestData, renderAsyncRSC } from "@tests";
import mockRouter from "next-router-mock";

import PublicLayout from "./layout";

const assertRendered = () => {
   const layout = screen.getByTestId("public-layout");
   const signInLink = screen.getByTestId("sign-in-link");
   const signUpLink = screen.getByTestId("sign-up-link");
   const test1 = screen.getByTestId("test-1");

   assertInDocument(layout);
   assertInDocument(signInLink);
   assertInDocument(signUpLink);
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

describe("PublicLayout functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      mockRouter.reset();
      window.matchMedia = ctestData.createMatchMedia(false);
   });

   it("PublicLayout - sign-in link clicked - test", async () => {
      await renderAsyncRSC(PublicLayout, {
         children: <div data-testid="test-1"></div>,
      });

      await waitFor(() => {
         assertRendered();
      });

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const signInLink = screen.getByTestId("sign-in-link");
      await userEvent.click(signInLink);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual(`/sign-in`);
      });
   });

   it("PublicLayout - sign-up link clicked - test", async () => {
      await renderAsyncRSC(PublicLayout, {
         children: <div data-testid="test-1"></div>,
      });

      await waitFor(() => {
         assertRendered();
      });

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const signUpLink = screen.getByTestId("sign-up-link");
      await userEvent.click(signUpLink);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual(`/sign-up`);
      });
   });
});
