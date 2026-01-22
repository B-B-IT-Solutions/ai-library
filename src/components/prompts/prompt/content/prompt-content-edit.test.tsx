import { render, screen, waitFor } from "@testing-library/react";
import { assertInDocument, assertNotInDocument } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { PromptFormValues } from "@/data/types/domain/prompt";

import { PromptContentEdit } from "./prompt-content-edit";

const TestWrapper = ({ isEdit = false }: { isEdit?: boolean }) => {
   const methods = useForm<PromptFormValues>({
      defaultValues: {
         title: "",
         content: "",
         categories: [],
         recommendedModel: "",
         followUpPrompts: [],
      },
   });

   return (
      <FormProvider {...methods}>
         <PromptContentEdit control={methods.control} isEdit={isEdit} />
      </FormProvider>
   );
};

const assertRendered = () => {
   const contentEdit = screen.getByTestId("prompt-content-edit");
   const editor = screen.getByTestId("prompt-editor");
   const heading = screen.getByText("Prompt");

   assertInDocument(contentEdit);
   assertInDocument(editor);
   assertInDocument(heading);
};

const assertVersionNoticeRendered = () => {
   const notice = screen.getByTestId("version-notice");
   assertInDocument(notice);
};

const assertVersionNoticeNotRendered = () => {
   const notice = screen.queryByTestId("version-notice");
   assertNotInDocument(notice);
};

describe("PromptContentEdit rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("PromptContentEdit - isEdit true - test", async () => {
      const { container } = render(<TestWrapper isEdit={true} />);

      await waitFor(() => {
         assertRendered();
         assertVersionNoticeRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("PromptContentEdit - isEdit false - test", async () => {
      const { container } = render(<TestWrapper isEdit={false} />);

      await waitFor(() => {
         assertRendered();
         assertVersionNoticeNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
