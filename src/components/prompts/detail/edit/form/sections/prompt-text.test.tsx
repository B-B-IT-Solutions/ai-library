import { render, screen } from "@testing-library/react";
import { assertInDocument } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { DPromptUpdate } from "@/data/types/domain/prompt";

import { PromptText } from "./prompt-text";

const TestWrapper = () => {
   const form = useForm<DPromptUpdate>({
      defaultValues: {
         title: "",
         description: "",
         content: "",
         recommendedModel: "Claude",
         categories: [],
         fields: [],
      },
   });

   return (
      <FormProvider {...form}>
         <PromptText control={form.control} />
      </FormProvider>
   );
};

const assertRendered = () => {
   const section = screen.getByTestId("prompt-text");
   const content = screen.getByTestId("content");

   assertInDocument(section);
   assertInDocument(content);
};

describe("PromptText rendering tests", () => {
   it("rendered - test", () => {
      const { container } = render(<TestWrapper />);

      assertRendered();

      expect(container).toMatchSnapshot();
   });
});
