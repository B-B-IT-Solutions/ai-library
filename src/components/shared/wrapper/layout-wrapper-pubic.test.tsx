jest.mock("@/data/actions/auth-utils");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, assertNotInDocument, renderAsyncRSC } from "@tests";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/data/actions/auth-utils";

import { Props, PublicLayoutWrapper } from "./layout-wrapper-pulbic";

const isAuthenticatedMock = isAuthenticated as jest.MockedFunction<
   typeof isAuthenticated
>;
const redirectMock = redirect as jest.MockedFunction<typeof redirect>;

const assertRendered = () => {
   const wrapper = screen.getByTestId("public-layout-wrapper");
   const test1 = screen.getByTestId("test-1");

   assertInDocument(wrapper);
   assertInDocument(test1);
};

const assertNotRendered = () => {
   const wrapper = screen.queryByTestId("public-layout-wrapper");
   const test1 = screen.queryByTestId("test-1");

   assertNotInDocument(wrapper);
   assertNotInDocument(test1);
};

describe("PublicLayoutWrapper rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("PublicLayoutWrapper - isAuthenticated true - test", async () => {
      isAuthenticatedMock.mockResolvedValue(true);

      const props: Props = {
         children: <div data-testid="test-1"></div>,
      };
      const { container } = await renderAsyncRSC(PublicLayoutWrapper, props);

      await waitFor(() => {
         assertNotRendered();
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/");
      });

      expect(container).toMatchSnapshot();
   });

   it("PublicLayoutWrapper - isAuthenticated false - test", async () => {
      isAuthenticatedMock.mockResolvedValue(false);

      const props: Props = {
         children: <div data-testid="test-1"></div>,
      };
      const { container } = await renderAsyncRSC(PublicLayoutWrapper, props);

      await waitFor(() => {
         assertRendered();
         expect(redirectMock).not.toHaveBeenCalled();
      });

      expect(container).toMatchSnapshot();
   });
});
