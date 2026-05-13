jest.mock("@/data/actions/prompt");
jest.mock("sonner");

import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";
import { cloneDeep } from "es-toolkit";
import mockRouter from "next-router-mock";
import { toast } from "sonner";

import { createPrompt, updatePrompt } from "@/data/actions/prompt";
import { DPrompt0Update } from "@/data/types/domain/prompt0";

import { PromptEdit } from "./prompt-edit";

const mockCreatePrompt = createPrompt as jest.MockedFunction<
   typeof createPrompt
>;

const mockUpdatePrompt = updatePrompt as jest.MockedFunction<
   typeof updatePrompt
>;

const assertRendered = () => {
   const form = screen.getByTestId("prompt-edit-form");
   const basicInfo = screen.getByTestId("basic-info-edit");
   const contentEdit = screen.getByTestId("prompt-content-edit");
   const followUps = screen.getByTestId("follow-up-prompts-edit");

   assertInDocument(form);
   assertInDocument(basicInfo);
   assertInDocument(contentEdit);
   assertInDocument(followUps);
};

const assertCreateBtnsRendered = () => {
   const cancelBtn = screen.getByTestId("cancel-btn");
   const createBtn = screen.getByTestId("create-btn");

   assertInDocument(cancelBtn);
   assertInDocument(createBtn);
};

const assertEditBtnsRendered = () => {
   const cancelBtn = screen.getByTestId("cancel-btn");
   const saveBtn = screen.getByTestId("save-btn");
   const dropdownTriggerBtn = screen.getByTestId("dropdown-trigger-btn");

   assertInDocument(cancelBtn);
   assertInDocument(saveBtn);
   assertInDocument(saveBtn);
   assertInDocument(dropdownTriggerBtn);
};

