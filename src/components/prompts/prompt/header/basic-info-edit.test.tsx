import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument } from "@tests";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";

import { PromptFormValues } from "@/data/types/domain/prompt";

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
   const methods = useForm<PromptFormValues>({
      defaultValues: {
         title: title,
         content: "",
         categories: categories,
         recommendedModel: recommendedModel,
         followUpPrompts: [],
      },
   });

   const { fields, append, remove } = useFieldArray({
      control: methods.control,
      name: "categories",
   });

   const addCategory = (value: string) => {
      append(value);
   };

   const removeCategory = (index: number) => {
      remove(index);
   };

   return (
      <FormProvider {...methods}>
         <BasicInfoEdit
            control={methods.control}
            register={methods.register}
            categories={fields}
            addCategory={addCategory}
            removeCategory={removeCategory}
         />
      </FormProvider>
   );
};

const assertRendered = () => {
   const component = screen.getByTestId("basic-info-edit");
   const title = screen.getByTestId("title");
   const recommendedModel = screen.getByTestId("recommended-model");
   const categories = screen.getByTestId("categories");
   const triggerBtn = screen.getByTestId("recommended-model-trigger-btn");
   const addButton = screen.getByTestId("add-category-btn");

   assertInDocument(component);
   assertInDocument(title);
   assertInDocument(recommendedModel);
   assertInDocument(categories);
   assertInDocument(triggerBtn);
   assertInDocument(addButton);
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
            recommendedModel="Claude Sonnet 4.5"
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

   it("BasicInfoEdit - title edit - test", async () => {
      render(<TestWrapper />);

      await waitFor(() => {
         assertRendered();
      });

      const input = screen.getByTestId("title-input");
      await userEvent.type(input, "My Test Title");

      expect(input).toHaveValue("My Test Title");
   });

   it("BasicInfoEdit - recommended model selected - test", async () => {
      render(<TestWrapper />);

      await waitFor(() => {
         assertRendered();
      });

      const triggerBtn = screen.getByTestId("recommended-model-trigger-btn");
      await userEvent.click(triggerBtn);

      await waitFor(() => {
         const gpt4 = screen.getByText("GPT-4");
         assertInDocument(gpt4);
      });

      const gpt4 = screen.getByText("GPT-4");
      await userEvent.click(gpt4);

      await waitFor(() => {
         expect(triggerBtn).toHaveTextContent("GPT-4");
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
      await userEvent.type(input, "GPT-4-123");

      await waitFor(() => {
         const addModel = screen.getByTestId("add-new-model");
         assertInDocument(addModel);
      });

      const addModel = screen.getByTestId("add-new-model");
      await userEvent.click(addModel);

      await waitFor(() => {
         expect(triggerBtn).toHaveTextContent("GPT-4-123");
      });
   });

   it("BasicInfoEdit - add category btn clicked - test", async () => {
      const user = userEvent.setup();
      render(<TestWrapper categories={["Category 1"]} />);

      await waitFor(() => {
         assertRendered();
      });

      const addButton = screen.getByTestId("add-category-btn");
      await user.click(addButton);

      await waitFor(() => {
         const categoryInputs = screen.getAllByPlaceholderText(
            "Kategoriename eingeben"
         );
         expect(categoryInputs).toHaveLength(2);
      });
   });

   it("BasicInfoEdit - remove category btn clicked  -text", async () => {
      render(<TestWrapper categories={["Cat 1", "Cat 2"]} />);

      await waitFor(() => {
         assertRendered();
      });

      const removeBtn = screen.getByTestId("remove-category-btn-0");

      await userEvent.click(removeBtn);

      await waitFor(() => {
         const categoryInputs = screen.getAllByPlaceholderText(
            "Kategoriename eingeben"
         );
         expect(categoryInputs).toHaveLength(1);
      });
   });

   it("BasicInfoEdit - can type in category input", async () => {
      render(<TestWrapper categories={[""]} />);

      await waitFor(() => {
         assertRendered();
      });

      const categoryInput = screen.getByPlaceholderText(
         "Kategoriename eingeben"
      );
      await userEvent.type(categoryInput, "New Category");

      expect(categoryInput).toHaveValue("New Category");
   });
});
