import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument } from "@tests";

import { MobileNav } from "./mobile-nav";

const assertRendered = () => {
   const mobileNav = screen.getByTestId("mobile-nav");
   const trigger = screen.getByTestId("mobile-nav-trigger");

   assertInDocument(mobileNav);
   assertInDocument(trigger);
};

const assertNavigationRendered = () => {
   const navigation = screen.getByTestId("navigation");
   const explore = screen.getByTestId("explore-nav-item");
   const pricing = screen.getByTestId("pricing-nav-item");

   assertInDocument(navigation);
   assertInDocument(explore);
   assertInDocument(pricing);
};

const assertNavigationNotRendered = () => {
   const navigation = screen.queryByTestId("navigation");
   assertNotInDocument(navigation);
};

const assertLoginBtnsRendered = () => {
   const signIn = screen.getByTestId("sign-in-link");
   const signUp = screen.getByTestId("sign-up-link");

   assertInDocument(signIn);
   assertInDocument(signUp);
};

describe("MobileNav rendering tests", () => {
   it("authenticated true - test", async () => {
      const { container } = render(<MobileNav authenticated={true} />);

      await waitFor(() => {
         assertRendered();
         assertNavigationNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("authenticated false - test", async () => {
      const { container } = render(<MobileNav authenticated={false} />);

      await waitFor(() => {
         assertRendered();
         assertNavigationNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("MobileNav functionality tests", () => {
   it("trigger clicked - authenticated true - test", async () => {
      render(<MobileNav authenticated={true} />);

      await waitFor(() => {
         assertRendered();
         assertNavigationNotRendered();
      });

      const triggerBtn = screen.getByTestId("mobile-nav-trigger");
      await userEvent.click(triggerBtn);

      await waitFor(() => {
         assertRendered();
         assertNavigationRendered();
      });
   });

   it("trigger clicked - authenticated false - test", async () => {
      render(<MobileNav authenticated={false} />);

      await waitFor(() => {
         assertRendered();
         assertNavigationNotRendered();
      });

      const triggerBtn = screen.getByTestId("mobile-nav-trigger");
      await userEvent.click(triggerBtn);

      await waitFor(() => {
         assertRendered();
         assertNavigationRendered();
         assertLoginBtnsRendered();
      });
   });
});
