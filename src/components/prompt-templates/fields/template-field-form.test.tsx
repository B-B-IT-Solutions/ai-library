import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument } from "@tests";

import {
   DPromptTemplateField,
   DPromptTemplateFieldType,
} from "@/data/types/domain/prompt.template";

import { TemplateFieldForm } from "./template-field-form";

const createField = (
   type: DPromptTemplateFieldType,
   name: string,
   label: string,
   required = false
): DPromptTemplateField => ({
   id: `field-${name}`,
   promptTemplateId: "1",
   name,
   label,
   type,
   required,
   order: 1,
   defaultValue: null,
   description: null,
});

const assertRendered = () => {
   const form = screen.getByTestId("prompt-template-fields-form");
   const submitBtn = screen.getByTestId("submit-btn");
   const cancelBtn = screen.getByTestId("cancel-btn");

   assertInDocument(form);
   assertInDocument(submitBtn);
   assertInDocument(cancelBtn);
};

describe("TemplateFieldForm rendering tests", () => {
   it("TemplateFieldForm renders test", async () => {
      const name = createField("TEXT", "name", "Name");
      const email = createField("EMAIL", "email", "Email Address");
      const age = createField("NUMBER", "age", "Age");
      const birthdate = createField("DATE", "birthdate", "Birth Date");
      const bio = createField("TEXTAREA", "bio", "Biography");
      const newsletter = createField("CHECKBOX", "newsletter", "Newsletter");
      const gender: DPromptTemplateField = {
         ...createField("RADIO", "gender", "Gender"),
         options: ["Male", "Female"],
      };
      const country: DPromptTemplateField = {
         ...createField("SELECT", "country", "Country"),
         options: ["CZ", "RU", "Germany"],
      };

      const fields = [
         name,
         email,
         age,
         birthdate,
         bio,
         newsletter,
         gender,
         country,
      ];

      const onSubmit = jest.fn();
      const onCancel = jest.fn();

      const { container } = render(
         <TemplateFieldForm
            fields={fields}
            onSubmit={onSubmit}
            onCancel={onCancel}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("TemplateFieldForm functionality tests", () => {
   it("TemplateFieldForm - submit btn clicked - test", async () => {
      const fields = [createField("TEXT", "name", "Name")];
      const onSubmit = jest.fn();
      const onCancel = jest.fn();

      render(
         <TemplateFieldForm
            fields={fields}
            onSubmit={onSubmit}
            onCancel={onCancel}
         />
      );

      const input = screen.getByRole("textbox");
      await userEvent.type(input, "John Doe");

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         expect(onSubmit).toHaveBeenCalledTimes(1);
         expect(onSubmit).toHaveBeenCalledWith({ name: "John Doe" });
      });
   });

   it("TemplateFieldForm - cancel btn click - test", async () => {
      const fields = [createField("TEXT", "name", "Name")];
      const onSubmit = jest.fn();
      const onCancel = jest.fn();

      render(
         <TemplateFieldForm
            fields={fields}
            onSubmit={onSubmit}
            onCancel={onCancel}
         />
      );

      const cancelBtn = screen.getByTestId("cancel-btn");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         expect(onCancel).toHaveBeenCalledTimes(1);
         expect(onSubmit).not.toHaveBeenCalled();
      });
   });
});
