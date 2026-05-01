jest.mock("@/data/actions/template");
jest.mock("sonner");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";
import mockRouter from "next-router-mock";
import { toast } from "sonner";

import { deleteTemplateDescriptor } from "@/data/actions/template";

import { DeleteTemplateButton } from "./delete-template-button";

const toastMock = toast as jest.MockedFunction<typeof toast>;

const deleteTemplateDescriptorMock =
   deleteTemplateDescriptor as jest.MockedFunction<
      typeof deleteTemplateDescriptor
   >;

const assertRendered = () => {
   const deleteBtn = screen.getByTestId("delete-template-menu-item");
   assertInDocument(deleteBtn);
};

describe("DeleteTemplateButton rendering tests", () => {
   it("rendered test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptor();
      const { container } = render(
         <DeleteTemplateButton descriptor={descriptor} />
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
      mockRouter.push("/templates/test-id");
   });

   it("confirm btn clicked - result.success true - test", async () => {
      const actionResult = {
         success: true,
         message: "Prompt deleted",
      };
      deleteTemplateDescriptorMock.mockResolvedValue(actionResult);

      const descriptor = dtestData.dPromptTemplateDescriptor();
      render(<DeleteTemplateButton descriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
         expect(deleteTemplateDescriptorMock).not.toHaveBeenCalled();
      });

      const deleteBtn = screen.getByTestId("delete-template-menu-item");
      await userEvent.click(deleteBtn);

      await waitFor(() => {
         expect(deleteTemplateDescriptorMock).not.toHaveBeenCalled();
      });

      const confirmBtn = screen.getByTestId("confirm-btn");
      await userEvent.click(confirmBtn);

      await waitFor(() => {
         expect(deleteTemplateDescriptorMock).toHaveBeenCalledTimes(1);
         expect(deleteTemplateDescriptorMock).toHaveBeenCalledWith(
            descriptor.id
         );
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(actionResult.message);
         expect(mockRouter.pathname).toEqual("/templates");
      });
   });

   it("confirm btn clicked - result.success false - test", async () => {
      const actionResult = {
         success: false,
         message: "Prompt couldn't be deleted",
      };
      deleteTemplateDescriptorMock.mockResolvedValue(actionResult);

      const descriptor = dtestData.dPromptTemplateDescriptor();
      render(<DeleteTemplateButton descriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
         expect(deleteTemplateDescriptorMock).not.toHaveBeenCalled();
      });

      const deleteBtn = screen.getByTestId("delete-template-menu-item");
      await userEvent.click(deleteBtn);

      await waitFor(() => {
         expect(deleteTemplateDescriptorMock).not.toHaveBeenCalled();
      });

      const confirmBtn = screen.getByTestId("confirm-btn");
      await userEvent.click(confirmBtn);

      await waitFor(() => {
         expect(deleteTemplateDescriptorMock).toHaveBeenCalledTimes(1);
         expect(deleteTemplateDescriptorMock).toHaveBeenCalledWith(
            descriptor.id
         );
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(actionResult.message);
         expect(mockRouter.pathname).toEqual("/templates/test-id");
      });
   });

   it("cancel btn clicked - delete not called - test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptor();
      render(<DeleteTemplateButton descriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
         expect(deleteTemplateDescriptorMock).not.toHaveBeenCalled();
      });

      const deleteBtn = screen.getByTestId("delete-template-menu-item");
      await userEvent.click(deleteBtn);

      await waitFor(() => {
         expect(deleteTemplateDescriptorMock).not.toHaveBeenCalled();
      });

      const cancelBtn = screen.getByTestId("cancel-btn");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         expect(deleteTemplateDescriptorMock).not.toHaveBeenCalled();
         expect(mockRouter.pathname).toEqual("/templates/test-id");
      });
   });
});
