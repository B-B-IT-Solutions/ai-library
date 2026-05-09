import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import {
   assertHasAttributeWithValue,
   assertInDocument,
   assertNotInDocument,
} from "@tests";

import { AuthRequiredDialog } from "./auth-required-dialog";

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("auth-required-dialog");
   const signInLink = screen.getByTestId("sign-in-link");
   const signUpLink = screen.getByTestId("sign-up-link");

   assertInDocument(dialog);
   assertInDocument(signInLink);
   assertInDocument(signUpLink);
};

const assertDialogNotRendered = () => {
   const dialog = screen.queryByTestId("auth-required-dialog");
   assertNotInDocument(dialog);
};

const assertLinks = (redirectPath: string) => {
   const signInLink = screen.getByTestId("sign-in-link");
   const signUpLink = screen.getByTestId("sign-up-link");

   assertInDocument(signInLink);
   assertInDocument(signUpLink);

   assertHasAttributeWithValue(
      signInLink,
      "href",
      `/auth/sign-in?redirect=${redirectPath}`
   );
   assertHasAttributeWithValue(
      signUpLink,
      "href",
      `/auth/sign-up?redirect=${redirectPath}`
   );
};

describe("AuthRequiredDialog rendering tests", () => {
   it("isOpen true - default values - test", async () => {
      const redirectPath = "/explore/template-1";

      const { container } = render(
         <AuthRequiredDialog
            isOpen={true}
            onOpenChange={jest.fn()}
            redirectPath={redirectPath}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         assertLinks(redirectPath);
      });

      expect(container).toMatchSnapshot();
   });

   it("isOpen true - custom values - test", async () => {
      const redirectPath = "/explore/template-2";

      const { container } = render(
         <AuthRequiredDialog
            isOpen={true}
            onOpenChange={jest.fn()}
            redirectPath={redirectPath}
            title="Title 1"
            description="Description 1"
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         assertLinks(redirectPath);
      });

      expect(container).toMatchSnapshot();
   });

   it("isOpen false - test", async () => {
      const redirectPath = "/explore/template-3";

      const { container } = render(
         <AuthRequiredDialog
            isOpen={false}
            onOpenChange={jest.fn()}
            redirectPath={redirectPath}
         />
      );

      await waitFor(() => {
         assertDialogNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("AuthRequiredDialog functionality tests", () => {
   it("close fn called - test", async () => {
      const redirectPath = "/explore/template-1";
      const closeFn = jest.fn();

      render(
         <AuthRequiredDialog
            isOpen={true}
            onOpenChange={closeFn}
            redirectPath={redirectPath}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         assertLinks(redirectPath);
      });
   });
});
