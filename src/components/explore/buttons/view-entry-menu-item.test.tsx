import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument } from "@tests";
import mockRouter from "next-router-mock";

import { ViewEntryMenuItem } from "./view-entry-menu-item";

const assertRendered = () => {
   const menuItem = screen.getByTestId("view-entry-menu-item");
   assertInDocument(menuItem);
};

describe("ViewEntryMenuItem rendering tests", () => {
   it("rendered - test", async () => {
      const slug = "entry-slug-1";
      const { container } = render(<ViewEntryMenuItem slug={slug} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("ViewEntryMenuItem functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      mockRouter.push("/");
   });

   it("view item click - test", async () => {
      const slug = "entry-slug-1";
      render(<ViewEntryMenuItem slug={slug} />);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const trigger = screen.getByTestId("trigger-btn");
      await userEvent.click(trigger);

      const editBtn = screen.getByTestId("view-entry-menu-item");
      await userEvent.click(editBtn);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual(`/explore/${slug}`);
      });
   });
});
