import { FC } from "react";
import { render, screen } from "@testing-library/react";
import { assertInDocument } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { FormMDEditor } from "./form-md-editor";

type Props = {
   name: string;
   placeholder: string;
};

const TestWrapper: FC<Props> = ({ name, placeholder }) => {
   const form = useForm({
      defaultValues: {
         [name]: "",
      },
   });

   return (
      <FormProvider {...form}>
         <FormMDEditor
            name={name}
            placeholder={placeholder}
            control={form.control}
         />
      </FormProvider>
   );
};

const assertRendered = (name: string) => {
   const field = screen.getByTestId(name);
   const tiptap = screen.getByTestId("tiptap-editor");

   assertInDocument(field);
   assertInDocument(tiptap);
};

describe("FormMDEditor rendering tests", () => {
   it("FormMDEditor rendered test", () => {
      const name = "test-1";
      const { container } = render(
         <TestWrapper name={name} placeholder="Placeholder 1" />
      );

      assertRendered(name);

      expect(container).toMatchSnapshot();
   });
});
