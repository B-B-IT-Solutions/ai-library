import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";
import mockRouter from "next-router-mock";

import { DropdownMenu } from "@/components/shadcn/dropdown-menu";

import { EditCollectionButton } from "./edit-collection-button";

const assertRendered = () => {
   const editBtn = screen.getByTestId("edit-collection-menu-item");
   assertInDocument(editBtn);
};

describe("EditCollectionButton rendering tests", () => {
   it("rendered test", async () => {
      const collection = dtestData.dCollection();

      const { container } = render(
         <EditCollectionButton collection={collection} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("EditCollectionButton functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/collections/test-id");
   });

   it("edit btn clicked - test", async () => {
      const collection = dtestData.dCollection();
      render(
         <DropdownMenu>
            <EditCollectionButton collection={collection} />
         </DropdownMenu>
      );

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual("/collections/test-id");
      });

      const editBtn = screen.getByTestId("edit-collection-menu-item");
      await userEvent.click(editBtn);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual(
            `/collections/${collection.id}/edit`
         );
      });
   });
});