describe("PromptEdit rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("PromptEdit - create mode - rendered test", async () => {
      const { container } = render(<PromptEdit mode="create" />);

      await waitFor(() => {
         assertRendered();
         assertCreateBtnsRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("PromptEdit - edit mode - rendered test", async () => {
      const prompt = dtestData.dPromptDescriptor();
      const { container } = render(<PromptEdit mode="edit" prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         assertEditBtnsRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PromptEdit functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/");
   });

   it("PromptEdit - create mode - cancel btn clicked - test", async () => {
      render(<PromptEdit mode="create" />);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.back).not.toHaveBeenCalled();
      });

      const cancelBtn = screen.getByTestId("cancel-btn");
      await userEvent.click(cancelBtn);

      expect(mockRouter.back).toHaveBeenCalledTimes(1);
   });

   it("PromptEdit - edit mode - cancel btn clicked - test", async () => {
      const prompt = dtestData.dPromptDescriptor();
      render(<PromptEdit mode="edit" prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.back).not.toHaveBeenCalled();
      });

      const cancelBtn = screen.getByTestId("cancel-btn");
      await userEvent.click(cancelBtn);

      expect(mockRouter.back).toHaveBeenCalledTimes(1);
   });

   it("PromptEdit - create mode - save success - test", async () => {
      const actionResult = {
         success: true,
         message: "Prompt created successfully",
      };
      mockCreatePrompt.mockResolvedValue(actionResult);

      render(<PromptEdit mode="create" />);

      await waitFor(() => {
         assertRendered();
         expect(mockCreatePrompt).not.toHaveBeenCalled();
      });

      const createBtn = screen.getByTestId("create-btn");
      await userEvent.click(createBtn);

      await waitFor(() => {
         expect(mockCreatePrompt).not.toHaveBeenCalled();
      });

      const title = screen.getByTestId("title");
      const titleInput = within(title).getByTestId("input");
      await userEvent.type(titleInput, "Test Title");
      expect(titleInput).toHaveValue("Test Title");

      await userEvent.click(createBtn);

      const expectedPromptPayload: DPrompt0Update = {
         title: "Test Title",
         content: "",
         categories: [],
         recommendedModel: "",
         followUpPrompts: [],
      };

      await waitFor(() => {
         expect(mockCreatePrompt).toHaveBeenCalledTimes(1);
         expect(mockCreatePrompt).toHaveBeenCalledWith(expectedPromptPayload);
         expect(toast.success).toHaveBeenCalledTimes(1);
         expect(toast.success).toHaveBeenCalledWith(actionResult.message);
         expect(mockRouter.pathname).toEqual(`/prompts`);
      });
   });

   it("PromptEdit - edit mode - save success - test", async () => {
      const actionResult = {
         success: true,
         message: "Prompt updated successfully",
      };
      mockUpdatePrompt.mockResolvedValue(actionResult);

      const prompt = dtestData.dPromptDescriptor();
      render(<PromptEdit mode="edit" prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         expect(mockUpdatePrompt).not.toHaveBeenCalled();
      });

      const saveBtn = screen.getByTestId("save-btn");
      await userEvent.click(saveBtn);

      const expectedPromptPayload: DPrompt0Update = {
         title: prompt.title,
         content: prompt.content,
         categories: prompt.categories.map((c) => c.name),
         recommendedModel: prompt.recommendedModel,
         followUpPrompts: prompt.followUpPrompts,
      };

      await waitFor(() => {
         expect(mockUpdatePrompt).toHaveBeenCalledTimes(1);
         expect(mockUpdatePrompt).toHaveBeenCalledWith(
            prompt.id,
            expectedPromptPayload,
            false
         );
         expect(toast.success).toHaveBeenCalledTimes(1);
         expect(toast.success).toHaveBeenCalledWith(actionResult.message);
         expect(mockRouter.pathname).toEqual(`/prompts/${prompt.id}`);
      });
   });

   it("PromptEdit - edit mode - save new version success - test", async () => {
      const actionResult = {
         success: true,
         message: "Prompt updated successfully",
      };
      mockUpdatePrompt.mockResolvedValue(actionResult);

      const prompt = dtestData.dPromptDescriptor();
      render(<PromptEdit mode="edit" prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         expect(mockUpdatePrompt).not.toHaveBeenCalled();
      });

      const triggerBtn = screen.getByTestId("dropdown-trigger-btn");
      await userEvent.click(triggerBtn);

      await waitFor(() => {
         const saveBtn = screen.getByTestId("save-with-version-btn");
         assertInDocument(saveBtn);
      });

      const saveBtn = screen.getByTestId("save-with-version-btn");
      await userEvent.click(saveBtn);

      const expectedPromptPayload: DPrompt0Update = {
         title: prompt.title,
         content: prompt.content,
         categories: prompt.categories.map((c) => c.name),
         recommendedModel: prompt.recommendedModel,
         followUpPrompts: prompt.followUpPrompts,
      };

      await waitFor(() => {
         expect(mockUpdatePrompt).toHaveBeenCalledTimes(1);
         expect(mockUpdatePrompt).toHaveBeenCalledWith(
            prompt.id,
            expectedPromptPayload,
            true
         );
         expect(toast.success).toHaveBeenCalledTimes(1);
         expect(toast.success).toHaveBeenCalledWith(actionResult.message);
         expect(mockRouter.pathname).toEqual(`/prompts/${prompt.id}`);
      });
   });

   it("PromptEdit - edit mode - save failed - test", async () => {
      const actionResult = {
         success: false,
         message: "Failed to update prompt",
      };
      mockUpdatePrompt.mockResolvedValue(actionResult);

      const prompt1 = dtestData.dPromptDescriptor();

      const prompt2 = cloneDeep(prompt1);
      prompt2.categories.push({ name: " " });
      prompt2.followUpPrompts.push({ id: "0", order: 10, content: " " });

      render(<PromptEdit mode="edit" prompt={prompt2} />);

      await waitFor(() => {
         assertRendered();
         expect(mockUpdatePrompt).not.toHaveBeenCalled();
      });

      const saveBtn = screen.getByTestId("save-btn");
      await userEvent.click(saveBtn);

      const expectedPromptPayload: DPrompt0Update = {
         title: prompt1.title,
         content: prompt1.content,
         categories: prompt1.categories.map((c) => c.name),
         recommendedModel: prompt1.recommendedModel,
         followUpPrompts: prompt1.followUpPrompts,
      };

      await waitFor(() => {
         expect(mockUpdatePrompt).toHaveBeenCalledTimes(1);
         expect(mockUpdatePrompt).toHaveBeenCalledWith(
            prompt1.id,
            expectedPromptPayload,
            false
         );
         expect(toast.error).toHaveBeenCalledTimes(1);
         expect(toast.error).toHaveBeenCalledWith(actionResult.message);
         expect(mockRouter.pathname).toEqual("/");
      });
   });
});
