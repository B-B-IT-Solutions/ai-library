import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, ntestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import SignInPage, { metadata, SignInPageProps } from "./page";

const authMock = auth as jest.MockedFunction<typeof auth>;
const redirectMock = redirect as jest.MockedFunction<typeof redirect>;

export const expectedMetadata: Metadata = {
   title: "Sign In",
};

const assertRendered = () => {
   const page = screen.getByTestId("sign-in-page");
   const header = screen.getByTestId("card-header");
   const title = screen.getByTestId("card-title");
   const description = screen.getByTestId("card-description");
   const credentialsForm = screen.getByTestId("signin-form-credentails-mock");

   assertInDocument(page);
   assertInDocument(header);
   assertInDocument(title);
   assertInDocument(description);
   assertInDocument(credentialsForm);
};

describe("SignInPage rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("SignInPage - user already signed in - callbackUrl defined - rendered test", async () => {
      const session = ntestData.session();
      authMock.mockResolvedValue(session);

      const redirectParams = { callbackUrl: "/callback/test-1" };
      const props: SignInPageProps = {
         searchParams: Promise.resolve(redirectParams),
      };
      const { container } = await renderAsyncRSC(SignInPage, props);

      await waitFor(() => {
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith(redirectParams.callbackUrl);
      });

      expect(container).toMatchSnapshot();
   });

   it("SignInPage - user already signed in - callbackUrl undefined - rendered test", async () => {
      const session = ntestData.session();
      authMock.mockResolvedValue(session);

      const redirectParams = { callbackUrl: undefined };
      const props: SignInPageProps = {
         searchParams: Promise.resolve(redirectParams),
      };
      const { container } = await renderAsyncRSC(SignInPage, props);

      await waitFor(() => {
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/");
      });

      expect(container).toMatchSnapshot();
   });

   it("SignInPage - user not signed in - rendered test", async () => {
      authMock.mockResolvedValue(null);
      const props: SignInPageProps = {
         searchParams: Promise.resolve({ callbackUrl: "/callback/test-1" }),
      };
      const { container } = await renderAsyncRSC(SignInPage, props);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("SignInPage functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("SignInPage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
