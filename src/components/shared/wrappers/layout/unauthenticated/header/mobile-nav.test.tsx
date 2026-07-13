import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertHasAttributeWithValue,
   assertInDocument,
   assertNotInDocument,
} from "@tests";
import mockRouter from "next-router-mock";

import { MobileNav } from "./mobile-nav";

const assertRendered = () => {
   const mobileNav = screen.getByTestId("mobile-nav");
   const trigger = screen.getByTestId("mobile-nav-trigger");

   assertInDocument(mobileNav);
   assertInDocument(trigger);
};

const assertLibraryBtnRendered = () => {
   const libraryLink = screen.getByTestId("to-library-link");
   assertInDocument(libraryLink);
};

const assertLibraryBtnNotRendered = () => {
   const libraryLink = screen.queryByTestId("to-library-link");
   assertNotInDocument(libraryLink);
};

const assertNavigationRendered = () => {
   const navigation = screen.getByTestId("navigation");
   const exploreLink = screen.getByTestId("explore-nav-item");
   const pricingLink = screen.getByTestId("pricing-nav-item");
   const blogLink = screen.getByTestId("blog-nav-item");

   assertInDocument(navigation);
   assertInDocument(exploreLink);
   assertInDocument(pricingLink);
   assertInDocument(blogLink);

   assertHasAttributeWithValue(exploreLink, "href", "/explore");
   assertHasAttributeWithValue(
      pricingLink,
      "href",
      "https://www.vision-notes.com/pricing"
   );
   assertHasAttributeWithValue(
      blogLink,
      "href",
      "https://www.vision-notes.com/blog"
   );
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
         assertLibraryBtnNotRendered();
         assertNavigationNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("authenticated false - test", async () => {
      const { container } = render(<MobileNav authenticated={false} />);

      await waitFor(() => {
         assertRendered();
         assertLibraryBtnNotRendered();
         assertNavigationNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("MobileNav functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/explore");
   });

   it("trigger clicked - authenticated true - test", async () => {
      render(<MobileNav authenticated={true} />);

      await waitFor(() => {
         assertRendered();
         assertLibraryBtnNotRendered();
         expect(mockRouter.asPath).toEqual("/explore");
      });

      const triggerBtn = screen.getByTestId("mobile-nav-trigger");
      await userEvent.click(triggerBtn);

      await waitFor(() => {
         assertRendered();
         assertLibraryBtnRendered();
         expect(mockRouter.asPath).toEqual("/explore");
      });

      const libraryLink = screen.getByTestId("to-library-link");
      await userEvent.click(libraryLink);

      await waitFor(() => {
         expect(mockRouter.asPath).toEqual(`/`);
      });
   });

   it("trigger clicked - authenticated false - test", async () => {
      render(<MobileNav authenticated={false} />);

      await waitFor(() => {
         assertRendered();
         assertNavigationNotRendered();
         expect(mockRouter.asPath).toEqual("/explore");
      });

      const triggerBtn = screen.getByTestId("mobile-nav-trigger");
      await userEvent.click(triggerBtn);

      await waitFor(() => {
         assertRendered();
         assertNavigationRendered();
         assertLoginBtnsRendered();
         expect(mockRouter.asPath).toEqual("/explore");
      });

      const blogLink = screen.getByTestId("blog-nav-item");
      await userEvent.click(blogLink);

      await waitFor(() => {
         expect(mockRouter.asPath).toEqual(`/blog`);
      });
   });
});
