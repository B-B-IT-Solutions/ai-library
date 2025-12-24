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

import SignUpPage, {
   metadata,
   SignInPageSearchParams,
   SignUpPageProps,
} from "./page";

const authMock = auth as unknown as AuthMockedFunction;
const redirectMock = redirect as jest.MockedFunction<typeof redirect>;

export const expectedMetadata: Metadata = {
   title: "Sign Up",
};

const assertRendered = () => {
   const page = screen.getByTestId("sign-up-page");
   const header = screen.getByTestId("card-header");
   const title = screen.getByTestId("card-title");
   const description = screen.getByTestId("card-description");
   const signUpForm = screen.getByTestId("sign-up-form-mock");

   assertInDocument(page);
   assertInDocument(header);
   assertInDocument(title);
   assertInDocument(description);
   assertInDocument(signUpForm);
};

describe("SignUpPage rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("SignUpPage - user already signed in - callbackUrl defined - rendered test", async () => {
      const session = ntestData.session();
      authMock.mockResolvedValue(session);

      const searchParams: SignInPageSearchParams = {
         callbackUrl: "/callback/test-1",
      };
      const props: SignUpPageProps = {
         searchParams: Promise.resolve(searchParams),
      };
      const { container } = await renderAsyncRSC(SignUpPage, props);

      await waitFor(() => {
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith(searchParams.callbackUrl);
      });

      expect(container).toMatchSnapshot();
   });

   it("SignUpPage - user already signed in - callbackUrl undefined - rendered test", async () => {
      const session = ntestData.session();
      authMock.mockResolvedValue(session);

      const searchParams: SignInPageSearchParams = {
         callbackUrl: undefined,
      };
      const props: SignUpPageProps = {
         searchParams: Promise.resolve(searchParams),
      };
      const { container } = await renderAsyncRSC(SignUpPage, props);

      await waitFor(() => {
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/");
      });

      expect(container).toMatchSnapshot();
   });

   it("SignUpPage - user not signed in - rendered test", async () => {
      authMock.mockResolvedValue(null);
      const searchParams: SignInPageSearchParams = {
         callbackUrl: "/callback/test-1",
      };
      const props: SignUpPageProps = {
         searchParams: Promise.resolve(searchParams),
      };
      const { container } = await renderAsyncRSC(SignUpPage, props);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("SignUpPage functionality tests", () => {
   it("SignUpPage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
