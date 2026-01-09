import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";

import { TemplateCard } from "./template-card";

const assertRendered = () => {
   const card = screen.getByTestId("template-card");
   const tags = screen.getByTestId("tags");
   const content = screen.getByTestId("content");

   assertInDocument(card);
   assertInDocument(tags);
   assertInDocument(content);
};

describe("TemplateCard rendering tests", () => {
   it("TemplateCard rendered test", async () => {
      const template = dtestData.dPromptTemplateDescriptor();

      const { container } = render(
         <TemplateCard template={template} onSelect={jest.fn()} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("TemplateCard functionality tests", () => {
   it("TemplateCard - template clicked - test", async () => {
      const template = dtestData.dPromptTemplateDescriptor();
      const onSelectFn = jest.fn();

      render(<TemplateCard template={template} onSelect={onSelectFn} />);

      await waitFor(() => {
         assertRendered();
         expect(onSelectFn).not.toHaveBeenCalled();
      });

      const card = screen.getByTestId("template-card");
      userEvent.click(card);

      await waitFor(() => {
         expect(onSelectFn).toHaveBeenCalledTimes(1);
         expect(onSelectFn).toHaveBeenCalledWith(template);
      });
   });
});
