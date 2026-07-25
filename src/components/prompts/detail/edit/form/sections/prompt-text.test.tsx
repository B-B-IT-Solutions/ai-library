import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, assertVisbile } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { DPromptUpdate } from "@/data/types/domain/prompt";

import { PromptText } from "./prompt-text";

type WrapperProps = {
   isEdit?: boolean;
};

const TestWrapper = ({ isEdit = false }: WrapperProps) => {
   const [versionNote, setVersionNote] = useState("");

   const form = useForm<DPromptUpdate>({
      defaultValues: {
         title: "",
         description: "",
         content: "",
         model: "Claude",
         categories: [],
         fields: [],
      },
   });

   return (
      <FormProvider {...form}>
         <PromptText
            control={form.control}
            isEdit={isEdit}
            versionNote={versionNote}
            onVersionNoteChange={setVersionNote}
         />
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

   it("create mode - version note section not rendered - test", () => {
      render(<TestWrapper isEdit={false} />);

      assertRendered();
      assertNotInDocument(screen.queryByTestId("version-note-section"));
   });

   it("edit mode - version note collapsed by default - test", () => {
      render(<TestWrapper isEdit={true} />);

      assertInDocument(screen.getByTestId("version-note-section"));
      assertInDocument(screen.getByTestId("add-version-note-btn"));
      assertNotInDocument(screen.queryByTestId("version-note-textarea"));
   });

   it("edit mode - expands note field on click - test", async () => {
      render(<TestWrapper isEdit={true} />);

      await userEvent.click(screen.getByTestId("add-version-note-btn"));

      assertVisbile(screen.getByTestId("version-note-textarea"));
      assertNotInDocument(screen.queryByTestId("add-version-note-btn"));
   });

   it("edit mode - typing into note field updates value - test", async () => {
      render(<TestWrapper isEdit={true} />);

      await userEvent.click(screen.getByTestId("add-version-note-btn"));
      const textarea = screen.getByTestId("version-note-textarea");
      await userEvent.type(textarea, "Ton angepasst");

      expect(textarea).toHaveValue("Ton angepasst");
   });
});
