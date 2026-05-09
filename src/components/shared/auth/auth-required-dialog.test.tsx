import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("cancel btn clicked - calls onClose - test", async () => {
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

      const cancelBtn = screen.getByTestId("auth-required-cancel-btn");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         expect(onCloseMock).toHaveBeenCalledTimes(1);
      });
   });

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

   it("register btn has correct href - test", async () => {
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

      const registerBtn = screen.getByTestId("auth-required-register-btn");
      assertHasAttributeWithValue(
         registerBtn,
         "href",
         `/auth/sign-up?redirect=${redirectPath}`
      );
   });
});
