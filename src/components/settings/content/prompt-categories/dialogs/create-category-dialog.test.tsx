jest.mock("@/data/actions/prompt");
jest.mock("sonner");

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, typeIntoInput } from "@tests";
import mockRouter from "next-router-mock";
import { toast } from "sonner";

import { createPromptCategory } from "@/data/actions/prompt";
import { ActionResult } from "@/data/types/utils";

import { CreateCategoryDialog } from "./create-category-dialog";

const createPromptCategoryMock = createPromptCategory as jest.MockedFunction<
   typeof createPromptCategory
>;

const toastMock = toast as jest.MockedFunction<typeof toast>;

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("create-category-dialog");
   const cancelBtn = screen.getByTestId("cancel-btn");
   const submitBtn = screen.getByTestId("submit-btn");

   assertInDocument(dialog);
   assertInDocument(cancelBtn);
   assertInDocument(submitBtn);
};

const assertDialogNotRendered = () => {
   const dialog = screen.queryByTestId("create-category-dialog");
   assertNotInDocument(dialog);
};

describe("CreateCategoryDialog rendering tests", () => {
   it("open true - test", async () => {
      const { container } = render(
         <CreateCategoryDialog open={true} onClose={jest.fn()} />
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("open false - test", async () => {
      render(<CreateCategoryDialog open={false} onClose={jest.fn()} />);

      await waitFor(() => {
         assertDialogNotRendered();
      });
   });
});

describe("CreateCategoryDialog functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("submit btn clicked - result.success true - test", async () => {
      const category = { id: 1, name: "Vertrieb", count: 0 };
      const result: ActionResult = {
         success: true,
         message: "Kategorie erfolgreich erstellt",
         data: category,
      };
      createPromptCategoryMock.mockResolvedValue(result);

      const onClose = jest.fn();

      render(<CreateCategoryDialog open={true} onClose={onClose} />);

      await waitFor(() => {
         assertDialogRendered();
         expect(createPromptCategoryMock).not.toHaveBeenCalled();
      });

      await typeIntoInput("name", "Vertrieb");

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         expect(createPromptCategoryMock).toHaveBeenCalledTimes(1);
         expect(createPromptCategoryMock).toHaveBeenCalledWith({
            name: "Vertrieb",
         });
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
         expect(onClose).toHaveBeenCalledTimes(1);
      });
   });

   it("submit btn clicked - result.success false - test", async () => {
      const result: ActionResult = {
         success: false,
         message: "Kategorie konnte nicht erstellt werden",
      };
      createPromptCategoryMock.mockResolvedValue(result);

      const onClose = jest.fn();

      render(<CreateCategoryDialog open={true} onClose={onClose} />);

      await waitFor(() => {
         assertDialogRendered();
      });

      await typeIntoInput("name", "Vertrieb");

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         expect(createPromptCategoryMock).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).not.toHaveBeenCalled();
         expect(onClose).not.toHaveBeenCalled();
      });
   });

   it("submit btn clicked - validation error - test", async () => {
      const onClose = jest.fn();

      render(<CreateCategoryDialog open={true} onClose={onClose} />);

      await waitFor(() => {
         assertDialogRendered();
      });

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         expect(createPromptCategoryMock).not.toHaveBeenCalled();
         expect(onClose).not.toHaveBeenCalled();
      });
   });

   it("cancel btn clicked - test", async () => {
      const onClose = jest.fn();

      render(<CreateCategoryDialog open={true} onClose={onClose} />);

      await waitFor(() => {
         assertDialogRendered();
      });

      const cancelBtn = screen.getByTestId("cancel-btn");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         expect(createPromptCategoryMock).not.toHaveBeenCalled();
         expect(onClose).toHaveBeenCalledTimes(1);
      });
   });
});
