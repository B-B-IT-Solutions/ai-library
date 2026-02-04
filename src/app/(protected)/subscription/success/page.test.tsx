import { screen, waitFor } from "@testing-library/dom";
import {
   assertInDocument,
   AuthMockedFunction,
   ntestData,
   renderAsyncRSC,
} from "@tests";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import SubscriptionSuccessPage, { metadata } from "./page";

const authMock = auth as unknown as AuthMockedFunction;

const redirectMock = redirect as jest.MockedFunction<typeof redirect>;

const expectedMetadata: Metadata = {
   title: "Subscription Success",
};

const assertRendered = () => {
   const page = screen.getByTestId("subscription-success-page");
   const promptsLink = screen.getByTestId("prompts-link");
   const subscriptionLink = screen.getByTestId("subscription-link");

   assertInDocument(page);
   assertInDocument(promptsLink);
   assertInDocument(subscriptionLink);
};

describe("SubscriptionSuccessPage rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("SubscriptionSuccessPage - session null - redirects to home", async () => {
      authMock.mockResolvedValue(null);

      const { container } = await renderAsyncRSC(SubscriptionSuccessPage, {});

      await waitFor(() => {
         expect(authMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/");
      });

      expect(container).toMatchSnapshot();
   });

   it("SubscriptionSuccessPage - session.user undefined - redirects to home", async () => {
      const session = ntestData.session();
      session.user = undefined;
      authMock.mockResolvedValue(session);

      const { container } = await renderAsyncRSC(SubscriptionSuccessPage, {});

      await waitFor(() => {
         expect(authMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/");
      });

      expect(container).toMatchSnapshot();
   });

   it("SubscriptionSuccessPage - session.user.id undefined - redirects to home", async () => {
      const session = ntestData.session();
      session.user.id = undefined;
      authMock.mockResolvedValue(session);

      const { container } = await renderAsyncRSC(SubscriptionSuccessPage, {});

      await waitFor(() => {
         expect(authMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/");
      });

      expect(container).toMatchSnapshot();
   });

   it("SubscriptionSuccessPage - user retrieved - test", async () => {
      const session = ntestData.session();
      authMock.mockResolvedValue(session);

      const { container } = await renderAsyncRSC(SubscriptionSuccessPage, {});

      await waitFor(() => {
         assertRendered();
         expect(authMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).not.toHaveBeenCalled();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("SubscriptionSuccessPage functionality tests", () => {
   it("SubscriptionSuccessPage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
