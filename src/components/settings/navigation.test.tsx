import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument } from "@tests";
import mockRouter from "next-router-mock";

import { Navigation } from "./navigation";

const assertRendered = () => {
   const navigation = screen.getByTestId("navigation");
   assertInDocument(navigation);
};

const assertGroupsRendered = () => {
   assertUserGroupRendered();
   assertContentGroupRendered();
};

const assertUserGroupRendered = () => {
   const userGroup = screen.getByTestId("user-group");
   const generalLink = screen.getByTestId("general-link");
   const accountLink = screen.getByTestId("account-link");
   const subscriptionLink = screen.getByTestId("subscription-link");

   assertInDocument(userGroup);
   assertInDocument(generalLink);
   assertInDocument(accountLink);
   assertInDocument(subscriptionLink);
};

const assertContentGroupRendered = () => {
   const contentGroup = screen.getByTestId("content-group");
   const globalPromptFieldsLink = screen.getByTestId(
      "global-template-fields-link"
   );
   const categoriesLink = screen.getByTestId("prompt-categories-link");

   assertInDocument(contentGroup);
   assertInDocument(globalPromptFieldsLink);
   assertInDocument(categoriesLink);
};

describe("Navigation rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("Navigation - active general - test", async () => {
      const { container } = render(<Navigation active="general" />);

      await waitFor(() => {
         assertRendered();
         assertGroupsRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("Navigation - active account - test", async () => {
      const { container } = render(<Navigation active="account" />);

      await waitFor(() => {
         assertRendered();
         assertGroupsRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("Navigation - active subscription - test", async () => {
      const { container } = render(<Navigation active="subscription" />);

      await waitFor(() => {
         assertRendered();
         assertGroupsRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("Navigation - active prompt-categories - test", async () => {
      const { container } = render(<Navigation active="prompt-categories" />);

      await waitFor(() => {
         assertRendered();
         assertGroupsRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("Navigation functionality tests", () => {
   beforeEach(() => {
      mockRouter.push("/");
   });

   it("Navigation - account link clicked - test", async () => {
      render(<Navigation active="general" />);

      await waitFor(() => {
         assertRendered();
         assertGroupsRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const link = screen.getByTestId("account-link");
      userEvent.click(link);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual("/account");
      });
   });
});
