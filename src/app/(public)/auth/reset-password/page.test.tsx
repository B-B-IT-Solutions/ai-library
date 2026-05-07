jest.mock("@/components/shared/auth", () => ({
   ResetPasswordForm: () => {
      return <div data-testid="reset-password-form" />;
   },
}));

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

import {
   metadata,
   PageProps,
   PageSearchParams,
   ResetPasswordPage,
} from "./page";

const authMock = auth as unknown as AuthMockedFunction;
const redirectMock = redirect as jest.MockedFunction<typeof redirect>;

const expectedMetadata: Metadata = {
   title: "Passwort zurücksetzen",
};

const assertRendered = () => {
   const page = screen.getByTestId("reset-password-page");
   const form = screen.getByTestId("reset-password-form");

   assertInDocument(page);
   assertInDocument(form);
};

describe("ResetPasswordPage rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("user signed in - test", async () => {
      const session = ntestData.session();
      authMock.mockResolvedValue(session);

      const token = "reset-token-abc";
      const email = "user@test.com";
      const searchParams: PageSearchParams = { token, email };
      const props: PageProps = {
         searchParams: Promise.resolve(searchParams),
      };

      const { container } = await renderAsyncRSC(ResetPasswordPage, props);

      await waitFor(() => {
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/");
      });

      expect(container).toMatchSnapshot();
   });

   it("token missing - test", async () => {
      authMock.mockResolvedValue(null);

      const email = "user@test.com";
      const searchParams: PageSearchParams = { email };
      const props: PageProps = {
         searchParams: Promise.resolve(searchParams),
      };

      const { container } = await renderAsyncRSC(ResetPasswordPage, props);

      await waitFor(() => {
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith(
            "/auth/sign-in?error=invalid_link"
         );
      });

      expect(container).toMatchSnapshot();
   });

   it("email missing - test", async () => {
      authMock.mockResolvedValue(null);

      const token = "reset-token-abc";
      const searchParams: PageSearchParams = { token };
      const props: PageProps = {
         searchParams: Promise.resolve(searchParams),
      };

      const { container } = await renderAsyncRSC(ResetPasswordPage, props);

      await waitFor(() => {
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith(
            "/auth/sign-in?error=invalid_link"
         );
      });

      expect(container).toMatchSnapshot();
   });

   it("token and email missing - test", async () => {
      authMock.mockResolvedValue(null);

      const searchParams: PageSearchParams = {};
      const props: PageProps = {
         searchParams: Promise.resolve(searchParams),
      };

      const { container } = await renderAsyncRSC(ResetPasswordPage, props);

      await waitFor(() => {
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith(
            "/auth/sign-in?error=invalid_link"
         );
      });

      expect(container).toMatchSnapshot();
   });

   it("valid token and email - test", async () => {
      authMock.mockResolvedValue(null);

      const token = "reset-token-abc";
      const email = "user@test.com";
      const searchParams: PageSearchParams = { token, email };
      const props: PageProps = {
         searchParams: Promise.resolve(searchParams),
      };

      const { container } = await renderAsyncRSC(ResetPasswordPage, props);

      await waitFor(() => {
         assertRendered();
         expect(redirectMock).not.toHaveBeenCalled();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("ResetPasswordPage functionality tests", () => {
   it("metadata - test", () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
