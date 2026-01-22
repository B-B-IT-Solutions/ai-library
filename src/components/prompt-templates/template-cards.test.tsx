import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";

import { TemplateCards } from "./template-cards";

const assertRendered = () => {
   const cards = screen.getByTestId("template-cards");
   assertInDocument(cards);
};

const assertTemplatesRendered = () => {
   const cardItems = screen.getAllByTestId("template-card");
   expect(cardItems).toHaveLength(3);
};

const assertTemplatesEmpty = () => {
   const emptyTemplates = screen.getByTestId("empty-templates");
   assertInDocument(emptyTemplates);
};

describe("TemplateCards rendering tests", () => {
   it("TemplateCards - templates empty - rendered test", async () => {
      const { container } = render(
         <TemplateCards templates={[]} onSelect={jest.fn()} />
      );

      await waitFor(() => {
         assertRendered();
         assertTemplatesEmpty();
      });

      expect(container).toMatchSnapshot();
   });

   it("TemplateCards rendered test", async () => {
      const templates = dtestData.dPromptTemplateDescriptors();

      const { container } = render(
         <TemplateCards templates={templates} onSelect={jest.fn()} />
      );

      await waitFor(() => {
         assertRendered();
         assertTemplatesRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("TemplateCard functionality tests", () => {
   it("TemplateCard - template clicked = test", async () => {
      const templates = dtestData.dPromptTemplateDescriptors();
      const onSelectFn = jest.fn();

      render(<TemplateCards templates={templates} onSelect={onSelectFn} />);

      await waitFor(() => {
         assertRendered();
         expect(onSelectFn).not.toHaveBeenCalled();
      });

      const card = screen.getAllByTestId("template-card")[0];
      userEvent.click(card);

      await waitFor(() => {
         expect(onSelectFn).toHaveBeenCalledTimes(1);
         expect(onSelectFn).toHaveBeenCalledWith(templates[0]);
      });
   });
});
