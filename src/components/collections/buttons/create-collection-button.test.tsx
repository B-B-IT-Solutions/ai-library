import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument } from "@tests";
import mockRouter from "next-router-mock";

import { CreateCollectionButton } from "./create-collection-button";

const assertRendered = () => {
   const btn = screen.getByTestId("create-collection-btn");
   assertInDocument(btn);
};

describe("CreateCollectionButton rendering tests", () => {
   it("size - undefined - test", async () => {
      const { container } = render(<CreateCollectionButton />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("size - sm - test", async () => {
      const { container } = render(<CreateCollectionButton size="sm" />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CreateCollectionButton functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      mockRouter.push("/");
   });

   it("create btn clicked - test", async () => {
      render(<CreateCollectionButton />);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const btn = screen.getByTestId("create-collection-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual("/collections/new");
      });
   });
});
