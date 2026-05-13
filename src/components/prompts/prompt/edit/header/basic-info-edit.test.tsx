import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { DPrompt0Update } from "@/data/types/domain/prompt";

import { BasicInfoEdit } from "./basic-info-edit";

const TestWrapper = ({
   title: title = "",
   recommendedModel = "",
   categories = [],
}: {
   title?: string;
   recommendedModel?: string;
   categories?: string[];
}) => {
   const methods = useForm<DPrompt0Update>({
      defaultValues: {
         title: title,
         content: "",
         categories: categories,
         recommendedModel: recommendedModel,
         followUpPrompts: [],
      },
   });

   return (
      <FormProvider {...methods}>
         <BasicInfoEdit control={methods.control} />
      </FormProvider>
   );
};

const assertRendered = () => {
   const component = screen.getByTestId("basic-info-edit");
   const title = screen.getByTestId("title");
   const recommendedModel = screen.getByTestId("recommended-model");
   const categories = screen.getByTestId("categories");
   const triggerBtn = screen.getByTestId("recommended-model-trigger-btn");

   assertInDocument(component);
   assertInDocument(title);
   assertInDocument(recommendedModel);
   assertInDocument(categories);
   assertInDocument(triggerBtn);
};

describe("BasicInfoEdit rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("BasicInfoEdit - empty - rendered test", async () => {
      const { container } = render(<TestWrapper />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("BasicInfoEdit - with data - rendered test", async () => {
      const { container } = render(
         <TestWrapper
            title="Test Title"
            recommendedModel="Claude"
            categories={["Category 1", "Category 2"]}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("BasicInfoEdit functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("BasicInfoEdit - recommended model selected - test", async () => {
      render(<TestWrapper />);

      await waitFor(() => {
         assertRendered();
      });

      const triggerBtn = screen.getByTestId("recommended-model-trigger-btn");
      await userEvent.click(triggerBtn);

      await waitFor(() => {
         const gpt4 = screen.getByText("ChatGPT");
         assertInDocument(gpt4);
      });

      const gpt = screen.getByText("ChatGPT");
      await userEvent.click(gpt);

      await waitFor(() => {
         expect(triggerBtn).toHaveTextContent("ChatGPT");
      });
   });

   it("BasicInfoEdit - new recommended model added - test", async () => {
      render(<TestWrapper />);

      await waitFor(() => {
         assertRendered();
      });

      const triggerBtn = screen.getByTestId("recommended-model-trigger-btn");
      await userEvent.click(triggerBtn);

      await waitFor(() => {
         const input = screen.getByTestId("model-input");
         assertInDocument(input);
      });

      const input = screen.getByTestId("model-input");
      await userEvent.type(input, "ChatGPT-123");

      await waitFor(() => {
         const addModel = screen.getByTestId("add-new-model");
         assertInDocument(addModel);
      });

      const addModel = screen.getByTestId("add-new-model");
      await userEvent.click(addModel);

      await waitFor(() => {
         expect(triggerBtn).toHaveTextContent("ChatGPT-123");
      });
   });
});
