import { render, screen } from "@testing-library/react";
import { assertInDocument } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { PromptTemplateContent } from "./prompt-template-content";

const TestWrapper = () => {
   const form = useForm({
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
         <PromptTemplateContent control={form.control} />
      </FormProvider>
   );
};

const assertRendered = () => {
   const section = screen.getByTestId("prompt-template-content");
   const content = screen.getByTestId("content");

   assertInDocument(section);
   assertInDocument(content);
};

describe("PromptTemplateContent rendering tests", () => {
   it("PromptTemplateContent rendered test", () => {
      const { container } = render(<TestWrapper />);

      assertRendered();

      expect(container).toMatchSnapshot();
   });
});
