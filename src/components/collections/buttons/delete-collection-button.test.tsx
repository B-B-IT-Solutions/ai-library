jest.mock("@/data/actions/collection");
jest.mock("sonner");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";
import mockRouter from "next-router-mock";
import { toast } from "sonner";

import { deleteCollection } from "@/data/actions/collection";

import { DeleteCollectionButton } from "./delete-collection-button";

const toastMock = toast as jest.MockedFunction<typeof toast>;

const deleteTemplateDescriptorMock = deleteCollection as jest.MockedFunction<
   typeof deleteCollection
>;

const assertRendered = () => {
   const deleteBtn = screen.getByTestId("delete-collection-menu-item");
   assertInDocument(deleteBtn);
};

describe("DeleteTemplateButton rendering tests", () => {
   it("rendered test", async () => {
      const collection = dtestData.dCollection();
      const { container } = render(
         <DeleteCollectionButton collection={collection} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("DeleteTemplateButton functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/collections/test-id");
   });

   it("confirm btn clicked - result.success true - test", async () => {
      const actionResult = {
         success: true,
         message: "Prompt deleted",
      };
      deleteTemplateDescriptorMock.mockResolvedValue(actionResult);

      const collection = dtestData.dCollection();
      render(<DeleteCollectionButton collection={collection} />);

      await waitFor(() => {
         assertRendered();
         expect(deleteTemplateDescriptorMock).not.toHaveBeenCalled();
      });

      const deleteBtn = screen.getByTestId("delete-collection-menu-item");
      await userEvent.click(deleteBtn);

      await waitFor(() => {
         expect(deleteTemplateDescriptorMock).not.toHaveBeenCalled();
      });

      const confirmBtn = screen.getByTestId("confirm-btn");
      await userEvent.click(confirmBtn);

      await waitFor(() => {
         expect(deleteTemplateDescriptorMock).toHaveBeenCalledTimes(1);
         expect(deleteTemplateDescriptorMock).toHaveBeenCalledWith(
            collection.id
         );
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(actionResult.message);
         expect(mockRouter.pathname).toEqual("/collections");
      });
   });

   it("confirm btn clicked - result.success false - test", async () => {
      const actionResult = {
         success: false,
         message: "Prompt couldn't be deleted",
      };
      deleteTemplateDescriptorMock.mockResolvedValue(actionResult);

      const collection = dtestData.dCollection();
      render(<DeleteCollectionButton collection={collection} />);

      await waitFor(() => {
         assertRendered();
         expect(deleteTemplateDescriptorMock).not.toHaveBeenCalled();
      });

      const deleteBtn = screen.getByTestId("delete-collection-menu-item");
      await userEvent.click(deleteBtn);

      await waitFor(() => {
         expect(deleteTemplateDescriptorMock).not.toHaveBeenCalled();
      });

      const confirmBtn = screen.getByTestId("confirm-btn");
      await userEvent.click(confirmBtn);

      await waitFor(() => {
         expect(deleteTemplateDescriptorMock).toHaveBeenCalledTimes(1);
         expect(deleteTemplateDescriptorMock).toHaveBeenCalledWith(
            collection.id
         );
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(actionResult.message);
         expect(mockRouter.pathname).toEqual("/collections/test-id");
      });
   });

   it("cancel btn clicked - delete not called - test", async () => {
      const collection = dtestData.dCollection();
      render(<DeleteCollectionButton collection={collection} />);

      await waitFor(() => {
         assertRendered();
         expect(deleteTemplateDescriptorMock).not.toHaveBeenCalled();
      });

      const deleteBtn = screen.getByTestId("delete-collection-menu-item");
      await userEvent.click(deleteBtn);

      await waitFor(() => {
         expect(deleteTemplateDescriptorMock).not.toHaveBeenCalled();
      });

      const cancelBtn = screen.getByTestId("cancel-btn");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         expect(deleteTemplateDescriptorMock).not.toHaveBeenCalled();
         expect(mockRouter.pathname).toEqual("/collections/test-id");
      });
   });
});
