import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import {
   assertHasAttributeWithValue,
   assertInDocument,
   assertNotInDocument,
} from "@tests";

import { AuthRequiredDialog } from "./auth-required-dialog";

const redirectPath = "/explore/my-template";
const onCloseMock = jest.fn();

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("auth-required-dialog");
   assertInDocument(dialog);
};

const assertDialogNotRendered = () => {
   const dialog = screen.queryByTestId("auth-required-dialog");
   assertNotInDocument(dialog);
};

describe("AuthRequiredDialog rendering tests", () => {
   it("isOpen true - test", async () => {
      const { container } = render(
         <AuthRequiredDialog
            isOpen={true}
            onClose={onCloseMock}
            redirectPath={redirectPath}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("isOpen false - test", async () => {
      const { container } = render(
         <AuthRequiredDialog
            isOpen={false}
            onClose={onCloseMock}
            redirectPath={redirectPath}
         />
      );

      await waitFor(() => {
         assertDialogNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("custom title - test", async () => {
      const { container } = render(
         <AuthRequiredDialog
            isOpen={true}
            onClose={onCloseMock}
            redirectPath={redirectPath}
            title="Konto erforderlich"
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         expect(screen.getByText("Konto erforderlich")).toBeInTheDocument();
      });

      expect(container).toMatchSnapshot();
   });

   it("custom description - test", async () => {
      const { container } = render(
         <AuthRequiredDialog
            isOpen={true}
            onClose={onCloseMock}
            redirectPath={redirectPath}
            description="Bitte melde dich an, um Vorlagen zu übernehmen."
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         expect(
            screen.getByText("Bitte melde dich an, um Vorlagen zu übernehmen.")
         ).toBeInTheDocument();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("AuthRequiredDialog functionality tests", () => {
   it("sign-in btn has correct href - test", async () => {
      render(
         <AuthRequiredDialog
            isOpen={true}
            onClose={onCloseMock}
            redirectPath={redirectPath}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      const signInBtn = screen.getByTestId("auth-required-sign-in-btn");
      assertHasAttributeWithValue(
         signInBtn,
         "href",
         `/auth/sign-in?redirect=${redirectPath}`
      );
   });

   it("register link has correct href - test", async () => {
      render(
         <AuthRequiredDialog
            isOpen={true}
            onClose={onCloseMock}
            redirectPath={redirectPath}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      const registerLink = screen.getByTestId("auth-required-register-link");
      assertHasAttributeWithValue(
         registerLink,
         "href",
         `/auth/sign-up?redirect=${redirectPath}`
      );
   });
});
