import { zodResolver } from "@hookform/resolvers/zod";
import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";
import { forEach, reduce } from "es-toolkit/compat";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";

import {
   DPromptField,
   DPromptFieldType,
   DPromptGenerationData,
} from "@/data/types/domain/prompt";

import { PromptVariablesForm } from "./prompt-variables-form";
import { buildFieldsSchema } from "./variables.schema";

type Props = {
   templateData: DPromptGenerationData;
};

const TestWrapper = ({ templateData }: Props) => {
   const { allFields: fields } = templateData;
   const fieldsSchema = buildFieldsSchema(fields);

   type DFieldsType = z.infer<typeof fieldsSchema>;

   const form = useForm<DFieldsType>({
      resolver: zodResolver(fieldsSchema),
      defaultValues: reduce(
         fields,
         (acc, field) => ({
            ...acc,
            [field.name]:
               field.defaultValue ?? (field.type === "CHECKBOX" ? false : ""),
         }),
         {}
      ),
   });

   return (
      <FormProvider {...form}>
         <PromptVariablesForm
            templateData={templateData}
            control={form.control}
         />
      </FormProvider>
   );
};

const createField = (
   type: DPromptFieldType,
   name: string,
   label: string,
   required = false
): DPromptField => {
   return {
      id: `field-${name}`,
      promptId: "1",
      name,
      label,
      type,
      required,
      order: 1,
      defaultValue: null,
      description: null,
   };
};

const assertRendered = () => {
   const form = screen.getByTestId("prompt-variables-form");
   assertInDocument(form);
};

const assertFieldsRendered = (fields: DPromptField[]) => {
   forEach(fields, (f) => {
      const field = screen.getByTestId(f.name);
      assertInDocument(field);
   });
};

describe("PromptVariablesForm rendering tests", () => {
   it("render test", async () => {
      const name = createField("TEXT", "name", "Name");
      const email = createField("EMAIL", "email", "Email Address");
      const age = createField("NUMBER", "age", "Age");
      const birthdate = createField("DATE", "birthdate", "Birth Date");
      const bio = createField("TEXTAREA", "bio", "Biography");
      const newsletter = createField("CHECKBOX", "newsletter", "Newsletter");
      const gender: DPromptField = {
         ...createField("RADIO", "gender", "Gender"),
         options: ["Male", "Female"],
      };
      const country: DPromptField = {
         ...createField("SELECT", "country", "Country"),
         options: ["CZ", "RU", "Germany"],
      };

      const fields: DPromptField[] = [
         name,
         email,
         age,
         birthdate,
         bio,
         newsletter,
         gender,
         country,
      ];

      const templateData = dtestData.dPromptGenerationData();
      templateData.allFields = fields;

      const { container } = render(<TestWrapper templateData={templateData} />);

      await waitFor(() => {
         assertRendered();
         assertFieldsRendered(fields);
      });

      expect(container).toMatchSnapshot();
   });
});
