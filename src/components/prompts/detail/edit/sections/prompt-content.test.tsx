import { render, screen } from "@testing-library/react";
import { assertInDocument } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { PromptContent } from "./prompt-content";

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
         <PromptContent control={form.control} />
      </FormProvider>
   );
};

const assertRendered = () => {
   const section = screen.getByTestId("promt-content");
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
