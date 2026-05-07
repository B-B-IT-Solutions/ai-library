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

import { ForgotPasswordPage, metadata } from "./page";

const authMock = auth as unknown as AuthMockedFunction;
const redirectMock = redirect as jest.MockedFunction<typeof redirect>;

const expectedMetadata: Metadata = {
   title: "Passwort vergessen",
};

const assertRendered = () => {
   const page = screen.getByTestId("forgot-password-page");
   const form = screen.getByTestId("forgot-password-form-mock");

   assertInDocument(page);
   assertInDocument(form);
};

describe("ForgotPasswordPage rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("user signed in - test", async () => {
      const session = ntestData.session();
      authMock.mockResolvedValue(session);

      const { container } = await renderAsyncRSC(ForgotPasswordPage, {});

      await waitFor(() => {
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/");
      });

      expect(container).toMatchSnapshot();
   });

   it("user not signed in - test", async () => {
      authMock.mockResolvedValue(null);

      const { container } = await renderAsyncRSC(ForgotPasswordPage, {});

      await waitFor(() => {
         assertRendered();
         expect(redirectMock).not.toHaveBeenCalled();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("ForgotPasswordPage functionality tests", () => {
   it("metadata - test", () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
